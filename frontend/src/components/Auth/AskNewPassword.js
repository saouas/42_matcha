import React, { useState } from 'react';
import { Container, TextField, Button, ButtonGroup, Typography } from '@material-ui/core';
import { Validator } from '../../models/Validator';
import axios from 'axios';
import config from '../../config/config'
import '../../css/alert.css';
import history from '../../models/history';
import { NotificationManager } from 'react-notifications';

const styles = {
  container: {
    textAlign: 'center',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
  },
  button: {
    marginTop: '10px',
    marginBottom: 15
  },
  msg: {
    color: "grey",
    fontSize: '12px',
    margin: 'auto auto'
  },
  group: {
    marginBottom: '15px'
  },
  description: {
    textAlign: 'center',
    color: 'black',
    maxWidth: '100%',
    paddingTop: '15px'
  }
}

const AskNewPassword = () => {
  const [username, setUsername] = useState(0);

  const validate = () => {
    if (!Validator.username(username))
      return (false)
    return true;
  }

  const handleButton = validate();

  const handleValidation = () => {
    axios.post(config.ask_reset_password, {
      username: username,
    })
      .then((res) => {
        NotificationManager.success("Votre demande a été prise en compte. Rendez-vous sur votre mail.");
        history.push('/login');
      })
      .catch((err) => {
        NotificationManager.error("Impossible de demander un lien de reset mot de passe");
      });
  }
  return (
    <Container maxWidth="sm">
      <h1>Réinitialisation mot de passe</h1>
      <form style={styles.container} noValidate autoComplete="off">
        <Typography style={styles.description} gutterBottom>
            Un mail contenant le lien de réinitialisation de votre mot de passe vous sera envoyé
        </Typography>
        <TextField
          id="pseudo"
          label="Nom d'utilisateur"
          margin="normal"
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button variant="contained" color="primary" style={styles.button} disabled={!handleButton} onClick={handleValidation}>
          Valider
          </Button>
        <br />
        <ButtonGroup
          size="small"
          aria-label="large outlined secondary button group"
          style={styles.group}
        >
          <Button onClick={() => history.push('/login')}>retour</Button>
        </ButtonGroup>
      </form>
    </Container>
  );
}

export default AskNewPassword;