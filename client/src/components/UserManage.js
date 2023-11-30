import * as React from 'react';
import { Table } from '@mui/material';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { Container, TableContainer, Button, Checkbox } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { useAuth } from "../services/AuthContext"
import AuthHeader from '../services/AuthHeader';

export default function UserManage() {
  const { currentUser } = useAuth()

  const [data, setData] = React.useState([]);
  const [selectedRowAdmin, setSelectedRowAdmin] = React.useState({});
  const [selectedRowInactive, setSelectedRowInactive] = React.useState({});

  const [openAdmin, setOpenAdmin] = React.useState(false);
  const [openInactive, setOpenInactive] = React.useState(false);

  const [refreshUsers, setRefreshUsers] = React.useState(false)

  const handleClickOpenAdmin = (row) => {
    setOpenAdmin(true);
    setSelectedRowAdmin(row);
  };

  const handleClickOpenInactive = (row) => {
    setOpenInactive(true);
    setSelectedRowInactive(row);
  };

  const handleCloseAdmin = () => {
    setOpenAdmin(false);
  };

  const handleCloseInactive = () => {
    setOpenInactive(false);
  };

  const handleUpdateAdmin = () => {
    setOpenAdmin(false);

    try {
      fetch(`api/admin/user-privilege/${selectedRowAdmin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
        body: JSON.stringify({ is_admin: !selectedRowAdmin.is_admin })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.updated) setRefreshUsers(!refreshUsers)
        })
    } catch (err) {
      console.log(err)
    }
  };

  const handleUpdateInactive = () => {
    setOpenInactive(false);

    try {
      fetch(`api/admin/user-status/${selectedRowInactive.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
        body: JSON.stringify({ is_inactive: !selectedRowInactive.is_inactive })
      }).then((res) => res.json())
        .then((data) => {
          if (data && data.updated) setRefreshUsers(!refreshUsers)
        })
    } catch (err) {
      console.log(err)
    }
  };

  const getUsers = (row) => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  React.useEffect(() => {
    getUsers();
  }, [refreshUsers]);

  return (
    <Container>
      <TableContainer component={Paper} >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Admin</TableCell>
              <TableCell align="right">Inactive</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((row) => (
              <TableRow
                hover
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onChange={(e) => { e.stopPropagation(); handleClickOpenAdmin(row); }}>
                    <Checkbox checked={row.is_admin} disabled={row.id === currentUser.id} />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onChange={(e) => { e.stopPropagation(); handleClickOpenInactive(row); }}>
                    <Checkbox checked={row.is_inactive} disabled={row.id === currentUser.id} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openAdmin}
        onClose={handleCloseAdmin}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseAdmin}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateAdmin} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInactive}
        onClose={handleCloseInactive}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseInactive}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateInactive} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}