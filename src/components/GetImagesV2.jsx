import { useState, useEffect } from 'react';

import { db, storage, auth } from '../config/Firebase';
import { collection, getDocs, query, where, onSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';


import '../static/css/App.css';


export const GetImages = ( props ) => {

  const [images, setImages] = useState();
  const [imageList, setImageList] = useState([]);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(false);
  
  onAuthStateChanged(auth, (currentUser) => {  
    console.log("current user uid: ", user.uid);
    setUser(currentUser);
  });
  

  const setupConstraints = async () => {    

    let start = new Date(props.formattedStartDate);
    let end = new Date(props.formattedEndDate);
    
    const queryConstraints = []

    queryConstraints.push(where('upload_date', '>=', start));
    queryConstraints.push(where('upload_date', '<=', end));
    queryConstraints.push(where('user_id', '==', user.uid));
    return queryConstraints;
  }  
  
  useEffect(() => {
    async function getStorageItems() {
      setLoader(true);
      console.log("loader: ", loader);
        // collection reference
        const colRef = collection(db, 'images');

        // setiing up the constraints for the query
        let queryConstraints = await setupConstraints();
        //console.log("queryConstraints: ", queryConstraints);
        
        // query
        const q = query(colRef, ...queryConstraints);
        //console.log("query: ", q);

        const imagesFromDb = [];
        // real time collection data
        onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            imagesFromDb.push({ ...doc.data(), id: doc.id });
          });
          setImages(imagesFromDb);
          
          const split = imagesFromDb[0].image_reference_path.split('/');
          //console.log("split: ", split);
          const img_usr_ref = split[1];
          //console.log("img_usr_ref: ", img_usr_ref);
          const img_upload_date = split[2];
          //console.log("img_upload_date: ", img_upload_date);
          const imageListRef = ref(storage, `images/${img_usr_ref}/${img_upload_date}/`);
          //console.log("imageListRef: ", imageListRef);
          //console.log(`downloading pictures for ${img_upload_date}`);
          listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                  for(let i = 0; i < imageList.length; i++) {
                    if (imageList[i] === url) { // this should prevent downloading the same images twice
                      return;
                    }
                  }
                  console.log("url: ", url);
                    setImageList((prev) => [...prev, url]);
                    setLoader(false);});});});
          console.log(imageList);
        });
    }
    if (props.formattedStartDate === undefined || props.formattedEndDate === undefined) { return <></> }
    else {
      try {
        console.log('props.formattedStartDate is: ', props.formattedStartDate);
        console.log('props.formattedEndDate is: ', props.formattedEndDate);
        getStorageItems();
      } catch(error) {
        console.log("try catch error: ", error.message);
      };
    }
  }, [props.formattedStartDate, props.formattedEndDate, user]);

  return (
    <a href='asdf'>
      <div className='images-container'>
        {imageList.map((url) => {
          return <img src={url} alt='img' className='home-page-images'/>
        })}
      </div>
    </a>
  );
}

