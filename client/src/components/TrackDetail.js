import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { TableContainer, Button } from '@mui/material';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.track_title}</TableCell>
        <TableCell align="right">{row.artist_name}</TableCell>
        <TableCell align="right">{
          <Button variant="contained" color="success"
            href={`https://www.youtube.com/results?search_query=${row.artist_name}-${row.track_title}`} target="_blank">
            Play on YouTube</Button>
        }</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="trackDetail">
                <TableHead>
                  <TableRow>
                    <TableCell>Genres</TableCell>
                    <TableCell>Album</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">Recorded Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.track_id}>
                    <TableCell>{JSON.parse(row.track_genres.replace(/'/g, '"')).map(a => a.genre_title).toString()}</TableCell>
                    <TableCell>{row.album_title}</TableCell>
                    <TableCell align="right">{row.track_duration}</TableCell>
                    <TableCell align="right">{row.track_date_recorded}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function TrackDetail({ tractData }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Track Title</TableCell>
            <TableCell align="right">Artist</TableCell>
            <TableCell align="right">Link</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tractData.map((row) => (
            <Row key={row.track_id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}