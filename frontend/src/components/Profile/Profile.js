import React, { useState, useEffect, useCallback } from 'react';
import { Container, Fab } from '@material-ui/core';
import '../../css/profile.css'
import { RequestManager } from '../../models/RequestManager';
import { profile_pictures_url } from '../../config/config';
import { e_error } from '../../models/e_error';
import { NotificationManager } from 'react-notifications';
import { AuthManager } from '../../models/AuthManager';
import defaultPic from '../../img/egg.jpg';
import history from '../../models/history';
import { setProfile } from '../../actions/profile';
import editIcon from '../../img/edit.png';
import ContainerEditProfile from '../../containers/ContainerEditProfile';
import ContainerShowcasePictures from '../../containers/ContainerShowcasePictures';
import ContainerVisitHistory from '../../containers/ContainerVisitHistory';
import ContainerHead from '../../containers/ContainerHead';
import ContainerLikeHistory from '../../containers/ContainerLikeHistory';
import MessageIcon from '@material-ui/icons/Message'

const styles = {
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
    marginTop: 34
  },
  chat: {
    position: 'fixed',
    right: '5%',
    bottom: '5%',
    width: 80,
    height: 80
  }
}


const Profile_design = ({ match, dispatch, profile }) => {
  console.log('render');
  const { username, tags, likeMe, liked } = profile;
  const [loadingState, setLoadingState] = useState(0);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const isMyProfile = AuthManager.getUsername() === username;

  const loadUserProfile = useCallback(() => {
    RequestManager.getUserProfile(match.params.username)
      .then((res) => {
        const user = res.data.user;
        let pp = defaultPic;
        if (user.profile_pic_0)
          pp = (`${profile_pictures_url}/${user.profile_pic_0}`)
        let pics = [];
        for (let i = 1; i <= 4; i++)
          if (user[`profile_pic_${i}`]) pics.push({
            slot: i,
            url: `${profile_pictures_url}/${user[`profile_pic_${i}`]}`
          });
        setLoadingState(1);
        const toDispatch = {
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          gender: user.gender,
          sexualOrientation: user.sexual_orientation,
          biography: user.biography || '',
          old: user.age || 0,
          tags: user.tags,
          mail: user.mail,
          showcasePics: pics,
          popularityScore: Number(user.popularity_score).toFixed(2),
          lastSeen: user.last_seen,
          profilePic: pp,
          isOnline: user.online,
          distance: user.distance,
          likeMe: user.liked_you,
          liked: user.liked
        }
        dispatch(setProfile(toDispatch))
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          const code = err.response.data.code
          if (code === e_error.NOT_FOUND)
            NotificationManager.error("L'utilisateur n'existe pas")
          if (code === e_error.BLOCKED_BY_USER)
            NotificationManager.error("Vous avez bloqué l'utilisateur ou cet utilisateur vous a bloqué")
        }
        if (AuthManager.isLogged())
          history.push(`/profile/${AuthManager.getUsername()}`)
        console.log(err)
      })
    // eslint-disable-next-line
  }, [match.params.username])

  useEffect(() => {
    loadUserProfile();
  }, [match.params.username, loadUserProfile])

  if (loadingState === 0)
    return (null);

  const handleOpenEditProfile = () => setOpenEditProfile(true);
  const editProfileBtn = isMyProfile ? <img alt="" onClick={handleOpenEditProfile} className="interestIcon" src={editIcon} /> : null;

  const Interests = () => {
    return (
      <div>
        <h2>Centres d'intérêts {editProfileBtn}</h2>
        <div className="interests">
          {tags.map((el) => <span key={el}>{el}</span>)}
        </div>
      </div>
    )
  }

  const renderChatIcon = () => {
    if (!likeMe || !liked)
      return (null);
    return (
      <Fab color="primary"
        aria-label="chat"
        style={styles.chat}
        onClick={() => history.push(`/chat/${username}`)}
        >
        <MessageIcon />
      </Fab>
    )
  }

  return (
    <Container style={styles.container} fixed>
      <div>
        <ContainerHead />
        {Interests()}
        <ContainerLikeHistory />
        <ContainerVisitHistory />
        <ContainerShowcasePictures />
      </div>
      <ContainerEditProfile openEditProfile={openEditProfile} setOpenEditProfile={setOpenEditProfile} />
      {renderChatIcon()}
    </Container >
  )
}

export default Profile_design