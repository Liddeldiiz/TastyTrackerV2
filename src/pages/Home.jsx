import { auth } from '../config/Firebase';
import { 
    onAuthStateChanged } from 'firebase/auth';
import { useState } from "react";

import { Logout } from '../components/Logout';

export const Home = () => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
});

  
/*
if(user?.email == undefined) {
  return Navigate("../components/auth");
} else {*/

    return (
    <div>
      <h1>Home</h1>
      <h4> User Logged In: </h4>
      {user?.email}
      <Logout />
    </div>
    );

}
  
