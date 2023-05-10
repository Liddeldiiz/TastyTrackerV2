import React, { useState, useEffect } from "react";
import { auth, db, storage } from '../config/Firebase';
import { collection, Firestore, GeoPoint, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { addToImageCollection } from "./UploadToCollection";
import { onAuthStateChanged } from 'firebase/auth';


export const UploadImage = (props) => {

    const [imageUpload, setImagseUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    //const [user, setUser] = useState({});
    
  
    const imagesCollectionRef = collection(db, "images");
    const imageListRef = ref(storage, "images/");

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

    const uploadImage = () => {
        if (imageUpload == null) return alert("No image has been selected");
        
        let uid = showCurrentUser();
        const d = new Date();
        let formattedDate = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`

        const imageRef = ref(storage, `images/${uid}/${formattedDate}/${imageUpload.name + v4()}`);

        let location = new GeoPoint(0, 0);
    
        console.log("uploading..."); // perhaps a spinner/loading bar here?

        //let uid = showCurrentUser();
        let tag = 1;
        addToImageCollection(uid, imageRef.fullPath, location, tag);

        console.log("imageRef: ", imageRef.fullPath);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageList((prev) => [...prev, url]);
          })
        });
    }

    
    return (props.trigger) ? (
        <div className='popup'>
            <div className='popup-inner'>
            <input type="file" onChange={(event) => {setImagseUpload(event.target.files[0])}}/>
            <button onClick={uploadImage}> upload image </button>
            <button onClick={showCurrentUser}> Show current user </button>
            <button className='cloes-btn' onClick={() => props.setTrigger(false)}>close</button>
            { props.children }
    
            </div>
        </div>
    ) : "";
};
