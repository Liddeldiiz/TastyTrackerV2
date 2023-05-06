import React from "react";
import { useState } from "react";
/*
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";*/
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/Firebase';

import { Delete } from '../components/Delete';
import { Logout } from '../components/Logout';

export const Settings = () => {
    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    return (

        <div>
      <div className='app-header'>
        <h3 className='settings-img'> Settings img </h3>
        <h3 className='settings-img'> Settings </h3>
        <a href='/' className='home-img'> Home symbol </a>
      </div>

      <div className='app-body'>
        <p> This is the app body. </p>
        <h3 className='welcome-user'>Hi, {user.email}</h3>

        <div className='user-settings'>

          <input 
          type='text'
          placeholder="Username..."
          id='username'
          name='username'/>

          <input 
          type='email'
          placeholder="Email address..."
          id='email'
          name='email'/>

          <input 
          type='number'
          placeholder="Meals per day..."
          id='mealsPerDay'
          name='mealsPerDay'/>

          <p> Time before notifications </p>

          <div className="notification-settings">
            <p> notification settings</p>
          </div>

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
        <Logout />
        <Delete />
      </div>
      
    </div>);
}