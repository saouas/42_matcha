
const initial = {
  logged: false
}

const user = (state = initial, action) => {
  switch (action.type) {
    case 'SET_LOGGED':
      return Object.assign({}, state, {
        logged: action.logged
      });
    default:
      return state
  }
}

export default user
