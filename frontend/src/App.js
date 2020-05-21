import React from 'react';
import { Router, Route } from "react-router-dom";
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import history from './models/history';
import ContainerProfile from './containers/ContainerProfile';
import Match from './components/Match';
import Search from './components/Search';
import ContainerChat from './containers/ContainerChat';
import ResetPassword from './components/Auth/ResetPassword';
import ContainerNotifications from './containers/ContainerNotifications';
import AskNewPassword from './components/Auth/AskNewPassword';
import ContainerHeader from './containers/ContainerHeader';
import Home from './components/Home';

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <ContainerHeader />
          <NotificationContainer/>
          <Router history={history}>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/profile/:username" component={ContainerProfile} />
            <Route exact path="/match" component={Match} />
            <Route exact path="/search" component={Search} />
            <Route exact path="/chat/:username" component={ContainerChat} />
            <Route exact path="/reset_password/:token" component={ResetPassword} />
            <Route exact path="/notifications" component={ContainerNotifications}/>
            <Route exact path="/ask_reset_password" component={AskNewPassword} />
          </Router>
      </div>
    );
  }
}

export default App;
