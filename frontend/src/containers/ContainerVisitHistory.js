import { connect } from 'react-redux'
import VisitHistory from '../components/Profile/VisitHistory'

const mapStateToProps = (state) => ({
  username: state.profile.username
})

export default connect(
  mapStateToProps
)(VisitHistory)
