import { auth } from '../config/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState } from "react";

export const Home = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

    return (
    <div>
      <div className='app-header'>
        <h3 className='welcome-user'>Hi, {user.email}</h3>
        <a href='./settings' className='settings-img'> Settings symbol </a>
      </div>

      <div className='app-body'>
        <p> This is the app body. </p>
        <a href='./library' className='lib-img'>Library img <p className='lib-desc'>Library</p> </a>

        <div className='uploads'>
          <h3 className='uploads-msg'> Add your first meal of the day </h3>
        </div>

        <div className='uploads'>
          <h3> images </h3>
        </div>

        <div className='uploads'>
          <h3> images </h3>
        </div>
        
      </div>
      <div className='app-footer'>
        <p> This is the app footer. </p>
        <p className='plus-symbol'> + </p>
      </div>
      
    </div>
    );

}
  
