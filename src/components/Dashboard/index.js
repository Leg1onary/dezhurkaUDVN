/* eslint-disable react/jsx-filename-extension */
import React, { useEffect, useState } from 'react';
import {
  Typography, Paper, Avatar, CircularProgress, Button,
} from '@material-ui/core';
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';
import { useFirebase } from '../../Firebase';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(6))]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2, 3, 3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

function Dashboard(props) {
  const { classes, history } = props;

  const firebase = useFirebase();
  const [quote, setQuote] = useState('');
  const user = firebase.getCurrentUser();

  useEffect(() => {
    if (!user) {
      // not logged in
      // history.replace(ROUTES.LOGIN)
      history.push({
        pathname: ROUTES.LOGIN,
        search: '?from_dashboard=1',
      });
      // Dashboard doesn't require cleanup so return undefined not null
      return;
    }

    firebase.getCurrentUserQuote().then(setQuote);
  }, [firebase, history, user]);

  async function logout() {
    await firebase.doSignOut();
    history.push(ROUTES.HOME);
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VerifiedUserOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          {/* Hello { firebase.getCurrentUser().displayName } */}
        </Typography>
        <Typography component="h1" variant="h5">
          {'Your quote: '}
          {quote ? `"${quote}"` : <CircularProgress size={20} />}
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          onClick={logout}
          className={classes.submit}
        >
          Logout
        </Button>
      </Paper>
    </main>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));
