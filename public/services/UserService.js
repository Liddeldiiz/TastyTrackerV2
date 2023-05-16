import { useContext } from 'react';
import {
  collection
} from 'firebase/firestore';
import db from '../config/Firebase';
//import { v4 as uuidv4 } from 'uuid';

function UserService() {
    //const collectionRef = collection(db, 'usr');

    const { currentUser } = useContext(AuthContext);

    //const currentUserId = currentUser ? currentUser.uid : null;
}

/*

import React, { useState, useEffect, Fragment, useContext } from 'react';
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

*/