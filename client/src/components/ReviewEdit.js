import * as React from 'react';
import Rating from '@mui/material/Rating';
import { Grid, Box, TextField, Button, Alert, Stack } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useState } from "react";

import AuthHeader from '../services/AuthHeader';

const labels = {
  0.5: 'Trash',
  1: 'Trash+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Ok',
  3: 'Ok+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function Review({ playlistId, updatePlaylistFromChild, setUpdatePlaylistFromChild }) {
  const [value, setValue] = React.useState(0);
  const [hover, setHover] = React.useState(-1);
  const [info, setInfo] = useState("")

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const rating = data.get("rating")
    const comment = data.get("comment")

    try {
      setInfo("")
      fetch('api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...AuthHeader() },
        body: JSON.stringify({
          favourite_id: playlistId,
          rating: rating,
          comment: comment
        }),
      }).then((res) => res.json())
        .then((a) => {
          if (a && a.message) {
            setInfo(a.message)
            setUpdatePlaylistFromChild(!updatePlaylistFromChild)
          } else setInfo(JSON.stringify(a))
        });
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Grid component="form" noValidate onSubmit={handleSubmit}>
      {info && <Alert severity="info">{info}</Alert>}
      <Stack spacing={2}>
        <Box
          sx={{
            width: 200,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Rating
            name="rating"
            value={value}
            precision={1}
            getLabelText={getLabelText}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            onChangeActive={(event, newHover) => {
              setHover(newHover);
            }}
            emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
          {value !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
          )}
        </Box>
        <TextField
          fullWidth
          id="comment"
          name="comment"
          label="Comment"
          multiline
          rows={4}
        />
        <Box display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Stack>
    </Grid>
  );
}