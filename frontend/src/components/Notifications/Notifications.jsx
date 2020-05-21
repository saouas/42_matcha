import React, { useEffect } from 'react';
import { Container, makeStyles, Paper, Button } from "@material-ui/core";
import { e_notification_type } from '../../models/e_notification_type';
import { setNotifications, clearNotifications } from '../../actions/notifications';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import AssistantPhotoIcon from '@material-ui/icons/AssistantPhoto';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import MessageIcon from '@material-ui/icons/Message'
import history from '../../models/history';
import { NotificationManager } from 'react-notifications';
import { RequestManager } from '../../models/RequestManager';

const useStyles = makeStyles({
  container: {
    border: 0,
    borderRadius: 3,
    boxShadow: '0 0 0.5em rgba(0, 0, 0, 0.15)',
    color: 'white',
    padding: '0 30px',
    marginTop: 34,
  },
  notification: {
    padding: 10,
    marginTop: 8,
    marginBottom: 8,
    fontSize: 20
  },
  notifications: {
    paddingTop: 10,
    paddingBottom: 10
  },
  icon: {
    paddingRight: 8,
    verticalAlign: -6
  },
  username: {
    color: '#3f51b5',
    cursor: 'pointer'
  },
  clear_container: {
    height: 50
  },
  clear: {
    marginTop: 15,
    float: 'right'
  }
});

const Notifications = ({ dispatch, notifications }) => {
  console.log('render notifications')
  const classes = useStyles();

  useEffect(() => {
    RequestManager.getNotifications()
      .then((res) => {
        dispatch(setNotifications(res.data));
      })
      .catch((err) => {
        console.log(err);
        NotificationManager.error('Impossible de récuperer les notifications')
      })
  }, [dispatch])

  const clearNotificationsAPI = () => {
    RequestManager.clearNotifications()
    .then(() => {
      dispatch(clearNotifications());
    })
    .catch(() => {
      NotificationManager.error('Impossible de supprimer les notifications')
    })
  }

  const renderNotification = (content) => {
    const username = <span className={classes.username} onClick={() => history.push(`/profile/${content.username}`)}>{content.username}</span>;
    const text = (() => {
      if (e_notification_type.LIKE_YOU === content.type)
        return (<> <ThumbUpIcon className={classes.icon} /> {username} vous a liké </>)
      if (e_notification_type.MATCH_LIKE === content.type)
        return (<> <WhatshotIcon className={classes.icon} />{username} a matché avec vous </>)
      if (e_notification_type.MATCH_UNLIKE === content.type)
        return (<> <AssistantPhotoIcon className={classes.icon} />Oh non ! {username} ne match plus avec vous </>)
      if (e_notification_type.RECEIVE_MESSAGE === content.type)
        return (<> <MessageIcon className={classes.icon} />{username} vous a envoyé un message </>);
      if (e_notification_type.VISIT_YOU === content.type)
        return (<> <DirectionsRunIcon className={classes.icon} />{username} a visité votre profil </>)
    })()

    return (
      <Paper key={content.date} className={classes.notification}>{text}</Paper>
    )
  }

  return (
    <Container className={classes.container} maxWidth="sm">
      <div className={classes.clear_container}>
        <Button onClick={clearNotificationsAPI} className={classes.clear} size="medium" variant="contained" color="primary">
          Supprimer notifications
      </Button>
      </div>
      <div className={classes.notifications}>
        {notifications.map(renderNotification)}
      </div>
    </Container>
  )
}

export default Notifications;