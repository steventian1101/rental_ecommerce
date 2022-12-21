import { createContext, useContext, Context } from 'react'
import useFirebaseAuth from './useFirebaseAuth';

const authUserContext = createContext({
  authenticated:false,
  imageUrl:'',
  userCredential: [],
  error:'',
  signIn: ()=> {},
  createuser: () => {},
  googleAuth: () => {},
  logOut: () => {},
  errorRemove:() =>{}

});

export function AuthUserProvider({ children }) {
  const auth = useFirebaseAuth();
  return <authUserContext.Provider value={auth}>{children}</authUserContext.Provider>;
}

export const useAuth = () => useContext(authUserContext);
