/* eslint-disable react/jsx-filename-extension */
import React, { useState, useEffect } from 'react';
import './styles.scss';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { CssBaseline, CircularProgress } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from '../HomePage';
import Login from '../Login';
import Register from '../Register';
import Dashboard from '../Dashboard';
// Resets CSS across browswers

import * as ROUTES from '../../constants/routes';
import { useFirebase } from '../../Firebase';

const theme = createMuiTheme();

export default function App() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  const firebase = useFirebase();

  useEffect(() => {
    firebase.isInitialized().then((val) => {
      setFirebaseInitialized(val);
    });
  }, [firebase]);

  return firebaseInitialized !== false ? (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Switch>
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.LOGIN} component={Login} />
          <Route exact path={ROUTES.REGISTER} component={Register} />
          <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  ) : <div id="pageLoader"><CircularProgress /></div>;
}
