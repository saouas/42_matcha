import { combineReducers } from 'redux'
import profile from './profile'
import chat from './chat';
import notifications from './notifications';
import user from './user';

export default combineReducers({
  profile,
  chat,
  notifications,
  user
})
