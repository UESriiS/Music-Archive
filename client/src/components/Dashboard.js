import React, { useState } from "react"
import { CssBaseline, Link, Grid, Box, Typography, Container } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useAuth } from "../services/AuthContext"
import { useNavigate } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import { Button, ButtonGroup } from '@mui/material';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

import Playlist from "./Playlist";
import PlaylistEdit from './PlaylistEdit';
import Copyright from './Copyright';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const theme = createTheme();

export default function Dashboard() {
  const { currentUser, logOut } = useAuth()
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  const [updatePlaylist, setUpdatePlaylist] = useState(false)

  const handleClickOpen = (row) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUpdatePlaylist(!updatePlaylist);
  };

  async function handleLogOut() {
    setError("")

    try {
      logOut()
      navigate("/")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ECE 9065
          </Typography>
          <Button variant="text" color="inherit" href="/update-password">Update Password</Button>
          <Button variant="outlined" color="inherit" onClick={handleLogOut}>Log Out</Button>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Hi, {currentUser.username}
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Email: {currentUser.email}
            </Typography>
            {currentUser && currentUser.is_admin &&
              <Box align='center'>
                <Button variant="contained" href="/admin">Admin Portal</Button>
              </Box>
            }
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            <Button variant="contained" onClick={handleClickOpen}>Create Playlist</Button>
          </Grid>
          <Grid container spacing={4} sx={{ py: 6 }} maxWidth="md">
            <Playlist updatePlaylist={updatePlaylist} />
            <div>
              <BootstrapDialog
                onClose={handleClose}
                open={open}
              >
                <BootstrapDialogTitle onClose={handleClose}>
                  Create Playlist
                </BootstrapDialogTitle>
                <DialogContent>
                  <PlaylistEdit isNew={true} />
                </DialogContent>
              </BootstrapDialog>
            </div>
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