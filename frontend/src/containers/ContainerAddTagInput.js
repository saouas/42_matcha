import { connect } from 'react-redux'
import AddTagIput from '../components/EditProfile/AddTagInput'

const mapStateToProps = (state) => ({
    tags: state.profile.tags
})

export default connect(
    mapStateToProps
)(AddTagIput)
