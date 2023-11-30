import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Button, Link, Tabs, Tab } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { useAuth } from "../services/AuthContext"
import { useNavigate } from "react-router-dom";
import UserManage from './UserManage';
import ReviewManage from './ReviewManage';
import CopyrightManage from './CopyrightManage';
import Copyright from './Copyright';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const theme = createTheme();

export default function Admin() {
  const [value, setValue] = React.useState(0);
  const { currentUser, logOut } = useAuth()
  const navigate = useNavigate()

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function handleLogOut() {
    try {
      logOut()
      navigate("/")
    } catch {
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Music Library
          </Typography>
          <Button variant="text" color="inherit" href="/update-password">Update Password</Button>
          <Button variant="outlined" color="inherit" onClick={handleLogOut}>Log Out</Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Button variant="outlined" href="/dashboard">
              Return to Dashboard
            </Button>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Manage Users" {...a11yProps(0)} />
                  <Tab label="Manage Reviews" {...a11yProps(1)} />
                  <Tab label="Manage Copyrights" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <UserManage />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <ReviewManage />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <CopyrightManage />
              </TabPanel>
            </Box>
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          About Music Library
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Music Library offers tracks search and playlists management
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}
    </ThemeProvider>
  );
}