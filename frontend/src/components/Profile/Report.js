import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { FormControl, InputLabel, Select, makeStyles, MenuItem } from '@material-ui/core';
import { RequestManager } from '../../models/RequestManager';
import { NotificationManager } from 'react-notifications';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Report = ({ username, openReport, setOpenReport }) => {
  const classes = useStyles();
  
  const [reason, setReason] = useState('2');

  const handleClose = () => {
    setOpenReport(false);
  }

  const handleChange = (event) => {
    setReason(event.target.value);
  }

  const handleSubmit = () => {
    handleClose();
    RequestManager.reportUser(username, reason)
    .then(() => {
      NotificationManager.success("L'utilisateur a été reporté")
    })
    .catch(() => {
      NotificationManager.error("Impossible de reporter l'utilisateur")
    })
  }

  return (
    <div>
      <Dialog open={openReport} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Reporter {username}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Quel problème signalez-vous au sujet de {username} ?
            </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="reason-simple">Raison</InputLabel>
            <Select
              value={reason}
              onChange={handleChange}
              inputProps={{
                name: 'reason',
                id: 'reason-simple',
              }}
            >
              <MenuItem value='1'>Usurpation d'identité</MenuItem>
              <MenuItem value='2'>Comportement inapproprié</MenuItem>
              <MenuItem value='3'>Menace suicide</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
            </Button>
          <Button onClick={handleSubmit} color="primary" disabled={!reason}>
            Reporter
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Report;