import React, { useState, useEffect } from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { Validator } from '../../models/Validator';
import { RequestManager } from '../../models/RequestManager';
import { MenuItem, Paper, Button, TextField, makeStyles, Typography } from '@material-ui/core';
import { addTag, removeTag } from '../../actions/profile';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing(2),
  },
}));

const AddTagInput = ({ dispatch, tags }) => {
  const classes = useStyles();
  const [tagName, setTagName] = useState({
    single: ''
  });
  const [suggestions, setSuggestions] = useState([]);
  const [needFetch, setNeedFetch] = useState(true)
  const [popularTags, setPopularTags] = useState([]);
  const showAddTagButton = Validator.tag(tagName.single)

  useEffect(() => {
    if (!Validator.search_tag(tagName.single))
      return;
    if (!needFetch)
      return setNeedFetch(true);
    RequestManager.searchTags(tagName.single)
      .then((result) => {
        let tags = result.data.tags;
        console.log('fetched')
        setSuggestions(tags);
      })
      .catch((err) => {
        console.log(err.response.data)
      })
      // eslint-disable-next-line
  }, [tagName])

  useEffect(() => {
    console.log('get popular tags');
    RequestManager.getPopularTags()
    .then((res) => {
      setPopularTags(res.data.tags);
    })
    .catch(() => {
      console.log('impossible de récuperer les tags populaires')
    })
  }, [])


  function renderInputComponent(inputProps) {
    const { classes, inputRef = () => {}, ref, ...other } = inputProps;
  
    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => {
            ref(node);
            inputRef(node);
          },
          classes: {
            input: classes.input,
          },
        }}
        {...other}
      />
    );
  }

  function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion, query);
    const parts = parse(suggestion, matches);
    parts.forEach((e) => console.log(e))
    return (
      <MenuItem selected={isHighlighted} component="div">
        <div>
          {parts.map(part => (
            <span key={part.text + part.highlight} style={{ fontWeight: part.highlight ? 500 : 400 }}>
              {part.text}
            </span>
          ))}
        </div>
      </MenuItem>
    );
  }


  function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;
    return inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.slice(0, inputLength).toLowerCase() === inputValue;
        if (keep) {
          count += 1;
        }
        return keep;
      });
  }

  function getSuggestionValue(suggestion) {
    return suggestion;
  }

  const handleSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  const handleSuggestionsClearRequested = () => {
    setSuggestions([]);
    setNeedFetch(false);
  };

  const handleChange = name => (event, { newValue }) => {
    setTagName({
      ...tagName,
      [name]: newValue,
    });
  };

  const autosuggestProps = {
    renderInputComponent,
    suggestions: suggestions,
    onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
    onSuggestionsClearRequested: handleSuggestionsClearRequested,
    getSuggestionValue,
    renderSuggestion,
  };

  const clearTagName = () => setTagName({ single: '' });

  const handleTags = () => {
    let name = tagName.single;
    if (tags.includes(name))
      return clearTagName();
    RequestManager.addTag(name).then(() => {
      dispatch(addTag(name))
      clearTagName();
    })
    .catch(console.log)
  }

  const handleRemoveTag = (name) => {
    RequestManager.removeTag(name)
    .then(() => {
      dispatch(removeTag(name))
    })
    .catch(console.log);
  }

  const handleAddPopular = (name) => {
    setTagName({
      single: name
    });
    setNeedFetch(false);
  }

  const showTagsForm = () => {
    return (
      <div className={classes.root}>
        <div className="interests removable">
          <Typography gutterBottom>Vos tags</Typography>
          {tags.map((el) => <span onClick={() => handleRemoveTag(el)} key={el}>{el}</span>)}
        </div>
        <div className="interests popular">
          <Typography gutterBottom>Tags populaires</Typography>
          {popularTags.map((el) => <span onClick={() => handleAddPopular(el)} key={el}>{el}</span>)}
        </div>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            label: 'Ajouter un tag',
            placeholder: 'Love, italian..',
            value: tagName.single,
            onChange: handleChange('single'),
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
        <br />
        <Button variant="contained" color="primary" onClick={handleTags} disabled={!showAddTagButton}>
          Ajouter
        </Button>
      </div>
    )
  }

  return showTagsForm();
}

export default AddTagInput;