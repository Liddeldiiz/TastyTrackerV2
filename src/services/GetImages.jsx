import { useState, useEffect } from 'react';

import { db, storage, auth } from '../config/Firebase';
import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

export const GetImages = ( props ) => {

  const [images, setImages] = useState();
  const [imageList, setImageList] = useState([]);
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  })

  useEffect(() => {
    // reference to the images collection
    
    const getStorageItems = async () => {

      //if (formattedStartDate == undefined || formattedEndDate == undefined)
      // collection reference
      const colRef = collection(db, 'images');
    
      // query
      let start = new Date(props.formattedStartDate);
      let end = new Date(props.formattedEndDate);
      let uid = user.uid;

      const queryConstraints = []

      queryConstraints.push(where('upload_date', '>=', start));
      queryConstraints.push(where('upload_date', '<=', end));
      queryConstraints.push(where('user_id', '==', uid));

      const q = query(colRef, ...queryConstraints); //.where('user_id', '==', showCurrentUser));
      

      const imagesFromDb = [];
      
      // real time collection data
      onSnapshot(q, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          imagesFromDb.push({ ...doc.data(), id: doc.id })
          console.log(imagesFromDb);
          setImages(imagesFromDb);
        })

        const split = imagesFromDb[0].image_reference_path.split('/');
        const img_usr_ref = split[1];
        const img_upload_date = split[2];
        
        const imageListRef = ref(storage, `images/${img_usr_ref}/${img_upload_date}/`);

        console.log(`downloading pictures for ${img_upload_date}`);
        listAll(imageListRef).then((response) => {
          response.items.forEach((item) => {
              getDownloadURL(item).then((url) => {
                  setImageList((prev) => [...prev, url]);
              });
          });
        });
        console.log(imageList);

      })
    
    }
    getStorageItems();
    
  }, []);

  return (
    <>
      <div>
        <h1>
          {imageList.map((image) => {
            return <img src={image} />
          })}
        </h1>
      </div>
    </>
  );
}
