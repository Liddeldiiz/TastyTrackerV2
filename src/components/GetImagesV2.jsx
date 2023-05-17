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
  const [imageListEmpty, setImageListEmpty] = useState(true);
  const [isToday, setToday] = useState(false);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(false);
  

  

  useEffect(() => {
    // perhaps useContext could solve this issue of infinite onAuthStateChanged
    onAuthStateChanged(auth, (currentUser) => {  
      console.log("current user uid: ", user.uid);
      setUser(currentUser);
    });

    async function getStorageItems() {
      setLoader(true);
      console.log("loader: ", loader);
      
        // collection reference
        const colRef = collection(db, 'images');

        // setiing up the constraints for the query
        let queryConstraints = await setupConstraints();
        
        // query
        const q = query(colRef, ...queryConstraints);

        const imagesFromDb = [];
        // real time collection data
        onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            imagesFromDb.push({ ...doc.data(), id: doc.id });
          });
          setImages(imagesFromDb);
          console.log("imagesFromDb: ", imagesFromDb)
          if (imagesFromDb.length === 0) {
            console.log("imagesFromDb is: ", imagesFromDb.length)
            setImageListEmpty(true);
            let propsDate = new Date(props.formattedStartDate);
            let propsDateDay = propsDate.getDate();
            console.log("propsDateDay: ", propsDateDay);
            let dateObject = new Date();
            let dateObjectDay = dateObject.getDate();
            console.log("dateObjectDay: ", dateObjectDay);
            if (propsDateDay === dateObjectDay) {
              console.log(propsDateDay, "===", dateObjectDay)
              setToday(true);
              console.log("isToday: ", isToday);
            }
            
          } else {
            setImageListEmpty(false);
            const split = imagesFromDb[0].image_reference_path.split('/');
            const img_usr_ref = split[1];
            const img_upload_date = split[2];
            const imageListRef = ref(storage, `images/${img_usr_ref}/${img_upload_date}/`);
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
          }
        });
    }
    if (props.formattedStartDate === undefined || props.formattedEndDate === undefined) { return <></> }
    else {
      try {
        getStorageItems();
      } catch(error) {
        console.log("try catch error: ", error.message);
      };
    }
  }, [props.formattedStartDate, props.formattedEndDate, user, imageList]);


  
  

  const setupConstraints = async () => {    

    let start = new Date(props.formattedStartDate);
    let end = new Date(props.formattedEndDate);
    
    const queryConstraints = []

    queryConstraints.push(where('upload_date', '>=', start));
    queryConstraints.push(where('upload_date', '<=', end));
    queryConstraints.push(where('user_id', '==', user.uid));
    return queryConstraints;
  }  
  
  

  return (
    <a href='asdf'>
      <div className='images-container'>
        {imageListEmpty ? (
          isToday ? (
            <>
              <h3> 
                Add your first meal of the day 
              </h3>
            </>
            ) : (
            <>
              <h3> 
                No meals were added that day 
              </h3>
            </>
            )
        ) : 
        imageList.map((url) => {
          return <img src={url} alt='img' className='home-page-images'/>
        })}
      </div>
    </a>
  );
}

