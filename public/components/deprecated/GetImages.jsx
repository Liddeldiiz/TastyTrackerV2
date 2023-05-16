import { useState, useEffect } from 'react';

import { db, storage, auth } from '../../config/Firebase';
import { collection, getDocs, query, where, onSnapshot, DocumentSnapshot } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

import '../static/css/App.css';

export const GetImages = ( props ) => {

  const [images, setImages] = useState();
  const [imageList, setImageList] = useState([]);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(false);

  let tempUid = "";
  async function getUser() {
    let uid = await user.id;
    return uid;
  }

  
  

  useEffect(() => {
    setLoader(true);
    console.log("loader: ", loader);
    async function getStorageItems() {

      let tempUid = "";
      onAuthStateChanged(auth, (currentUser) => {  
        tempUid = currentUser.uid;
        console.log("temp Uid: ", tempUid);
        setUser(currentUser);
        // collection reference
        const colRef = collection(db, 'images');
      
        // query
        let start = new Date(props.formattedStartDate);
        console.log("Start: ", start);
        let end = new Date(props.formattedEndDate);
        console.log("End: ", end);
        let uid;
        uid = tempUid;
        console.log("uid: ", tempUid);


        const queryConstraints = []

        queryConstraints.push(where('upload_date', '>=', start));
        queryConstraints.push(where('upload_date', '<=', end));
        queryConstraints.push(where('user_id', '==', uid));
        console.log("queryConstraints: ", queryConstraints);

        const q = query(colRef, ...queryConstraints); //.where('user_id', '==', showCurrentUser));
        
        console.log("query: ", q);

        const imagesFromDb = [];
        
        
        // real time collection data
        if (!loader) { console.log("loader: ", loader);return "";} else {
        onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            imagesFromDb.push({ ...doc.data(), id: doc.id })
            console.log(imagesFromDb);
            setImages(imagesFromDb);
          })

          const split = imagesFromDb[0].image_reference_path.split('/');
          console.log("split: ", split);
          const img_usr_ref = split[1];
          console.log("img_usr_ref: ", img_usr_ref);
          const img_upload_date = split[2];
          console.log("img_upload_date: ", img_upload_date);
          
          const imageListRef = ref(storage, `images/${img_usr_ref}/${img_upload_date}/`);
          console.log("imageListRef: ", imageListRef);

          console.log(`downloading pictures for ${img_upload_date}`);
          listAll(imageListRef).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                  console.log("url: ", url);
                    setImageList((prev) => [...prev, url]);
                    setLoader(false);
                });
            });
          });
          console.log(imageList);

        }, (error) => {
          console.log("error message from onSnapshot: ", error);
        })
      }    
      });
    
    }
        
    if (props.formattedStartDate === undefined || props.formattedEndDate === undefined) { return <></> }
    
    else {

      try {
        console.log('props.formattedStartDate is: ', props.formattedStartDate);
        console.log('props.formattedEndDate is: ', props.formattedEndDate);
        //console.log('props.userId is: ', props.userId);
        getStorageItems();
      } catch(error) {
        console.log("try catch error: ", error.message);
      };
    }
  }, []);

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

