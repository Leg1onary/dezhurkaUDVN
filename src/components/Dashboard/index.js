/* eslint-disable react/jsx-filename-extension */
import React, {useEffect, useMemo, useState} from 'react';
import {
  Typography, Paper, Button, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as ROUTES from '../../constants/routes';
import { useFirebase } from '../../Firebase';
import NavBar from "../NavBar";
import TextField from "@material-ui/core/TextField";

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
    marginTop: theme.spacing(2),
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
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

function Dashboard(props) {
  const { classes, history } = props;

  const firebase = useFirebase();
  const user = firebase.getCurrentUser();
  const [todos, setTodos] = useState([{
    title: '',
    dateAdd: '',
    isComplete: false,
    userAdd: user.email
  }]);

  useEffect(() => {
    if (!user) {
      // not logged in
      // history.replace(ROUTES.LOGIN)
      history.push({
        pathname: ROUTES.LOGIN,
        search: '?from_dashboard=1',
      });
    }
  }, [firebase, history, user]);

  async function logout() {
    await firebase.doSignOut();
    history.push(ROUTES.HOME);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => {
    firebase.todos().onSnapshot(query => {
      const data = [];
      query.forEach(d => data.push({...d.data(), docId: d.id}));
      setTodos(data)
    });
  },[firebase]);

  return (
      <div id="Dashboard">
        <NavBar/>
        <Button
            type="submit"
            variant="contained"
            color="secondary"
            onClick={logout}
            className={classes.submit}
        >
          Выйти
        </Button>

          <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Список задач
          </Typography>
            <form className={classes.container} noValidate autoComplete="off">
              <TextField
                  id="outlined-full-width"
                  label="Создать новую задачу..."
                  style={{ margin: 8 }}
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  multiline
              />
              <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  style={{ margin: 8 }}
              >
                Создать
              </Button>
            </form>
        </Paper>
        <Table    >
          <TableHead>
            <TableRow>
              <TableCell>Текст задачи</TableCell>
              <TableCell align="right">User Add</TableCell>
              <TableCell align="right">is Complete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          </TableBody>
        </Table>
      </div>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.shape({
    main: PropTypes.string.isRequired,
    paper: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    submit: PropTypes.string.isRequired,
    container: PropTypes.string.isRequired,
    textField: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));
