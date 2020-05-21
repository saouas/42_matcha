export const clearNotifications = () => ({
  type: 'SET_NOTIFICATIONS',
  notifications: []
})

export const addNotification = data => ({
  type: 'ADD_NOTIFICATION',
  notification: data
})

export const setNotifications = data => ({
  type: 'SET_NOTIFICATIONS',
  notifications: data
})

export const setNotificationsCount = count => ({
  type: 'SET_NOTIFICATIONS_COUNT',
  count: count
})