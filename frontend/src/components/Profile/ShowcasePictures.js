import React, { useRef, useState } from 'react';
import { Grid, makeStyles, Button } from '@material-ui/core';
import { RequestManager } from '../../models/RequestManager';
import { setShowcasePic } from '../../actions/profile';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { NotificationManager } from 'react-notifications';

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

const ShowcasePictures = ({ dispatch, profile, isMyPage }) => {
  const classes = useStyles();
  const { showcasePics } = profile;
  const input = useRef(null)
  const [selectedSlot, setSelectedSlot] = useState(null);
  let lastSlot = (profile.showcasePics.length) + 1;
  console.log('lastSlot is', lastSlot);
  const uploadImage = () => {
    const slot = selectedSlot || lastSlot;
    let data = new FormData();
    data.append('pic', input.current.files[0])
    RequestManager.updatePic(slot, data)
      .then((res) => {
        setSelectedSlot(null);
        input.current.value = '';
        dispatch(setShowcasePic(slot, res.data.url))
        NotificationManager.success('Photo mise à jour')
        console.log('successfully updating pic')
      })
      .catch((err) => {
        NotificationManager.error('Impossible de mettre à jour la photo')
        console.log(err);
        console.log('err updating pic')
      })
  }

  const handlePicClick = (slot) => {
    if (!isMyPage)
      return ;
    console.log('set selected slot to', slot);
    setSelectedSlot(slot);
    input.current.click();
  }

  const showAddImage = () => {
    if (lastSlot >= 5 || !isMyPage)
      return (null);
    return (
      <Grid item xs={3}>
        <Button variant="contained" color="default" onClick={() => handlePicClick(lastSlot)} className={classes.button}>
          Upload
        <CloudUploadIcon className={classes.rightIcon} />
        </Button>
      </Grid>
    )
  }

  return (
    <div>
      <h2>Galerie de photos</h2>
      <Grid container spacing={1} className="showcase">
        {showcasePics.map((pic) => <Grid key={pic.slot} onClick={() => handlePicClick(pic.slot)} item xs={3}><img src={pic.url} alt="" /></Grid>)}
        {showAddImage()}
      </Grid>
      <input type="file" accept=".jpg" onChange={uploadImage} ref={input} style={{ display: 'none' }} />
    </div>
  )
}

export default ShowcasePictures;