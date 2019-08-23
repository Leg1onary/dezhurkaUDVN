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
import ResetPassword from '../ResetPassword';
import NotFoundPage from "../NotFound";

import * as ROUTES from '../../constants/routes';
import { useFirebase } from '../../Firebase';
import CmsPage from "../CMS";
import RelaxPage from "../RelaxPage";

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
          <Route exact path={ROUTES.FORGOT_PASSWORD} component={ResetPassword} />
          <Route exact path={ROUTES.CMS} component={CmsPage} />
          <Route exact path={ROUTES.RELAX} component={RelaxPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Router>
    </MuiThemeProvider>
  ) : <div id="pageLoader"><CircularProgress /></div>;
}
