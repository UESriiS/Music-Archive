import * as React from 'react';
import { Grid, Box, TextField, Button, Alert, Stack } from '@mui/material';

import { useState } from "react";

import AuthHeader from '../services/AuthHeader';

export default function CopyrightEdit({ isNew, copyright, updateCopyrightFromChild, setUpdateCopyrightFromChild }) {
  if (isNew) {
    copyright = {
      infoKey: "",
      title: "",
      content: ""
    }
  }
  const [info, setInfo] = useState("")

  const createNew = async (infoKey, title, content) => {
    fetch('api/information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      body: JSON.stringify({
        infoKey: infoKey,
        title: title,
        content: content
      }),
    }).then((res) => res.json())
      .then((a) => {
        if (a && a.id) setInfo("Successfully created new copyright")
        else setInfo(a.message)
      });
  }

  const editExisting = async (infoKey, title, content) => {
    fetch(`api/information/${copyright.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      body: JSON.stringify({
        infoKey: infoKey,
        title: title,
        content: content
      }),
    }).then((res) => res.json())
      .then((a) => {
        if (a && a.id) setInfo("Successfully updated copyright")
        else setInfo(a.message)
      });
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)

    const infoKey = data.get("infoKey")
    const title = data.get("title")
    const content = data.get("content")

    try {
      setInfo("")
      if (isNew) {
        createNew(infoKey, title, content)
      } else {
        editExisting(infoKey, title, content)
      }
    } catch (err) {
      console.log(err)
    } finally {
      setUpdateCopyrightFromChild(!updateCopyrightFromChild)
    }
  }

  return (
    <Stack sx={{ width: 500 }} spacing={2} component="form" noValidate onSubmit={handleSubmit}>
      {info && <Alert severity="info">{info}</Alert>}
      <TextField
        variant="standard"
        fullWidth
        id="infoKey"
        name="infoKey"
        label="InfoKey"
        defaultValue={copyright.infoKey}
      />
      <TextField
        variant="standard"
        fullWidth
        id="title"
        name="title"
        label="Title"
        defaultValue={copyright.title}
      />
      <TextField
        fullWidth
        id="content"
        name="content"
        label="Content"
        defaultValue={copyright.content}
        multiline
        rows={8}
      />
      <Box display="flex" justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Stack>
  );
}