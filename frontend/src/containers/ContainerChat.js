import { connect } from 'react-redux'
import Chat from '../components/Chat/Chat'

const mapStateToProps = (state) => ({
  chat: state.chat
})

export default connect(
  mapStateToProps
)(Chat)
