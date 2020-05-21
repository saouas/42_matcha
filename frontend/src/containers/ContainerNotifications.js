import { connect } from 'react-redux'
import Notifications from '../components/Notifications/Notifications'

const mapStateToProps = (state) => ({
  notifications: state.notifications.content
})

export default connect(
  mapStateToProps
)(Notifications)
