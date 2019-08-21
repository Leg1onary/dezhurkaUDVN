import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

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
    this.db = app.database();
  }

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

  doSignOut() {
    return this.auth.signOut();
  }

  doPasswordReset(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  doPasswordUpdate(password) {
    return this.auth.currentUser.updatePassword(password);
  }

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}

export default Firebase;
