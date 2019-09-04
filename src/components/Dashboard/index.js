/* eslint-disable react/jsx-filename-extension */
import React, {useEffect, useState} from 'react';
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
import DeleteForever from "@material-ui/icons/DeleteForever";
import firebase from "firebase";

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

  const useFB = useFirebase();
  const user = useFB.getCurrentUser();
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    if (!user) {
      // not logged in
      // history.replace(ROUTES.LOGIN)
      history.push({
        pathname: ROUTES.LOGIN,
        search: '?from_dashboard=1',
      });
    }
  }, [useFB, history, user]);

  function useTodos() {
    const [todoList, setTodoList] = useState([]);
    useEffect(() => {
      const unsub = firebase
          .firestore()
          .collection('todos')
          .orderBy('dateAdd', 'desc')
          .onSnapshot((snapshot) => {
            const newTodos = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            }));
            setTodoList(newTodos)
          });
      return () => unsub();
    }, []);
    return todoList
  }

  async function addTodo(title, user) {
    try {
      await useFB.doAddTodo(title, user);
      setTodoTitle('')
    } catch(error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }
  }

  async function deleteTodo(key) {
      useFB.doDeleteTodo(key)
  }

  async function ChangeStatusTodo(key, status) {
      useFB.doChangeStatusTodo(key, status);
  }

  const Todos = useTodos();
  return (
      <div id="Dashboard">
        <NavBar/>
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
                  value={todoTitle}
                  onChange={e => setTodoTitle(e.target.value)}
              />
              <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: 8 }}
                  onClick={() => addTodo(todoTitle, user.email)}
              >
                Создать
              </Button>
            </form>
        </Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Текст задачи</TableCell>
              <TableCell align="right">Дата</TableCell>
              <TableCell align="right">Пользователь</TableCell>
              <TableCell align="right">Статус</TableCell>
                <TableCell align="right">Удалить</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Todos.map(todo => (
                <TableRow key={todo.id} style={(todo.isComplete) ? {backgroundColor: "#c3ffc3"}: {}}>
                  <TableCell component="th" scope="row">
                    {todo.title}
                  </TableCell>
                  <TableCell align="right">{todo.dateAdd}</TableCell>
                  <TableCell align="right">{todo.user}</TableCell>
                  <TableCell align="right">
                    {todo.isComplete ?
                        <Button variant="contained" color="primary" onClick={() => ChangeStatusTodo(todo.id, false)} style={{backgroundColor :'green'}}>Выполнено</Button> :
                        <Button variant="contained" color="primary" onClick={() => ChangeStatusTodo(todo.id, true)} style={{backgroundColor :'red'}}>В работе</Button>
                    }
                  </TableCell>
                    <TableCell align="right">
                      <Button variant="contained" color="secondary" onClick={() => deleteTodo(todo.id)}>
                        <DeleteForever />
                      </Button>
                    </TableCell>
                </TableRow>
            ))}
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
