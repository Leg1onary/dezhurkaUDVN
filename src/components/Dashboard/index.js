/* eslint-disable react/jsx-filename-extension */
import React, {useEffect, useState} from 'react';
import {
  Typography, Paper, Button, Table, TableBody, TableCell, TableHead, TableRow
} from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useFirebase } from '../../Firebase';
import NavBar from "../NavBar";
import TextField from "@material-ui/core/TextField";
import DeleteForever from "@material-ui/icons/DeleteForever";
import firebase from "firebase";

import * as notActiveTasks from '../../images/notTaskActive.png';

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
  image: {
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    maxWidth: '100%',
    maxHeight: '100%',
  },
});

function Dashboard(props) {
  const { classes } = props;

  const useFB = useFirebase();
  const user = useFB.getCurrentUser();
  const [todoTitle, setTodoTitle] = useState('');


  function useTodos() {
    const [todoList, setTodoList] = useState([]);
    useEffect(() => {
      const unsub = firebase
          .firestore()
          .collection('todos')
          .orderBy('isComplete').orderBy('dateAdd', 'desc')
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
        {Todos.length > 0 ?
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
                    <TableRow key={todo.id} style={(todo.isComplete) ? {backgroundColor: "#c3ffc3"} : {}}>
                      <TableCell component="th" scope="row">
                        {todo.title}
                      </TableCell>
                      <TableCell align="right">{todo.dateAdd}</TableCell>
                      <TableCell align="right">{todo.user}</TableCell>
                      <TableCell align="right">
                        {todo.isComplete ?
                            <Button variant="contained" color="primary" onClick={() => ChangeStatusTodo(todo.id, false)}
                                    style={{backgroundColor: 'green'}}>Выполнено</Button> :
                            <Button variant="contained" color="primary" onClick={() => ChangeStatusTodo(todo.id, true)}
                                    style={{backgroundColor: 'red'}}>В работе</Button>
                        }
                      </TableCell>
                      <TableCell align="right">
                        <Button variant="contained" color="secondary" onClick={() => deleteTodo(todo.id)}>
                          <DeleteForever/>
                        </Button>
                      </TableCell>
                    </TableRow>
                ))}
              </TableBody>
            </Table> :
            <div id="AllTasksComplete">
              <h2 style={{textAlign:'center', marginTop:'20px', fontStyle:'italic'}}>Нет актуальных задач :)</h2>
              <div id="ImgAllTasksComplete" style={{position: 'fixed', bottom: '-10px', width: '100%', textAlign: 'center'}} >
                <img className={classes.image} src={notActiveTasks} alt="NotActiveTasksImage"/>
              </div>
            </div>
        }
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
    image: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default withRouter(withStyles(styles)(Dashboard));
