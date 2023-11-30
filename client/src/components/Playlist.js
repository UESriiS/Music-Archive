import * as React from 'react';
import { Table } from '@mui/material';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { Container, TableContainer, Button, Checkbox } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContent, DialogActions } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RateReviewIcon from '@mui/icons-material/RateReview';

import AuthHeader from '../services/AuthHeader';
import { useAuth } from "../services/AuthContext"
import TrackDetail from './TrackDetail';
import PlaylistEdit from './PlaylistEdit';
import Review from './ReviewEdit';

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

export default function Playlist({ updatePlaylist }) {
  const { currentUser } = useAuth()

  const [data, setData] = React.useState([]);
  const [selectedRow, setSelectedRow] = React.useState({});
  const [selectedRowEdit, setSelectedRowEdit] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);
  const [updatePlaylistFromChild, setUpdatePlaylistFromChild] = React.useState(false)

  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };

  const handleClickOpenEdit = (row) => {
    setOpenEdit(true);
    setSelectedRowEdit(row);
  };

  const handleClickOpenDelete = (row) => {
    setOpenDelete(true);
    setSelectedRow(row);
  };

  const handleClickOpenReview = (row) => {
    setOpenReview(true);
    setSelectedRow(row);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = () => {
    setOpenDelete(false);
    try {
      fetch(`api/favourites/${selectedRow.id}`, {
        method: 'DELETE'
      }).then(getFavourites())
    } catch (err) {
      console.log(err)
    }
  };

  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const getFavourites = () => {
    if (currentUser) {
      fetch('api/favourites', {
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      }).then((res) => res.json())
        .then((data) => setData(data));
    } else {
      fetch("/api/favourites")
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  }

  React.useEffect(() => {
    if (currentUser) {
      fetch('api/favourites', {
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      }).then((res) => res.json())
        .then((data) => setData(data));
    } else {
      fetch("/api/favourites")
        .then((res) => res.json())
        .then((data) => setData(data));
    }
  },
    [currentUser, updatePlaylist, updatePlaylistFromChild]
  );

  return (
    <Container>
      <TableContainer component={Paper} >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Creator</TableCell>
              <TableCell align="right">Number Of Tracks</TableCell>
              <TableCell align="right">Total Play Time</TableCell>
              <TableCell align="right">Average Rating</TableCell>
              <TableCell align="right">Modified Time</TableCell>
              <TableCell align="right">Public</TableCell>
              {currentUser &&
                <>
                  <TableCell align="right">Review</TableCell>
                  <TableCell align="right">Edit</TableCell>
                  <TableCell align="right">Delete</TableCell>
                </>
              }
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
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.username}</TableCell>
                <TableCell align="right">{row.numberOfTracks}</TableCell>
                <TableCell align="right">{row.totalPlayTime}</TableCell>
                <TableCell align="right">{row.averageRating}</TableCell>
                <TableCell align="right">{row.modified_at}</TableCell>
                <TableCell align="right">{row.is_public ? 'True' : 'False'}</TableCell>
                {currentUser &&
                  <>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClickOpenReview(row) }}>
                        <RateReviewIcon />
                      </IconButton>
                    </TableCell>
                  </>
                }
                {currentUser && currentUser.id === row.created_by &&
                  <>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClickOpenEdit(row); }}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleClickOpenDelete(row) }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </>
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BootstrapDialog
        onClose={handleClose}
        open={open}
      >
        <BootstrapDialogTitle onClose={handleClose}>
          Track Details
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <TrackDetail tractData={selectedRow.trackDetail} />
        </DialogContent>
      </BootstrapDialog>

      <BootstrapDialog
        onClose={handleCloseEdit}
        open={openEdit}
      >
        <BootstrapDialogTitle onClose={handleCloseEdit}>
          Edit Playlist
        </BootstrapDialogTitle>
        <DialogContent>
          <PlaylistEdit isNew={false} playlist={selectedRowEdit}
            updatePlaylistFromChild={updatePlaylistFromChild} setUpdatePlaylistFromChild={setUpdatePlaylistFromChild} />
        </DialogContent>
      </BootstrapDialog>

      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
      >
        <DialogTitle>Are you sure to delete this playlist?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button variant="contained" onClick={handleDelete} autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>

      <BootstrapDialog
        maxWidth="md"
        onClose={handleCloseReview}
        open={openReview}
      >
        <BootstrapDialogTitle onClose={handleCloseReview}>
          Add Review
        </BootstrapDialogTitle>
        <DialogContent>
          <Review playlistId={selectedRow.id}
            updatePlaylistFromChild={updatePlaylistFromChild} setUpdatePlaylistFromChild={setUpdatePlaylistFromChild} />
        </DialogContent>
      </BootstrapDialog>

    </Container>
  );
}