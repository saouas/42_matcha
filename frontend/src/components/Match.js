import React, { useState, useEffect } from 'react'
import { Container, makeStyles, Button, Grid, Slider, Select, MenuItem, Paper } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ChipInput from 'material-ui-chip-input'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import hotIcon from '../img/hot.svg'
import Avatar from '@material-ui/core/Avatar';
import defaultAvatar from '../img/egg.jpg'
import distanceIcon from '../img/road.svg';
import { RequestManager } from '../models/RequestManager';
import { Validator } from '../models/Validator'
import history from '../models/history';
import { profile_pictures_url } from '../config/config';

const useStyles = makeStyles({
  card: {
    minWidth: 250,
    maxWidth: 300,
    minHeight: 350,
    margin: 'auto',
    marginTop: 25
  },
  bullet: {
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 12,
  },
  pos: {
    marginBottom: 12,
  },
  popularity_score: {
    fontSize: 12,
    float: "right",
    marginTop: "-30px",
    color: "#FD9243"
  },
  hoticon: {
    marginTop: '10px'
  },
  bigAvatar: {
    margin: 'auto',
    marginBottom: 20,
    width: 210,
    height: 210
  },
  button: {
    "&:hover": {
      backgroundColor: "#FD9243"
    },
    backgroundColor: "#565254",
    color: "#E2E2E2"
  },
  distanceIcon: {
    height: '20px',
    width: '20px'
  }
});

const styles = {
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    padding: '0 30px',
    marginTop: 34,
    color: '#707070'
  },
  tag: {
    fontSize: '12px'
  },
  no_match: {
    textAlign: "center",
    margin: 'auto',
    marginTop: '40px',
    marginBottom: '40px'
  }
}

const sortResults = (tab, sortBy) => {
  tab.sort((a, b) => {
    if (sortBy === 'popularity_score')
      return (b[sortBy] - a[sortBy]);
    if (sortBy === 'tag' && Array.isArray(b.tag))
      return (b[sortBy].length - a[sortBy].length)
    return (a[sortBy] - b[sortBy]);
  })
}

const filter_search = (array, property, range) => {
  //console.log(`compare with ${property}.`, array, range);
  return array.filter((user) => {
    if (user[property] >= range[0] && user[property] <= range[1])
      return true;
    return false;
  })
}

const filter_tags = (userArray, tags) => {
  if (tags.length === 0)
    return userArray;
  return userArray.filter((user) =>
    !tags.some((tag) => {
      return user.tag.indexOf(tag) === -1;
    })
  )
}

const getURLPic = (name) => {
  if (name)
    return `${profile_pictures_url}/${name}`
  return (null);
}

const Match = () => {
  const [users, setUsers] = useState([]);
  const [distance, setDistance] = useState(50000)
  const [ageInterval, setAgeInterval] = useState([18, 99])
  const [popularityScore, setPopularityScore] = useState([0, 10]);
  const [tags, setTags] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const classes = useStyles();

  let sortedUsers = [...users];
  sortResults(sortedUsers, sortBy)

  const handleAddTag = (val) => {
    if (!Validator.tag(val))
      return;
    setTags([
      ...tags,
      val
    ])
  }

  const handleRemoveTag = (val, i) => {
    var arr = [...tags];
    arr.splice(i, 1)
    setTags(arr);
  }

  const loadMatch = () => {
    RequestManager.match()
      .then((result) => {
        setUsers(result.data);
      });
  }
  useEffect(() => {
    loadMatch();
  }, [])

  const bull = <span className={classes.bullet}>•</span>;

  const handleSort = (e) => {
    setSortBy(e.target.value)
  }

  const showSearchBar = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} sm={5}>
          <Typography gutterBottom>
            Distance
          </Typography>
          <Slider
            value={distance}
            onChange={(e, val) => setDistance(val)}
            step={5}
            min={0}
            max={50000}
            valueLabelDisplay="on"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography gutterBottom>
            Interval d'âge
          </Typography>
          <Slider
            value={ageInterval}
            onChange={(e, val) => setAgeInterval(val)}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={18}
            max={99}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Typography gutterBottom>
            Interval de popularité
          </Typography>
          <Slider
            value={popularityScore}
            onChange={(e, val) => setPopularityScore(val)}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            step={1}
            max={10}
          />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Typography gutterBottom>
            Tags
          </Typography>
          <ChipInput
            value={tags}
            onAdd={(tag) => handleAddTag(tag)}
            onDelete={(tag, index) => handleRemoveTag(tag, index)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Typography gutterBottom>
            Trier par
          </Typography>
          <Select
            value={sortBy}
            onChange={(e) => handleSort(e)}
          >
            <MenuItem value='default'>Défaut</MenuItem>
            <MenuItem value='age'>Age</MenuItem>
            <MenuItem value='distance'>Localisation</MenuItem>
            <MenuItem value='popularity_score'>Popularité</MenuItem>
            <MenuItem value='tag'>Tags</MenuItem>
          </Select>
        </Grid>
      </Grid>
    )
  }

  const showNoUsersFound = () => (
    <Paper style={styles.no_match}>
      <h2>Ouuups..</h2>
      <p>Aucun utilisateur ne vous correspond ! Remplissez votre profil !</p>
    </Paper>
  )

  const generate_card = () => {
    sortedUsers = filter_search(sortedUsers, 'distance', [0, distance]);
    sortedUsers = filter_search(sortedUsers, 'age', ageInterval)
    sortedUsers = filter_search(sortedUsers, 'popularity_score', popularityScore)
    sortedUsers = filter_tags(sortedUsers, tags)

    if (sortedUsers.length === 0)
      return showNoUsersFound();

    return (
      sortedUsers.map((el) =>
      <Grid item xs={12} sm={6} md={6} lg={4} key={el.username}>
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {el.first_name} {bull} {el.last_name}
            </Typography>
            <Typography className={classes.popularity_score} >
              <img alt="" className={classes.hoticon} src={hotIcon} /> {el.popularity_score.toFixed(2)}
            </Typography>
            <Typography variant="h5" component="h1">
              {el.username}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {el.age} ans
            </Typography>
            <Typography className={classes.popularity_score} >
              <img alt="" className={classes.distanceIcon} src={distanceIcon} /> {el.distance} km
            </Typography>
            <Typography variant="body2" component="p">
              {el.bio}
              <br />
            </Typography>
            <Avatar alt="" src={getURLPic(el.profile_pic) || defaultAvatar} className={classes.bigAvatar} />
            <div className="interests">
              {el.tag.map((el) =>
                <span style={styles.tag} key={el}>{el}</span>
              )}
            </div>
          </CardContent>
          <CardActions>
            <Button onClick={() => history.push(`/profile/${el.username}`)} className={classes.button}>Visitez le profil</Button>
          </CardActions>
        </Card>
      </Grid>
    ))
  }

  return (
      <Container maxWidth="md" style={styles.container}>
        {showSearchBar()}
        <Grid container spacing={3}>
          {generate_card()}
        </Grid>
      </Container>
  );

}

export default Match;