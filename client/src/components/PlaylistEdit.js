import * as React from 'react';
import { useState } from "react";

import { Stack, Button, Box, Alert, TextField, Checkbox, FormControlLabel } from '@mui/material';

import AuthHeader from '../services/AuthHeader';

export default function PlaylistEdit({ isNew, playlist, updatePlaylistFromChild, setUpdatePlaylistFromChild }) {
  if (isNew) {
    playlist = {
      name: "",
      description: "",
      trackIds: ""
    }
  }
  const [info, setInfo] = useState("")

  const createNew = async (name, description, trackIds) => {
    fetch('api/favourites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      body: JSON.stringify({
        is_public: false,
        name: name,
        description: description,
        trackIds: trackIds
      }),
    }).then((res) => res.json())
      .then((a) => {
        if (a && a.id) setInfo("Successfully created new playlist")
        else setInfo(a.message)
        setUpdatePlaylistFromChild(!updatePlaylistFromChild)
      });
  }

  const editExisting = async (is_public, name, description, trackIds) => {
    fetch(`api/favourites/${playlist.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      body: JSON.stringify({
        is_public: is_public,
        name: name,
        description: description,
        trackIds: trackIds
      }),
    }).then((res) => res.json())
      .then((a) => {
        setInfo(a.message)
        setUpdatePlaylistFromChild(!updatePlaylistFromChild)
      });
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const is_publicCheckbox = data.get("is_public")
    let is_public = false
    if (is_publicCheckbox === "on") is_public = true
    const name = data.get("name")
    const description = data.get("description")
    const trackIds = data.get("trackIds").split(',')

    if (name.match(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g)) {
      setInfo('Invalid playlist name!');
      return;
    }

    try {
      setInfo("")
      if (isNew) {
        createNew(name, description, trackIds)
      } else {
        editExisting(is_public, name, description, trackIds)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box component="form" noValidate spacing={2} onSubmit={handleSubmit}>
      {info && <Alert severity="info">{info}</Alert>}
      <Stack
        sx={{
          width: '40ch',
        }}
        spacing={2}
        autoComplete="off"
      >
        {!isNew && <FormControlLabel control={
          <Checkbox name="is_public" defaultChecked={playlist.is_public} />
        } label="Public" />}
        <TextField
          required
          id="name"
          name="name"
          label="Name"
          multiline
          defaultValue={playlist.name}
          variant="standard"
        />
        <TextField
          required
          id="description"
          name="description"
          label="Description"
          multiline
          defaultValue={playlist.description}
          variant="standard"
        />
        <TextField
          required
          id="trackIds"
          name="trackIds"
          label="Track Ids"
          multiline
          defaultValue={playlist.trackIds}
          helperText='Use "," to separate Track Ids'
          variant="standard"
        />
      </Stack>
      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
}