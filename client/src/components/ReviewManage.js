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

import AuthHeader from '../services/AuthHeader';

export default function ReviewManage() {

  const [data, setData] = React.useState([]);
  const [selectedRowHidden, setSelectedRowHidden] = React.useState({});

  const [openHidden, setOpenHidden] = React.useState(false);

  const [refreshReviews, setRefreshReviews] = React.useState(false)

  const handleClickOpenHidden = (row) => {
    setOpenHidden(true);
    setSelectedRowHidden(row);
  };

  const handleCloseHidden = () => {
    setOpenHidden(false);
  };

  const handleUpdateHidden = () => {
    setOpenHidden(false);

    try {
      fetch(`api/reviews/${selectedRowHidden.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
        body: JSON.stringify({
          favourite_id: selectedRowHidden.favourite_id,
          rating: selectedRowHidden.rating,
          comment: selectedRowHidden.comment,
          is_hidden: !selectedRowHidden.is_hidden
        }),
      }).then((res) => res.json())
        .then((data) => {
          if (data && data.updated) setRefreshReviews(!refreshReviews)
        })
    } catch (err) {
      console.log(err)
    }
  };

  const getReviews = (row) => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setData(data));
  }

  React.useEffect(() => {
    getReviews();
  }, [refreshReviews]);

  return (
    <Container>
      <TableContainer component={Paper} >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell align="right">Playlist</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Comment</TableCell>
              <TableCell align="right">Creator</TableCell>
              <TableCell align="right">Created Time</TableCell>
              <TableCell align="right">Hidden</TableCell>
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
                <TableCell align="right">{row.favourite_id}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">{row.comment}</TableCell>
                <TableCell align="right">{row.created_by_name}</TableCell>
                <TableCell align="right">{row.created_at}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onChange={(e) => { e.stopPropagation(); handleClickOpenHidden(row); }}>
                    <Checkbox checked={row.is_hidden} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openHidden}
        onClose={handleCloseHidden}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseHidden}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateHidden} autoFocus>Confirm</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}