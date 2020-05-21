import { connect } from 'react-redux'
import Settings from '../components/Profile/ShowcasePictures'
import { AuthManager } from '../models/AuthManager';

const mapStateToProps = (state) => ({
  profile: state.profile,
  isMyPage: AuthManager.getUsername() === state.profile.username
})

export default connect(
  mapStateToProps
)(Settings)
