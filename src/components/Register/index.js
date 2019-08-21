/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import {
  Typography, Paper, Avatar, Button, FormControl, Input, InputLabel,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';
import ERRORS from '../../constants/errors';
import { useFirebase } from '../../Firebase';
import SnackbarWrapper from '../Snackbars';

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
    padding: theme.spacing(2, 3, 2),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

function Register(props) {
  const { classes, history } = props;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [quote, setQuote] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorType, setErrorType] = useState('');

  const isInvalid = (password === '')
  || (passwordConfirm === '')
  || (email === '')
  || (quote === '')
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
      setErrorMessage('Passwords do not match');
      setErrorType('password');
      return;
    }
    try {
      await firebase.doCreateUserWithEmailAndPassword(name, email, password);
      await firebase.addQuote(quote);
      history.replace(ROUTES.DASHBOARD);
    } catch (error) {
      setErrorOpen(true);
      const formattedError = ERRORS(error);
      setErrorMessage(formattedError.message);
      setErrorType(formattedError.type);
    }
  }

  return (
    <main className={classes.main}>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register Account
        </Typography>
        <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
          <FormControl
            margin="normal"
            required
            fullWidth
          >
            <InputLabel htmlFor="name">Name</InputLabel>
            <Input id="name" type="text" name="name" autoComplete="off" autoFocus value={name} onChange={e => setName(e.target.value)} />
          </FormControl>
          <FormControl
            margin="normal"
            required
            fullWidth
            error={errorType === 'email'}
          >
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input id="email" type="text" name="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <FormControl
            margin="normal"
            required
            fullWidth
            error={errorType === 'password'}
          >
            <InputLabel htmlFor="password">Password</InputLabel>
            <Input name="password" type="password" id="password" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <FormControl
            margin="normal"
            required
            fullWidth
            error={errorType === 'password'}
          >
            <InputLabel htmlFor="passwordConfirm">Confirm Password</InputLabel>
            <Input name="passwordConfirm" type="password" id="passwordConfirm" autoComplete="off" value={passwordConfirm} onChange={e => setPasswordConfirm(e.target.value)} />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="quote">Your Favorite Quote</InputLabel>
            <Input name="quote" type="text" id="quote" autoComplete="off" value={quote} onChange={e => setQuote(e.target.value)} />
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={onRegister}
            disabled={isInvalid}
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
            Go back to Login
          </Button>
        </form>
      </Paper>
      <SnackbarWrapper
        type="error"
        isOpen={errorOpen}
        message={errorMessage}
        handleClose={onClose}
      />
    </main>
  );
}

Register.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
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
