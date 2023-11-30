import React from 'react';
import { ButtonGroup, Link, Typography, Button, Container, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Grid, Box } from '@mui/material';

export default function Copyright() {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleClickOpen = (item) => {
    setOpen(true)
    const text = data.find(x => x.infoKey === item.infoKey)
    setTitle(text.title)
    setContent(text.content)
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    fetch("/api/information")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  return (
    <Container>
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyright © '}
        ECE 9065
        {' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      <Grid
        display="flex"
        gap="10px"
        justifyContent="center"
      >
        {data && data.map((row) => (
          <Link key={row.id} onClick={() => handleClickOpen(row)}>{row.infoKey}</Link>
        ))}
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText >
            {content}
          </DialogContentText >
        </DialogContent>
        <DialogActions align="center">
          <Grid>
            <Button onClick={handleClose}>Close</Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Container>
  );
}