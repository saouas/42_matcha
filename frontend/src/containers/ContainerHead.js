import { connect } from 'react-redux'
import Head from '../components/Profile/Head'
import { AuthManager } from '../models/AuthManager';

const mapStateToProps = (state) => ({
  profile: state.profile,
  isMyPage: AuthManager.getUsername() === state.profile.username
})

export default connect(
  mapStateToProps
)(Head)
