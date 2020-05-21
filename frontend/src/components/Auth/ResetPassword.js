import React, { useState } from 'react';
import { Container, Grid, TextField, Typography, Button } from '@material-ui/core';
import { Validator } from '../../models/Validator';
import { NotificationManager } from 'react-notifications';
import { RequestManager } from '../../models/RequestManager';
import history from '../../models/history';

const styles = {
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
    marginTop: 34
  },
  title: {
    color: 'black',
    textAlign: 'center',
    paddingTop: 15,
    marginBottom: 10
  },
  item: {
    marginBottom: '40px'
  },
  button: {
    margin: '20px auto'
  }
}


const ResetPassword = ({ match }) => {
  const token = match.params.token;
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const validate_data = () => {
    if (!Validator.jwt_token(token))
      return (false);
    if (!Validator.password(password1))
      return (false);
    if (!Validator.password(password2))
      return (false);
    if (password1 !== password2)
      return (false);
    return (true);
  }

  const sendRequest = () => {
    console.log(password1);
    console.log(token);
    RequestManager.resetPassword(token, password1)
      .then((res) => {
        NotificationManager.success("Votre mot de passe a été mis à jour");
        history.push('/login');
      })
      .catch((err) => {
        NotificationManager.error("Impossible de mettre à jour votre mot de passe");
      });
  }

  const showBtn = validate_data();

  return (
    <Container style={styles.container} maxWidth="sm">
      <Typography style={styles.title} variant="h5" gutterBottom>
        ∞ Réinitialiser mot de passe ∞
      </Typography>
      <Grid container>
        <Grid item xs={12} sm={12} style={styles.item}>
          <TextField onChange={(e) => setPassword1(e.target.value)}
            label="Nouveau mot de passe"
            fullWidth
            type="password"
            autoComplete="password"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField onChange={(e) => setPassword2(e.target.value)}
            label="Répétez votre mot de passe"
            fullWidth
            type="password"
            autoComplete="password"
          />
        </Grid>
        <Button variant="contained" color="primary" style={styles.button} disabled={!showBtn} onClick={sendRequest}>
          envoyer
        </Button>
      </Grid>
    </Container>
  )
}

export default ResetPassword;