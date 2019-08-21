import { useContext } from 'react';
import FirebaseContext from './context';


function useFirebase() {
  const firebase = useContext(FirebaseContext);
  return firebase;
}

export default useFirebase;
