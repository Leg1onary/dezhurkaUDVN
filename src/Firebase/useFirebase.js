import { useContext } from 'react';
import FirebaseContext from './context';


function useFirebase() {
  return useContext(FirebaseContext);
}

export default useFirebase;
