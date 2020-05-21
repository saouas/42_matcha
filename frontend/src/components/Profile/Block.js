import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RequestManager } from '../../models/RequestManager';
import { NotificationManager } from 'react-notifications';
import history from '../../models/history';
import { AuthManager } from '../../models/AuthManager';

const Block = ({ username, openBlock, setOpenBlock }) => {
  const handleClose = () => {
    setOpenBlock(false);
  }

  const handleSubmit = () => {
    handleClose();
    RequestManager.blockUser(username)
      .then(() => {
        NotificationManager.success("L'utilisateur a été bloqué")
        history.push(`/profile/${AuthManager.getUsername()}`)
      })
      .catch(() => {
        NotificationManager.error("Impossible de bloquer l'utilisateur")
      })
  }

  return (
    <div>
      <Dialog open={openBlock} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Bloquer {username}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez vous vraiment bloquer {username} ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Annuler
            </Button>
          <Button onClick={handleSubmit} color="primary">
            Bloquer
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Block;