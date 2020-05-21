
const defaultNotifications = {
  count: 0,
  content: []
}

const notifications = (state = defaultNotifications, action) => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      const newContent = [action.notification, ...state.content];
      return Object.assign({}, state, {
        content: newContent,
        count: newContent.length
      })
    case 'SET_NOTIFICATIONS':
      return Object.assign({}, state, {
        content: action.notifications,
        count: action.notifications.length
      })
    case 'SET_NOTIFICATIONS_COUNT':
      return Object.assign({}, state, {
        count: action.count
      })
    default:
      return state
  }
}

export default notifications
