export const setProfile = data => ({
  type: 'SET_PROFILE',
  profile: data
})

export const addTag = name => ({
  type: 'ADD_TAG',
  name: name
})

export const removeTag = name => ({
  type: 'REMOVE_TAG',
  name: name
})

export const setFullName = (firstName, lastName) => ({
  type: 'SET_PROFILE',
  profile: {
    firstName: firstName,
    lastName: lastName
  }
})

export const setProfilePic = (url) => ({
  type: 'SET_PROFILE',
  profile: {
    profilePic: url
  }
})

export const setLiked = (liked) => ({
  type: 'SET_PROFILE',
  profile: {
    liked: liked
  }
})

export const setMail = (mail) => ({
  type: 'SET_PROFILE',
  profile: {
    mail: mail
  }
})

export const setShowcasePic = (i, url) => ({
  type: 'SET_SHOWCASE',
  pic: {
    slot: i,
    url: url
  }
})

export const setEditProfile = data => ({
  type: 'SET_PROFILE',
  profile: {
    gender: data.gender,
    biography: data.biography,
    sexualOrientation: data.sexualOrientation,
    old: data.old
  }
})