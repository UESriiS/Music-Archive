import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Button, ButtonGroup, Link } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Playlist from "./Playlist";
import TrackSearch from "./TrackSearch";
import Copyright from './Copyright';

const theme = createTheme();

export default function Dashboard() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Music Library
          </Typography>
          <Button variant="outlined" color="inherit" href="/signup">Sign up</Button>
          <Button variant="outlined" color="inherit" href="/login">Log in</Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Public Playlist
            </Typography>
            <Playlist />
            <Typography sx={{ pt: 4 }} variant="h5" align="center" color="text.secondary" paragraph>
              Tracks Search
            </Typography>
            <TrackSearch />
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