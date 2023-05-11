import React, { createContext, useState } from 'react';
import { auth } from '../config/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

let user;

onAuthStateChanged(auth, (currentUser) => {
    user = currentUser;
  });

export const UserContext = createContext(user);