/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import {
  Typography, Paper, Avatar, Button,
} from '@material-ui/core';
import VerifiedUserOutlined from '@material-ui/icons/VerifiedUserOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
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

function HomePage(props) {
  const { classes, history } = props;

  const firebase = useFirebase();
  const user = firebase.getCurrentUser();

  if (user) {
    history.replace(ROUTES.DASHBOARD);
    return null;
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <VerifiedUserOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Hello Guest!
        </Typography>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          component={Link}
          to={ROUTES.REGISTER}
          className={classes.submit}
        >
          Register
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          component={Link}
          to={ROUTES.LOGIN}
          className={classes.submit}
        >
          Login
        </Button>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="secondary"
          component={Link}
          to={ROUTES.DASHBOARD}
          className={classes.submit}
        >
          Dashboard
        </Button>
      </Paper>

    </main>
  );
}

HomePage.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withStyles(styles)(HomePage);
