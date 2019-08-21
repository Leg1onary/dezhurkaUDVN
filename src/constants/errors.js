function errors(error) {
  switch (error.code) {
    case 'auth/user-not-found':
      return {
        message: 'Пользователь не найден',
        type: 'email',
      };
    case 'auth/wrong-password':
      return {
        message: 'Некорректный пароль',
        type: 'password',
      };
    case 'auth/email-already-in-use':
      return {
        message: 'Email уже используется',
        type: 'email',
      };
    case 'auth/weak-password':
      return {
        message: 'Пароль менее 6-ти символов',
        type: 'password',
      };
    case 'auth/invalid-email':
      return {
        message: 'Некорректный email',
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
