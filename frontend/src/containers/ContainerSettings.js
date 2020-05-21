import { connect } from 'react-redux'
import Settings from '../components/Settings/Settings'

const mapStateToProps = (state) => ({
  profile: state.profile
})

export default connect(
  mapStateToProps
)(Settings)
