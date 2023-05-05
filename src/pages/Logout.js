import { auth } from '../config/Firebase';
import { signOut } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

export const Logout = () => {
  
    const logout = async () => {
      try {
          console.log("logging out");
          await signOut(auth);
      } catch(err) {
          console.error(err);
      }
  };

    return (
      <div>
        {logout()}
        {Navigate("./login")}
      </div>
    );
}
