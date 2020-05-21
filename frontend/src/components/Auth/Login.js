import React from 'react';
import { withRouter } from 'react-router-dom';
import { Container, TextField, Button, ButtonGroup } from '@material-ui/core';
import { Validator } from '../../models/Validator';
import axios from 'axios';
import config from '../../config/config'
import '../../css/alert.css';
import history from '../../models/history';
import { AuthManager } from '../../models/AuthManager';

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
    margin: 10,
    marginBottom: 15
  },
  group: {
    marginBottom: '15px'
  }
}

class Login extends React.Component {
  timeout = null;

  state = {
    username: null,
    passwd: null,
    error: null,
    valid: null
  }

  showRegister = () => history.push('/register')

  showProfil = (username) => history.push(`/profile/${username}`)

  showResetPassword = () => history.push(`/ask_reset_password`)

  validateForm = () => {
    if (!Validator.username(this.state.username))
      return (1);
    if (!Validator.password(this.state.passwd))
      return (2);
    return (0);
  }

  refreshButtonState = () => {
    console.log('validate form');
    if (!this.validateForm())
      this.setState({ valid: 1 })
    else
      this.setState({ valid: 0 })
    this.timeout = null;
  }

  refreshButtonTimeout = () => {
    if (this.timeout !== null)
      clearTimeout(this.timeout);
    this.timeout = setTimeout(this.refreshButtonState, 300);
  }

  login = () => {
    console.log("trying to login..")
    const e = this.validateForm();
    if (e)
      return;

    axios.post(config.login, {
      username: this.state.username,
      password: this.state.passwd
    })
      .then((res) => {
        AuthManager.disconnect();
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('username', res.data.username);
        AuthManager.setAsLogged();
        this.showProfil(res.data.username);
      })
      .catch((err) => {
        this.setState({
          error: 1
        })
      })
  }

  handlePassword = (event) => {
    this.setState({
      passwd: event.target.value
    })
    this.refreshButtonTimeout();
  }

  handleUsername = (event) => {
    this.setState({
      username: event.target.value
    })
    this.refreshButtonTimeout();
  }

  renderError() {
    return (
      <div className="alert error profil">Nom d'utilisateur ou mot de passe incorrect.</div>
    )
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const renderError = this.state.error ? this.renderError() : null;

    return (
      <Container maxWidth="sm">
        <h1>Connexion</h1>
        <form style={styles.container} noValidate autoComplete="off">
          {renderError}
          <TextField
            id="standard-name"
            label="Nom d'utilisateur"
            margin="normal"
            fullWidth
            onChange={this.handleUsername}
            autoComplete="username"
          />
          <TextField
            id="standard-password"
            label="Mot de passe"
            margin="normal"
            fullWidth
            onChange={this.handlePassword}
            type='password'
            autoComplete="current-password"
          />
          <Button variant="contained" color="primary" style={styles.button} onClick={this.login} disabled={!this.state.valid}>
            Connexion
            </Button>
            <br/>
          <ButtonGroup
            size="small"
            aria-label="large outlined secondary button group"
            style={styles.group}
          >
            <Button onClick={this.showRegister}>Créer un compte</Button>
            <Button onClick={this.showResetPassword}>Mot de passe oublié</Button>
          </ButtonGroup>
        </form>
      </Container>
    );
  }
}

export default withRouter(Login);
