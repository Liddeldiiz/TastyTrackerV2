import React, { useState, useEffect } from "react";
import { auth, db, storage } from '../config/Firebase';
import { collection, Firestore, GeoPoint, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { addToImageCollection } from "./UploadToCollection";
import { onAuthStateChanged } from 'firebase/auth';


export function uploadImage(imageFile, timeStamp, geoLocation, selectedTag, note) {

    const showCurrentUser = () => {

        const d = new Date();
        let formattedDate = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
        console.log(formattedDate);
        return auth?.currentUser.uid;
    }

    /*  to be implemented
    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    })*/
  
    if (imageFile == null) return alert("No image has been selected");
        
    let uid = showCurrentUser();
    const d = new Date();
    let formattedDate = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`

    const imageRef = ref(storage, `images/${uid}/${formattedDate}/${imageFile.name + v4()}`);
    
    console.log("uploading..."); // perhaps a spinner/loading bar here?

    //let uid = showCurrentUser();
    //let tag = 1;
    addToImageCollection(uid, imageRef.fullPath, geoLocation, selectedTag, timeStamp, note);

    console.log("imageRef: ", imageRef.fullPath);
    uploadBytes(imageRef, imageFile).then(() => {
        alert("image uploaded");
    });
    return console.log("upload done");
}

