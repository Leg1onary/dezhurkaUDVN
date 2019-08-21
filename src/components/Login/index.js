/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Avatar, Button, CssBaseline, TextField, Grid,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import queryString from 'query-string';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';
import ERRORS from '../../constants/errors';
import { useFirebase } from '../../Firebase';
import SnackbarWrapper from '../Snackbars';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/featured/?cctv)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

function Login(props) {
  const { classes, history } = props;

  const firebase = useFirebase();
  const user = firebase.getCurrentUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState('');
  const [warningOpen, setWarningOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const isInvalid = password === '' || email === '';


  useEffect(() => {
    const searchUrl = history.location.search;
    const searchParams = queryString.parse(searchUrl);
    if (searchParams.from_dashboard) {
      setWarningOpen(true);
      setWarningMessage('Для начала авторизуйтесь!');
    }
  }, [history.location.search]);

  if (user) {
    history.replace(ROUTES.DASHBOARD);
    return null;
  }

  function onErrorClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  }

  function onWarningClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setWarningOpen(false);
  }

  function resetErrors() {
    setErrorOpen(false);
    setWarningOpen(false);
  }

  async function login() {
    resetErrors();
    try {
      await firebase.doSignInWithEmailAndPassword(email, password);
      history.replace(ROUTES.DASHBOARD);
    } catch (error) {
      setErrorOpen(true);
      const formattedError = ERRORS(error);
      setErrorMessage(formattedError.message);
      setErrorType(formattedError.type);
    }
  }

  return (

    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      {/* eslint-disable-next-line react/prop-types */}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
              Авторизация
          </Typography>
          <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errorType === 'email'}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Пароль"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errorType === 'password'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={login}
              disabled={isInvalid}
            >
                Войти
            </Button>
            <Grid container>
              <Grid item xs>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Link to={ROUTES.FORGOT_PASSWORD} variant="body2">
                    Забыли пароль?
                </Link>
              </Grid>
              <Grid item>
                <Link to={ROUTES.REGISTER} variant="body2">
                  <b>Регистрация новой уч.записи</b>
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <SnackbarWrapper
        type="error"
        isOpen={errorOpen}
        message={errorMessage}
        handleClose={onErrorClose}
      />
      <SnackbarWrapper
        type="warning"
        isOpen={warningOpen}
        message={warningMessage}
        handleClose={onWarningClose}
      />
    </Grid>
  );
}

Login.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(withStyles(styles)(Login));
