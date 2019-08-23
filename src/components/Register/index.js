/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import {
  Typography, Paper, Avatar, Button, CssBaseline, TextField, Grid,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';
import ERRORS from '../../constants/errors';
import { useFirebase } from '../../Firebase';
import SnackbarWrapper from '../Snackbars';

import '../../styles/authPages.css';

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

function Register(props) {
  const { classes, history } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState('');

  const isInvalid = (password === '')
  || (passwordConfirm === '')
  || (email === '')
  || (name === '');
  const isInvalidPasswordMatch = (password !== passwordConfirm);

  const firebase = useFirebase();
  const user = firebase.getCurrentUser();

  if (user) {
    history.replace(ROUTES.DASHBOARD);
    return null;
  }

  function onClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setErrorOpen(false);
  }

  function resetErrors() {
    setErrorOpen(false);
  }

  async function onRegister() {
    resetErrors();

    if (isInvalidPasswordMatch) {
      setErrorOpen(true);
      setErrorMessage('Пароли не совпадают');
      setErrorType('password');
      return;
    }
    try {
      await firebase.doCreateUserWithEmailAndPassword(name, email, password);
      history.replace(ROUTES.DASHBOARD);
    } catch (error) {
      setErrorOpen(true);
      const formattedError = ERRORS(error);
      setErrorMessage(formattedError.message);
      setErrorType(formattedError.type);
    }
  }

  return (
  // eslint-disable-next-line react/prop-types
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
              Регистрация
          </Typography>
          <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="ФИО"
              name="name"
              autoComplete="off"
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email адрес"
              name="email"
              autoComplete="off"
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
              autoComplete="off"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errorType === 'password'}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="passwordConfirm"
              label="Подтверждение пароля"
              type="password"
              id="passwordConfirm"
              autoComplete="off"
              value={passwordConfirm}
              onChange={e => setPasswordConfirm(e.target.value)}
              error={errorType === 'password'}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onRegister}
              disabled={isInvalid}
            >
                Регистрация
            </Button>
            <Grid container>
              <Grid item>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <Button
                  variant="contained"
                  color="secondary"
                >
                  <Link className="auth-button-nav" to={ROUTES.LOGIN} variant="body2">
                    Авторизация
                  </Link>
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
      <SnackbarWrapper
        type="error"
        isOpen={errorOpen}
        message={errorMessage}
        handleClose={onClose}
      />
    </Grid>
  );
}

Register.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    form: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(withStyles(styles)(Register));
