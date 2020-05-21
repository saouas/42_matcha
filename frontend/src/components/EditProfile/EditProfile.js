import React, { useState, useEffect } from 'react';
import {
  TextField, FormControl, FormControlLabel, Radio, RadioGroup, Button, Dialog,
  DialogActions, DialogContent, DialogTitle, Select, MenuItem, FormLabel
} from '@material-ui/core';
import { Validator } from '../../models/Validator';
import '../../css/alert.css';
import { RequestManager } from '../../models/RequestManager';
import { NotificationManager } from 'react-notifications';
import { setEditProfile } from '../../actions/profile';
import ContainerAddTagInput from '../../containers/ContainerAddTagInput';

const styles = {
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'black',
    padding: '120px 30px',
  },
  orientationsexuelle: {
    margin: '0px 20px',
  },
  age: {
    marginBottom: '20px'
  },
  biography: {
    marginBottom: '-20px'
  }
}

const convert_sexual_orientation_tab = {
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '1',
  '5': '2',
  '6': '3'
}

const age_range = (() => {
  let tab = [];
  for (let i = 18; i < 100; i++)
    tab.push(i);
  return (tab);
})();

const EditProfile = ({ dispatch, profile, openEditProfile, setOpenEditProfile }) => {
  console.log('render edit profil');
  const { gender, sexualOrientation, biography, old } = profile;
  const [fgender, setFGender] = useState(gender);
  const [fbiography, setFBiography] = useState(biography);
  const [fsexualOrientation, setFSexualOrientation] = useState(convert_sexual_orientation_tab[sexualOrientation]);
  const [fage, setFAge] = useState(old);
  const showEditButton = Validator.biography(fbiography);
  useEffect(() => {
    setFGender(gender);
    setFBiography(biography);
    setFSexualOrientation(convert_sexual_orientation_tab[sexualOrientation]);
    setFAge(old);
  }, [gender, sexualOrientation, biography, old])


  function handleValidate() {
    RequestManager.updateProfile(fgender, fsexualOrientation, fbiography, fage)
      .then(() => {
        NotificationManager.success('Le profil a été enregistré')
        setOpenEditProfile(false);
        dispatch(setEditProfile({
          gender: fgender,
          biography: fbiography,
          sexualOrientation: fsexualOrientation,
          old: fage
        }))
      })
      .catch(() => {
        NotificationManager.error('Impossible de sauvegarder le profil')
      })
  }

  function handleClose() {
    setOpenEditProfile(false)
  }

  const handleBiography = (e) => {
    setFBiography(e.target.value);
  }

  const handleGender = (e) => {
    setFGender(e.target.value);
  }

  const handleSexualorientation = (e) => {
    setFSexualOrientation(e.target.value);
  }

  const handleAge = (e) => {
    setFAge(e.target.value);
  }

  const showBiographyForm = () => {
    return (
      <>
        <FormLabel component="legend" style={styles.biography}>Biographie</FormLabel>
        <TextField
          margin="normal"
          fullWidth
          value={fbiography}
          onChange={handleBiography}
        />
      </>
    )
  }

  const showAgeForm = () => {
    return (
      <>
        <FormLabel component="legend">Age</FormLabel>
        <FormControl variant="outlined" style={styles.age}>
          <Select
            value={fage}
            onChange={handleAge}
          >
            <MenuItem value="">
              <em>Age</em>
            </MenuItem>
            {age_range.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
          </Select>
        </FormControl>
      </>
    )
  }

  const showSexualOrientationForm = () => {
    return (
      <>
        <FormLabel component="legend">Orientation sexuelle</FormLabel>
        <RadioGroup row
          aria-label="gender"
          name="gender1"
          value={fsexualOrientation}
          onChange={handleSexualorientation}
        >
          <FormControlLabel style={styles.orientationsexuelle} value="1" control={<Radio />} label="Hétérosexuel" />
          <FormControlLabel style={styles.orientationsexuelle} value="2" control={<Radio />} label="Bisexuel" />
          <FormControlLabel style={styles.orientationsexuelle} value="3" control={<Radio />} label="Gay" />
        </RadioGroup>
      </>
    )
  }

  const showGenderForm = () => {
    return (
      <>
        <FormControl component="fieldset" >
          <FormLabel component="legend">Genre</FormLabel>
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={fgender}
            onChange={handleGender}
          >
            <FormControlLabel value="2" control={<Radio />} label="Femme" />
            <FormControlLabel value="1" control={<Radio />} label="Homme" />
          </RadioGroup>
        </FormControl>
      </>
    )
  }

  return (
    <Dialog
      open={openEditProfile}
      onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">Edition de profil</DialogTitle>
      <DialogContent>
        {showGenderForm()}
        {showSexualOrientationForm()}
        {showAgeForm()}
        {showBiographyForm()}
        <ContainerAddTagInput />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleValidate} color="primary" autoFocus disabled={!showEditButton}>
          VALIDER
					</Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          QUITTER
					</Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProfile