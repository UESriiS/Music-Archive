import * as React from 'react';
import { Table } from '@mui/material';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { Container, TableContainer, Button, Stack } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

import { useAuth } from "../services/AuthContext"
import CopyrightEdit from './CopyrightEdit';
import { styled } from '@mui/material/styles';

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

export default function CopyrightManage({ updatePlaylist }) {
  const { currentUser } = useAuth()

  const [data, setData] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState({});

  const [open, setOpen] = React.useState(false);
  const [isNew, setIsNew] = React.useState(false);

  const [updateCopyrightFromChild, setUpdateCopyrightFromChild] = React.useState(false)

  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleClickOpenNew = () => {
    setOpen(true);
    setIsNew(true);
  };


  const handleClose = () => {
    setOpen(false);
    setIsNew(false);
    setSelectedRow({})
  };

  const getInformation = (row) => {
    fetch("/api/information")
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  React.useEffect(() => {
    getInformation();
  }, [updateCopyrightFromChild]);

  return (
    <Container>
      <Stack container spacing={2}>
        <Button sx={{ width: 190 }} variant="contained" onClick={handleClickOpenNew}>Create Copyright</Button>

        <TableContainer component={Paper} >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell align="right">Title</TableCell>
                <TableCell align="right">Content</TableCell>
                <TableCell align="right">InfoKey</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && data.map((row) => (
                <TableRow
                  hover
                  onClick={() => handleClickOpen(row)}
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell align="right">{row.title}</TableCell>
                  <TableCell align="right">{row.content}</TableCell>
                  <TableCell align="right">{row.infoKey}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <BootstrapDialog
          open={open}
          onClose={handleClose}
        >
          <BootstrapDialogTitle onClose={handleClose}>
            Edit Copyright Info
          </BootstrapDialogTitle>
          <DialogContent>
            <CopyrightEdit isNew={isNew} copyright={selectedRow}
              updateCopyrightFromChild={updateCopyrightFromChild} setUpdateCopyrightFromChild={setUpdateCopyrightFromChild} />
          </DialogContent>
        </BootstrapDialog>
      </Stack>

    </Container>
  );
}