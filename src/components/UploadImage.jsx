import React, { useState, useEffect } from "react";
import { auth, db, storage } from '../config/Firebase';
import { collection, Firestore, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { addToImageCollection } from "./UploadToCollection";


export const UploadImage = (props) => {

    const [imageUpload, setImagseUpload] = useState(null);
    const [imageList, setImageList] = useState([]);
    
  
    const imagesCollectionRef = collection(db, "images");
    const imageListRef = ref(storage, "images/");

    const showCurrentUser = () => {

        const d = new Date();
        console.log("type of date; ", typeof(d));
        return auth?.currentUser.uid;
    }

    const uploadImage = () => {
        if (imageUpload == null) return alert("No image has been selected");
        
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
    
        console.log("uploading..."); // perhaps a spinner/loading bar here?

        let uid = showCurrentUser();
        addToImageCollection(uid, imageRef.fullPath);

        console.log("imageRef: ", imageRef.fullPath);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setImageList((prev) => [...prev, url]);
          })
        });
    }

    
    /*
    useEffect(() => {
        listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]);
                });
            });
        });
    }, []);
    */
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

/*

{imageList.map((url) => {
                return <img src={url} />
            })}

*/