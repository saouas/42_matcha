import React, { useEffect } from 'react'
import { MenuItem } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Menu from '@material-ui/core/Menu';
import SearchIcon from '@material-ui/icons/Search';
import PeopleIcon from '@material-ui/icons/People'
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import KeyboardIcon from '@material-ui/icons/KeyboardTab';
import MoreIcon from '@material-ui/icons/MoreVert';
import history from '../../models/history'
import { AuthManager } from '../../models/AuthManager';
import openSocket from 'socket.io-client'
import { NotificationManager } from 'react-notifications';
import { e_notification_type } from '../../models/e_notification_type';
import { endpoint } from '../../config/config';
import { addNotification, setNotificationsCount } from '../../actions/notifications';
import { RequestManager } from '../../models/RequestManager';

const useStyles = makeStyles(theme => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    cursor: 'pointer'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    '&:hover': {
      color: 'blue',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  match: {
    '&:hover': {
      color: 'blue',
    },
  },
  notifications: {
    '&:hover': {
      color: 'blue',
    },
  },
  account: {
    '&:hover': {
      color: 'blue',
    },
  }
}));

const getText = (content) => {
  const username = content.username;
  if (e_notification_type.LIKE_YOU === content.type)
    return `${username} vous a liké`
  if (e_notification_type.MATCH_LIKE === content.type)
    return `${username} a matché avec vous`
  if (e_notification_type.MATCH_UNLIKE === content.type)
    return `Oh non ! ${username} ne match plus avec vous`
  if (e_notification_type.RECEIVE_MESSAGE === content.type)
    return `${username} vous a envoyé un message`
  if (e_notification_type.VISIT_YOU === content.type)
    return `${username} a visité votre profil`
}

const popNotification = (content) => {
  let text = getText(content);
  NotificationManager.info(text)
}

const Header = ({ logged, notifications, dispatch, username, count }) => {
  console.log('render menu bar')
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  useEffect(() => {
    if (!AuthManager.isLogged())
      return;
    var socket = openSocket(endpoint);
    socket.on('connect', () => {
      console.log('connected trying to login')
      socket.emit('login', {
        token: AuthManager.getToken()
      })
    });
    socket.on(`notification`, (data) => {
      console.log('receive notification')
      popNotification(data);
      dispatch(addNotification(data))
    });
    socket.on('disconnect', () => {
      console.log('je déconnecte les flashs bongo')
    });
    return (() => {
      console.log('close actual socket..')
      socket.close();
    })
  }, [dispatch, username, logged])

  useEffect(() => {
    if (!logged)
      return ;
    RequestManager.countNotifications()
    .then((res) => {
      dispatch(setNotificationsCount(res.data.count));
    })
  }, [dispatch, username, logged])

  if (!logged)
    return (null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  function navigateMobile(url) {
    setMobileMoreAnchorEl(null);
    history.push(url);
  }

  const logout = () => {
    setMobileMoreAnchorEl(null);
    AuthManager.disconnect();
    history.push('/login')
  }

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => navigateMobile(`/match`)}>
        <IconButton aria-label="rechercher des profils" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <PeopleIcon className={classes.match} />
          </Badge>
        </IconButton>
        <p>Match</p>
      </MenuItem>

      <MenuItem onClick={() => navigateMobile(`/search`)}>
        <IconButton aria-label="rechercher des profils" color="inherit">
          <Badge badgeContent={0} color="secondary">
            <SearchIcon className={classes.searchIcon} />
          </Badge>
        </IconButton>
        <p>Recherche</p>
      </MenuItem>

      <MenuItem onClick={() => navigateMobile(`/notifications`)}>
        <IconButton aria-label="show notifications" color="inherit">
          <Badge badgeContent={notifications.length} color="secondary">
            <NotificationsIcon className={classes.notifications} />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>

      <MenuItem onClick={() => navigateMobile(`/profile/${username}`)}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profil</p>
      </MenuItem>

      <MenuItem onClick={logout}>
        <IconButton
            aria-label="disconnect"
            color="inherit"
          >
            <KeyboardIcon/>
        </IconButton>
        <p>Déconnexion</p>
      </MenuItem>
    </Menu>
  );

  const renderDesktopMenu = (
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography className={classes.title} variant="h6" noWrap onClick={() => history.push('/')}>
          Matcha
        </Typography>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>

          <IconButton aria-label="match des profils" color="inherit" onClick={() => history.push(`/match`)}>
            <Badge badgeContent={0} color="secondary">
              <PeopleIcon className={classes.match} />
            </Badge>
          </IconButton>

          <IconButton aria-label="rechercher des profils" color="inherit" onClick={() => history.push(`/search`)}>
            <Badge badgeContent={0} color="secondary">
              <SearchIcon className={classes.searchIcon} />
            </Badge>
          </IconButton>
          <IconButton aria-label="show notifications" color="inherit" onClick={() => history.push(`/notifications`)}>
            <Badge badgeContent={count} color="secondary">
              <NotificationsIcon className={classes.notifications} />
            </Badge>
          </IconButton>
          <IconButton onClick={() => navigateMobile(`/profile/${username}`)}
            aria-label="you profile"
            color="inherit"
          >
            <AccountCircle className={classes.account} />
          </IconButton>
          <IconButton onClick={logout}
            aria-label="disconnect"
            color="inherit"
          >
            <KeyboardIcon/>
          </IconButton>
        </div>
        <div className={classes.sectionMobile}>
          <IconButton
            aria-label="show more"
            aria-controls={mobileMenuId}
            aria-haspopup="true"
            onClick={handleMobileMenuOpen}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )

  return (
    <div className={classes.grow}>
      {renderDesktopMenu}
      {renderMobileMenu}
    </div>
  );
}

export default Header;
