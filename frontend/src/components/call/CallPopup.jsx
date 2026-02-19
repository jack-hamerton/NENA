
import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Grid } from '@mui/material';
import { Videocam, Mic } from '@mui/icons-material';

const CallPopup = ({ open, onClose, onStartCall, user }) => {
  if (!user) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Start a call with {user.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Videocam />}
              onClick={() => onStartCall('video')}
            >
              Video Call
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<Mic />}
              onClick={() => onStartCall('voice')}
            >
              Voice Call
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default CallPopup;
