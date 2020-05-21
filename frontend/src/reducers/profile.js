const defaultProfile = {
  username: '42',
  firstName: 'first_name',
  lastName: 'last_name',
  gender: '1',
  sexualOrientation: '2',
  biography: 'this is my biography',
  old: 18,
  mail: 'nomail@no.fr',
  tags: ['test', 'tags'],
  showcasePics: [],
  popularityScore: 1.0,
  lastSeen: null,
  profilePic: '',
  isOnline: false,
  distance: 10,
  likeMe: false,
  liked: false
}

const profile = (state = defaultProfile, action) => {
  switch (action.type) {
    case 'SET_PROFILE':
      return Object.assign({}, state, action.profile)
    case 'ADD_TAG':
        return Object.assign({}, state, {
          tags: [
          ...state.tags,
          action.name
        ]})
    case 'REMOVE_TAG':
        return Object.assign({}, state, {
          tags: state.tags.filter(name => name !== action.name)
        })
    case 'SET_TAGS':
        return Object.assign({}, state, {
          tags: action.tags
        })
    case 'SET_SHOWCASE': {
        let arr = [...state.showcasePics];
        const slot = action.pic.slot;
        arr.some((el) => el.slot === slot) ? arr[slot - 1].url = action.pic.url : arr.push(action.pic);
        return Object.assign({}, state, {
          showcasePics: arr
        })
    }
    default:
      return state
  }
}

export default profile
