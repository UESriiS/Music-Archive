import * as React from 'react';
import Box from '@mui/material/Box';
import { Container, TableContainer, TextField, Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import TrackDetail from './TrackDetail';

export default function TrackSearch() {
  const [data, setData] = React.useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    fetch('api/tracks/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        track_genres: formData.get("track_genres"),
        artist_name: formData.get("artist_name"),
        album_title: formData.get("album_title"),
        track_title: formData.get("track_title")
      })
    }).then((res) => res.json())
      .then((track) => setData(track))

  }

  return (
    <Container>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '17ch' },
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField size="small" id="track_genres" name="track_genres" label="Genre" variant="standard" />
        <TextField size="small" id="artist_name" name="artist_name" label="Artist" variant="standard" />
        <TextField size="small" id="album_title" name="album_title" label="Album" variant="standard" />
        <TextField size="small" id="track_title" name="track_title" label="Track" variant="standard" />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <TrackDetail tractData={data} />
      </TableContainer>
    </Container>
  );
}