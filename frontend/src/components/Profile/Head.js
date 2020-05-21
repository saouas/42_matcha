import React, { useState, useRef } from 'react';
import hotIcon from '../../img/hot.svg'
import maleIcon from '../../img/male.svg'
import femaleIcon from '../../img/female.svg'
import thumbUp from '../../img/up.svg';
import thumbDown from '../../img/down.svg';
import block from '../../img/block.svg';
import report from '../../img/report.svg'
import thumbUpFilled from '../../img/upFilled.svg';
import { Grid, Divider, makeStyles, Button } from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import { RequestManager } from '../../models/RequestManager';
import { setLiked, setProfilePic } from '../../actions/profile';
import editIcon from '../../img/edit.png';
import ContainerSettings from '../../containers/ContainerSettings';
import Report from './Report';
import Block from './Block';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import BrowserImageManipulation from 'browser-image-manipulation'

const capitalize = (params) => {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  iconSmall: {
    fontSize: 20,
  },
}));

const Head = ({ dispatch, profile, isMyPage }) => {
  const classes = useStyles();
  const { sexualOrientation, username, lastName, firstName, old,
    distance, lastSeen, popularityScore, biography, liked,
    likeMe, gender, isOnline, profilePic } = profile;
  const [openBlock, setOpenBlock] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const [openEditSettings, setOpenEditSettings] = useState(false);
  const [localisationUpdated, setLocalisationUpdated] = useState(false);

  const handleOpenEditSettings = () => setOpenEditSettings(true);
  const editSettingsBtn = isMyPage ? <img alt="" onClick={handleOpenEditSettings} className="interestIcon" src={editIcon} /> : null;

  const sex_icon = gender === '1' ? maleIcon : femaleIcon

  const showIsOnline = (isOnline && !isMyPage) ? <div className="online_mark" /> : null;
  const input = useRef(null)

  let sexuelOrientationWord = (() => {
    if (sexualOrientation === '1') return 'Hétérosexuel';
    if (sexualOrientation === '2') return 'Bisexuel';
    if (['3', '6'].includes(sexualOrientation)) return 'Gay'
    if (sexualOrientation === '4') return 'Hétérosexuelle';
    if (sexualOrientation === '5') return 'Bisexuelle';
  })();

  const isLikedMe = () => {
    if (isMyPage)
      return <div className="isUserLikeYou">C'est votre profil !</div>
    if (likeMe)
      return <div className="isUserLikeYou">{firstName} vous a liké <img alt="" src={thumbUp} /></div>
    else
      return <div className="isUserLikeYou">{firstName} ne vous like pas <img alt="" className="dislike" src={thumbDown} /></div>
  }

  const likeUser = () => {
    RequestManager.likeUser(username)
      .then(() => {
        NotificationManager.success('Utilisateur liké')
        dispatch(setLiked(true))
      })
      .catch(() => {
        NotificationManager.error("Impossible de liker l'utilisateur")
      })
  }

  const unlikeUser = () => {
    RequestManager.unlikeUser(username)
      .then(() => {
        NotificationManager.success('Utilisateur unliké')
        dispatch(setLiked(false))
      })
      .catch(() => {
        NotificationManager.error("Impossible de unliker l'utilisateur")
      })
  }

  const Actions = () => {
    const showLike = liked ? thumbUpFilled : thumbUp
    const actionLike = liked ? unlikeUser : likeUser;
    if (isMyPage)
      return;
    return (
      <div className="actions">
        <img alt="" src={showLike} onClick={actionLike} />
        <img alt="" src={report} onClick={() => setOpenReport(true)} />
        <img alt="" src={block} onClick={() => setOpenBlock(true)} />
      </div>
    )
  }

  const getLocalisation = () => {
    setLocalisationUpdated(true);
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((updateLocalisation));
    else
      NotificationManager.error('Impossible de récupérer votre localisation')
  }

  const updateLocalisation = (info) => {
    RequestManager.updateLocalisation(info.coords.latitude, info.coords.longitude)
      .then(() => {
        NotificationManager.success('Votre localisation a été mise à jour')
      })
      .catch(() => {
        NotificationManager.error('Impossible de mettre à jour votre localisation')
      })
  }

  const Localisation = () => {
    if (localisationUpdated) return (null);
    if (isMyPage)
      return (<div className="localisation update" onClick={getLocalisation}>Mettre à jour sa position</div>)
    else
      return (<div className="localisation">à {distance} km</div>)
  }

  const ShowLastSeen = () => {
    if (isOnline || isMyPage)
      return (null);
    const diff = Date.now() - lastSeen;
    let sc = (diff / 1000);
    let mn = (sc / 60);
    let h = (mn / 60);
    if (h >= 1)
      return (<>(vu il y a {Math.trunc(h)}h)</>)
    else if (mn >= 1)
      return (<>(vu il y a {Math.trunc(mn)}mn)</>)
    else
      return (<>(vu il y a {Math.trunc(sc)}s)</>)
  }

  const uploadImage = () => {
    new BrowserImageManipulation()
      .loadBlob(input.current.files[0])
      .toCircle(400)
      .saveAsBlob()
      .then(blob => {
        let data = new FormData();
        data.append('pic', blob)
        RequestManager.updatePic(0, data)
          .then((res) => {
            input.current.value = '';
            dispatch(setProfilePic(res.data.url))
            NotificationManager.success('Photo mise à jour')
            console.log('successfully updating profile pic')
          })
          .catch((err) => {
            NotificationManager.error('Impossible de mettre à jour la photo')
            console.log(err);
            console.log('err updating pic')
          })
      })
      .catch(e => alert(e.toString()))
  }

  const openFileInput = () => input.current.click();

  const showAddProfilePic = () => {
    if (!isMyPage)
      return (null);
    return (
      <Button variant="contained" color="default" onClick={openFileInput} className={classes.button}>
        Upload
        <CloudUploadIcon className={classes.rightIcon} />
      </Button>
    )
  }

  return (
    <div className="profile">
      <Grid container spacing={4}>
        <Grid item xs={12} md={3} className="avatar">
          <div className="pp">
            <img alt={`profile pic ${username}`} src={profilePic} />
            {showIsOnline}
          </div>
          <div className="upload">{showAddProfilePic()}</div>
        </Grid>
        <Grid item xs={12} md={5}>
          <div className="basic_info_container">
            <div className="fullname">{lastName.toUpperCase()}<img alt="" src={sex_icon} /></div>
            <div className="fullname">{capitalize(firstName)} ({old})</div>
            {editSettingsBtn}
            <div className="last_seen">{capitalize(username)} {ShowLastSeen()}</div>
            <div className="popularity_score"><img alt="" src={hotIcon} />{popularityScore}</div>
            <div className="sexual_orientation">{sexuelOrientationWord}</div>
            {Localisation()}
          </div>
        </Grid>
        <Grid item xs={12} md={4} className="right">
          {isLikedMe()}
          {Actions()}
        </Grid>
      </Grid>
      <Divider />
      <div className="biography">{biography}</div>
      <ContainerSettings openEditSettings={openEditSettings} setOpenEditSettings={setOpenEditSettings} />
      <Report username={username} openReport={openReport} setOpenReport={setOpenReport} />
      <Block username={username} openBlock={openBlock} setOpenBlock={setOpenBlock} />
      <input type="file" accept=".jpg" onChange={uploadImage} ref={input} style={{ display: 'none' }} />
    </div>
  )
}

export default Head;