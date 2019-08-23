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
    case 'auth/popup-closed-by-user':
      return {
        message: 'Операция прервана пользователем',
        type: 'user'
      };
    case 'auth/cancelled-popup-request':
      return {
        message: 'Попытка двойной авторизации',
        type: 'user'
      };
    case 'auth/account-exists-with-different-credential':
      return {
        message: 'Email уже использовался для авторизации',
        type: 'email'
      };
    default:
      return {
        message: error.message || 'An error occurred',
        type: '',
      };
  }
}

export default errors;
