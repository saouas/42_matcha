import { connect } from 'react-redux'
import Header from '../components/Header/Header';
import { AuthManager } from '../models/AuthManager';

const mapStateToProps = (state) => ({
  logged: state.user.logged,
  notifications: state.notifications,
  username: AuthManager.getUsername(),
  count: state.notifications.count
})

export default connect(
  mapStateToProps
)(Header)
