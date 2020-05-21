import { connect } from 'react-redux'
import LikeHistory from '../components/Profile/LikeHistory';

const mapStateToProps = (state) => ({
  username: state.profile.username
})

export default connect(
  mapStateToProps
)(LikeHistory)
