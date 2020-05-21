import React, { useState, useEffect } from 'react';
import { Container, Grid, Slider, Typography, Paper, Select, MenuItem } from '@material-ui/core';
import ChipInput from 'material-ui-chip-input'
import { Validator } from '../models/Validator';
import { RequestManager } from '../models/RequestManager';
import '../css/search.css'
import defaultPic from '../img/egg.jpg';
import { profile_pictures_url } from '../config/config';
import hotIcon from '../img/hot.svg'
import history from '../models/history';

const styles = {
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    padding: '0 30px',
    marginTop: 34,
    color: '#707070'
  }
}

const getURLPic = (name) => {
  if (name)
    return `${profile_pictures_url}/${name}`
  return (null);
}

const capitalize = (params) => {
  if (typeof params === 'string') {
    return params.charAt(0).toUpperCase() + params.slice(1);
  }
  return null;
}

const sortResults = (tab, sortBy) => {
  tab.sort((a, b) => {
    if (sortBy === 'popularity_score')
      return (b[sortBy] - a[sortBy]);
    if (sortBy === 'tags' && Array.isArray(b.tags))
      return (b[sortBy].length - a[sortBy].length)
    return (a[sortBy] - b[sortBy]);
  })
}

const Search = () => {
  const [distance, setDistance] = useState(50000)
  const [ageInterval, setAgeInterval] = useState([18, 99])
  const [popularityScore, setPopularityScore] = useState([0, 10]);
  const [tags, setTags] = useState([]);

  const [results, setResults] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  let sortedTab = [...results];
  sortResults(sortedTab, sortBy);

  // Fetch search
  useEffect(() => {
    const search_query = () => {
      const range_age = ageInterval.join('+');
      const range_popularity_score = popularityScore.join('+');
      RequestManager.search(range_age, range_popularity_score, distance.toString(), tags)
        .then((res) => {
          console.log(res.data);
          setResults(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
    }
  
    const timer = setTimeout(() => search_query(), 500);
    return () => clearInterval(timer);
  }, [distance, ageInterval, popularityScore, tags])

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
          <Typography>Trier par</Typography>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">Défaut</MenuItem>
            <MenuItem value="age">Age</MenuItem>
            <MenuItem value="distance">Distance</MenuItem>
            <MenuItem value="popularity_score">Popularité</MenuItem>
            <MenuItem value="tags">Tags</MenuItem>
          </Select>
        </Grid>
      </Grid>
    )
  }

  const showTagsResult = (tags) => {
    if (!tags)
      return (null);
    return (
      tags.map((e) => <span className="tag" key={e}>{e}</span>)
    )
  }

  const showResults = () => {
    return (
      <div className="search_results">
        {sortedTab.map((el) =>
          <div key={el.username}>
            <Paper className="result" onClick={() => history.push(`/profile/${el.username}`)}>
              <Typography variant="h5" component="h3">
                {capitalize(el.first_name)} {el.last_name.toUpperCase()} ({el.age}) <span className="distance">{el.distance}km de chez toi</span>
              </Typography>
              <Grid container spacing={3} className="bottom">
                <Grid item xs={3} sm={1}>
                  <img alt={`profile pic ${el.username}`} className="profile_pic" src={getURLPic(el.profile_pic) || defaultPic}/>
                </Grid>
                <Grid item xs={9} sm={3}>
                  <img alt="score icon" className="score_icon" src={hotIcon}/>
                  <span className="popularity_score">{Number(el.popularity_score).toFixed(2)}</span>
                </Grid>
                <Grid item xs={12} sm={8}>
                  {showTagsResult(el.tags)}
                </Grid>
              </Grid>
            </Paper>
          </div>)}
      </div>
    )
  }

  return (
    <Container style={styles.container} maxWidth="md">
      {showSearchBar()}
      {showResults()}
    </Container>
  )
}

export default Search;