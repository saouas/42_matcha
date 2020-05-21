import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, TextField, Button, Grid, ButtonGroup } from '@material-ui/core';
import { Validator } from '../../models/Validator';
import axios from 'axios';
import config from '../../config/config';
import '../../css/alert.css';
import { e_error } from '../../models/e_error';
import history from '../../models/history';

const styles = {
  container: {
    textAlign: 'center',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
    marginTop: 34
  },
  button: {
    margin: 10
  },
  group: {
    marginTop: '7px',
    marginBottom: '15px'
  }
}

class Register extends React.Component {
  state = {
    firstName: null,
    lastName: null,
    username: null,
    password: null,
    mail: null,
    success: 0,
    errorMessage: null
  }

  validateForm = () => {
    if (!Validator.first_name(this.state.firstName))
      return (1);
    if (!Validator.last_name(this.state.lastName))
      return (2)
    if (!Validator.password(this.state.password))
      return (3);
    if (!Validator.username(this.state.username))
      return (4);
    if (!Validator.mail(this.state.mail))
      return (5);
    return (0);
  }

  showLogin = () => history.push('/login')

  register = () => {
    console.log('trying to register..');
    axios.post(config.register, {
      username: this.state.username,
      password: this.state.password,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      mail: this.state.mail
    })
      .then((res) => {
        console.log(res)
        this.setState({
          success: 1
        })
      })
      .catch((err) => {
        const err_code = err.response.data.code;
        if (err_code === e_error.USERNAME_EXIST)
          this.setState({
            errorMessage: "Nom d'utilisateur existant."
          })
        if (err_code === e_error.MAIL_EXIST)
          this.setState({
            errorMessage: "Un compte avec cette adresse-mail existe déjà."
          })
      })
  }

  renderSuccess() {
    if (!this.state.success)
      return (null);

    return (
      <div className="alert success register">
        Votre compte a été crée avec succès.
        <br />
        Vous pouvez désormais vous connecter.
      </div>
    )
  }

  renderError() {
    if (this.state.errorMessage == null)
      return (null);
    return (
      <Grid item xs={12}>
        <div className="alert error profil">{this.state.errorMessage}</div>
      </Grid>
    )
  }

  renderForm() {
    if (this.state.success)
      return (null);
    const showBtn = this.validateForm() ? false : true;
    return (
      <div>
        <Grid container spacing={3}>
          {this.renderError()}
          <Grid item xs={12} sm={6}>
            <TextField onChange={(e) => this.setState({ lastName: e.target.value.toLowerCase() })}
              label="Nom"
              fullWidth
              autoComplete="family-name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField onChange={(e) => this.setState({ firstName: e.target.value.toLowerCase() })}
              label="Prénom"
              fullWidth
              autoComplete="given-name"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField onChange={(e) => this.setState({ username: e.target.value.toLowerCase() })}
              label="Nom d'utilisateur"
              fullWidth
              autoComplete="username"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField onChange={(e) => this.setState({ mail: e.target.value.toLowerCase() })}
              label="Mail"
              fullWidth
              autoComplete="email"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField onChange={(e) => this.setState({ password: e.target.value })}
              label="Mot de passe"
              fullWidth
              type='password'
              autoComplete="current-password"
            />
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" style={styles.button} disabled={!showBtn} onClick={this.register}>
          Créer mon compte
        </Button>
      </div>
    )
  }

  renderNavigation = () => (
    <ButtonGroup
      size="small"
      aria-label="large outlined secondary button group"
      style={styles.group}
    >
      <Button onClick={this.showLogin}>Se connecter</Button>
    </ButtonGroup>
  )

  render() {
    console.log(this.validateForm());
    return (
      <Container maxWidth="sm">
        <h1>S'enregistrer</h1>
        <form style={styles.container} noValidate autoComplete="off">
          {this.renderSuccess()}
          {this.renderForm()}
          {this.renderNavigation()}
        </form>
      </Container>
    );
  }
}

export default withRouter(Register);
