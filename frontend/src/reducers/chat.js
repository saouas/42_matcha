
const defaultMessages = [
  {
    me: false,
    date: Date.now(),
    text: 'hey buddy !'
  },
  {
    me: true,
    date: 5,
    text: 'hello how are you!'
  },
]

const chat = (state = defaultMessages, action) => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return [...state, action.message];
    case 'SET_MESSAGES':
        return action.messages;
    default:
      return state
  }
}

export default chat
