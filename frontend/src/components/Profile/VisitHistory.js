import React, { useState, useEffect, useCallback } from "react";
import { Grid, Divider } from "@material-ui/core";
import history from "../../models/history";
import { AuthManager } from "../../models/AuthManager";
import { NotificationManager } from "react-notifications";
import defaultPic from '../../img/egg.jpg';
import { RequestManager } from "../../models/RequestManager";
import { profile_pictures_url } from "../../config/config";

const getURLPic = (name) => {
  if (name)
    return `${profile_pictures_url}/${name}`
  return (null);
}

const VisitHistory = ({ username }) => {
  const [visitHistory, setVisitHistory] = useState([]);

  const loadHistory = useCallback(() => {
    if (AuthManager.getUsername() !== username)
      return setVisitHistory([]);
    RequestManager.getHistory()
      .then((res) => {
        setVisitHistory(res.data);
      })
      .catch(() => {
        NotificationManager.error("Impossible de récupérer l'historique de visites")
      })
  }, [username]);

  useEffect(loadHistory, [loadHistory]);

  if (visitHistory.length === 0)
    return (null);
  return (
    <div>
      <h2>Historique de visites</h2>
      <Divider />
      <Grid container spacing={1} className="historic">
        {visitHistory.map((el) =>
          <Grid key={el.username} item xs={2}>
            <img alt=''
              src={getURLPic(el.profile_pic) || defaultPic}
              onClick={() => history.push(`/profile/${el.username}`)}
            />
          </Grid>
        )}
      </Grid>
      <Divider />
    </div>
  )
}

export default VisitHistory;