import React from 'react';

import { Firestore, collection, addDoc, from, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/Firebase';



export async function addToImageCollection(uid, imageRefPath, location, tag) {
    //e.preventDefault();
    console.log("userId from previous step:", uid);
    const d = new Date();
    //const t = new Timestamp(d.getSeconds, d.getMilliseconds * 1000000);
    
    console.log("new date: ", d)
    try {
      const docRef = await addDoc(collection(db, "images"), {
        user_id: uid,
        image_reference_path: imageRefPath,
        upload_date: d,
        location: location,
        tag: tag
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }