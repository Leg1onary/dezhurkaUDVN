function errors(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return {
        message: 'Email address invalid',
        type: 'email',
      };
    case 'auth/wrong-password':
      return {
        message: 'Password incorrect',
        type: 'password',
      };
    case 'auth/email-already-in-use':
      return {
        message: error.message,
        type: 'email',
      };
    case 'auth/weak-password':
      return {
        message: error.message,
        type: 'password',
      };
    case 'auth/invalid-email':
      return {
        message: error.message,
        type: 'email',
      };
    default:
      return {
        message: error.message || 'An error occurred',
        type: '',
      };
  }
}

export default errors;
