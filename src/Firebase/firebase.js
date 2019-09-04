import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'
import "moment";

const moment = require('moment');

const config = {
  apiKey: 'AIzaSyCz41uyDyH5_mTqaUK4VtXNPxmVqwDaXXg',
  authDomain: 'react-dezh36.firebaseapp.com',
  databaseURL: 'https://react-dezh36.firebaseio.com',
  projectId: 'react-dezh36',
  storageBucket: '',
  messagingSenderId: '152027097033',
  appId: '1:152027097033:web:9d6b7af54999cad8',
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.store = app.firestore();

    /* Providers */
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.githubProvider = new app.auth.GithubAuthProvider();
  }

  /*Firebase Auth*/
  async doCreateUserWithEmailAndPassword(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name,
    });
  }

  isInitialized() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  doSignInWithEmailAndPassword(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  doSignInWithProvider(provider) {
    switch (provider) {
      case 'google': return this.auth.signInWithPopup(this.googleProvider);
      case 'github': return this.auth.signInWithPopup(this.githubProvider);
      default : return null;
    }
  }

  doSignOut() {
    return this.auth.signOut();
  }

  doPasswordReset(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  /*Firestore*/

  users = () => this.store.collection('users');
  cmsHistory = () => this.store.collection('cmsHistory');

  doAddTodo(title, user){
    this.store.collection("todos").add({
      title: title,
      user: user,
      isComplete: false,
      dateAdd: moment().format("HH:mm DD/MM/YYYY")
    })
        .then(function(docRef) {
          // eslint-disable-next-line no-console
          console.log("Документ добавлен с ID: ", docRef.id);
        })
        .catch(function(error) {
          // eslint-disable-next-line no-console
          console.error("Ошибка добавления документа: ", error);
        });
  }
  doDeleteTodo(key) {
    this.store.collection("todos").doc(key).delete().then(function() {
      // eslint-disable-next-line no-console
      console.log("Документ успешно удален!");
    }).catch(function(error) {
      // eslint-disable-next-line no-console
      console.error("Ошибка удаления документа: ", error);
    });
  }
  doChangeStatusTodo(key, status) {
    this.store.collection("todos").doc(key).update({isComplete: status}).then(function() {
      // eslint-disable-next-line no-console
      console.log("Статус успешно изменен!");
    }).catch(function(error) {
      // eslint-disable-next-line no-console
      console.log("Ошибка изменения статуса: ", error);
    });
  }
}


export default Firebase;
