import { Container, makeStyles, Paper, InputBase, Divider } from "@material-ui/core";
import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import '../../css/chat.css'
import { Validator } from "../../models/Validator";
import { endpoint } from "../../config/config";
import { AuthManager } from "../../models/AuthManager";
import { addMessage, setMessages } from "../../actions/chat";

const useStyles = makeStyles({
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
    marginTop: 34
  },
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    marginLeft: 8,
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    width: 1,
    height: 28,
    margin: 4,
  },
  title: {
    color: '#707070',
    paddingTop: 20
  }
});

const Chat = ({ match, chat, dispatch }) => {
  console.log('render chat')
  const classes = useStyles();
  const [input, setInput] = useState('');
  const messages = chat;
  const [socket, setSocket] = useState();

  useEffect(() => {
    var socket = require('socket.io-client')(endpoint);
    setSocket(socket);
    socket.on('connect', () => {
      console.log('connected trying to login')
      socket.emit('login', {
        token: AuthManager.getToken()
      })
    });
    socket.on('logged', () => {
      console.log('successfully authentification')
      socket.emit('subscribe_DM', {
        username: match.params.username
      })
    })
    socket.on(`DM/${AuthManager.getUsername()}/${match.params.username}`, (data) => {
      console.log('receive message')
      dispatch(addMessage({
        me: false,
        date: data.date,
        text: data.text
      }))
    });
    socket.on('old_messages', (data) => {
      let tab = data.map((message) => {
        return {
          me: message.username === match.params.username,
          date: message.date,
          text: message.text
        }
      })
      tab.sort((a, b) => a.date - b.date)
      console.log(tab);
      dispatch(setMessages(tab))
    })
    socket.on('disconnect', () => {
      console.log('je déconnecte les flashs bongo')
    });
    return (() => {
      console.log('close actual socket..')
      socket.close();
    })
  }, [match.params.username, dispatch])

  const Messages = () => (
    <div className="chat">
      {messages.map((el) =>
        <p key={el.date} className={el.me ? 'from-me' : 'from-them'}>{el.text}</p>
      )}
    </div>
  )

  const sendMessage = () => {
    if (!Validator.message(input) && socket)
      return;
    socket.emit('send_message', {
      username: match.params.username,
      text: input
    })
    dispatch(addMessage({
      me: true,
      text: input,
      date: Date.now()
    }))
    setInput('');
  }

  const onKeyPress = (e) => (e.key === "Enter") ? sendMessage() : null;

  const SendInput = () => (
    <Paper className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Tapez votre message"
        inputProps={{ 'aria-label': 'Tapez votre message' }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={onKeyPress}
      />
      <Divider className={classes.divider} />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={sendMessage}>
        <SendIcon />
      </IconButton>
    </Paper>
  )

  return (
    <Container className={classes.container} maxWidth="sm">
      <h1 className={classes.title}>{match.params.username}</h1>
      <Messages />
      {SendInput()}
      <br/>
    </Container>
  )
}

export default Chat;
