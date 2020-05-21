import { connect } from 'react-redux'
import EditProfile from '../components/EditProfile/EditProfile'

const mapStateToProps = (state) => ({
  profile: state.profile
})

export default connect(
  mapStateToProps
)(EditProfile)
