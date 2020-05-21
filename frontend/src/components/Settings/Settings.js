import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Dialog, DialogTitle, DialogActions, DialogContent } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import { Validator } from '../../models/Validator';
import { RequestManager } from '../../models/RequestManager';
import { NotificationManager } from 'react-notifications';
import { e_error } from '../../models/e_error';
import { setFullName, setMail } from '../../actions/profile';

const styles = {
  button: {
    margin: 10,
    marginBottom: 15
  },
  buttonEdit: {
    margin: 10,
    marginBottom: 15,
  },
  buttonEditPassword: {
    marginTop: 20,
    marginBottom: 15
  },
  title: {
    color: '#707070'
  },
  divider: {
    marginTop: '20px',
    marginBottom: '5px'
  }
}

const Settings = ({ dispatch, profile, openEditSettings, setOpenEditSettings }) => {
  const [firstName, setFirstName] = useState('Marcita');
  const [lastName, setLastName] = useState('GENOVESE')
  const [inputMail, setInputMail] = useState('arkansia@arkanida.fr')
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [modifiedFullName, setModifiedFullName] = useState(false);
  const [modifiedMail, setModifiedMail] = useState(false);
  // End state
  const {
    firstName: r_firstName,
    lastName: r_lastName,
    mail: r_mail
  } = profile;

  useEffect(() => {
    setFirstName(r_firstName);
    setLastName(r_lastName)
  }, [r_firstName, r_lastName])

  useEffect(() => setInputMail(r_mail), [r_mail]);

  const handleChangeFirstName = (e) => {
    setFirstName(e.target.value);
    setModifiedFullName(true);
  }

  const handleChangeLastName = (e) => {
    setLastName(e.target.value);
    setModifiedFullName(true);
  }

  const handleChangeMail = (e) => {
    setInputMail(e.target.value);
    setModifiedMail(true);
  }

  const showEditFullName = () => {
    if (!Validator.first_name(firstName.toLowerCase()))
      return (1);
    if (!Validator.last_name(lastName.toLocaleLowerCase()))
      return (2);
  }

  const updateFullName = () => {
    setModifiedFullName(false);
    const fN = firstName.toLowerCase()
    const lN = lastName.toLowerCase()
    RequestManager.updateFullName(fN, lN)
      .then(() => {
        NotificationManager.success('Nom et prénom mis à jour', 'Succès', 3500)
        dispatch(setFullName(fN, lN))
      })
      .catch((err) => {
        NotificationManager.error('Impossible de mettre à jour', 'Erreur')
      })
  }

  const FullNameForm = () => {
    const show_edit_btn = modifiedFullName && !showEditFullName();
    return (
      <>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Nom"
            fullWidth
            value={lastName}
            onChange={(e) => handleChangeLastName(e)}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            label="Prénom"
            fullWidth
            value={firstName}
            onChange={(e) => handleChangeFirstName(e)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Button variant="contained" color="primary" style={styles.buttonEdit} disabled={!show_edit_btn} onClick={updateFullName}>
            EDITER
        </Button>
        </Grid>
      </>
    )
  }

  const updateMail = () => {
    setModifiedMail(false);
    const mail = inputMail.toLowerCase();
    RequestManager.updateMail(mail)
      .then((data) => {
        NotificationManager.success('Mail mis à jour', 'Succès', 3500)
        dispatch(setMail(mail))
      })
      .catch((err) => {
        if (err.response.data.code === e_error.MAIL_EXIST)
          NotificationManager.error('Cette adresse-mail est déjà associé à un compte')
        else
          NotificationManager.error('Impossible de mettre à jour', ' Erreur :(')
      })
  }

  const MailForm = () => {
    const show_edit_btn = modifiedMail && Validator.mail(inputMail.toLowerCase());
    return (
      <>
        <Grid item xs={12} sm={8}>
          <TextField
            label="Mail"
            fullWidth
            value={inputMail}
            onChange={(e) => handleChangeMail(e)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button variant="contained" color="primary" style={styles.button} disabled={!show_edit_btn} onClick={updateMail}>
            Editer mail
          </Button>
        </Grid>
      </>
    )
  }

  const updatePassword = () => {
    RequestManager.updatePassword(oldPassword, password)
      .then(() => {
        setPassword('');
        setOldPassword('');
        NotificationManager.success('Mot de passe mis à jour', 'Succès', 3500)
      })
      .catch((err) => {
        console.log(err);
        setPassword('');
        setOldPassword('');
        NotificationManager.error('Impossible de mettre à jour', ' Erreur :(')
      })
  }

  const PasswordForm = () => {
    const show_edit_btn = Validator.password(password) && Validator.password(oldPassword);
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Ancien mot de passe"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
            autoComplete="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Nouveau mot de passe"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="password"
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" style={styles.buttonEditPassword} disabled={!show_edit_btn} onClick={updatePassword}>
            Editer mot de passe
            </Button>
        </Grid>
      </Grid>
    )
  }

  const handleClose = () => setOpenEditSettings(false);

  return (
    <Dialog
      open={openEditSettings}
      onClose={handleClose}
    >
      <DialogTitle>Options</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          {FullNameForm()}
          {MailForm()}
        </Grid>
        <Divider variant='fullWidth' style={styles.divider} />
        <h2 style={styles.title}>Editer mot de passe</h2>
        <form style={{width: '100%'}}>
          {PasswordForm()}
        </form>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          OK
				</Button>
      </DialogActions>
    </Dialog>
  )
}
export default Settings;
