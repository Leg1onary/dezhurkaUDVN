import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const devConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// Create Separate config and database for Prod

// const prodConfig = {

// };

// const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;
const config = devConfig;

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

  // TESTING PURPOSES
  addQuote(quote) {
    const user = this.auth.currentUser;

    if (!user) {
      return {
        success: false,
        error: {
          message: 'Not Authorized',
        },
      };
    }

    const { uid } = user;

    return this.db.ref(`users/${uid}`).set({
      quote,
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

  async getCurrentUserQuote() {
    const { uid } = this.auth.currentUser;

    const quote = await this.db.ref(`users/${uid}`).once('value').then(snapshot => (snapshot.val() && snapshot.val().quote) || 'NO QUOTE');

    return quote;
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
