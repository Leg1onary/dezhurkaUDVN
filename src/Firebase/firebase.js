import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'

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

  /* Firestore*/
  users = () => this.store.collection('users');
  todos = () => this.store.collection('todos');
  cmsHistory = () => this.store.collection('cmsHistory');
  /*********/

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

  doPasswordUpdate(password) {
    return this.auth.currentUser.updatePassword(password);
  }
}


export default Firebase;
