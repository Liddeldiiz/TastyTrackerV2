import { useState, useEffect } from 'react';

import { db, storage, auth } from '../config/Firebase';
import { collection, getDocs, query, where, onSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';


import '../static/css/App.css';
import LoadingSpinner from './LoadingSpinner';
import { Carousel } from 'react-bootstrap';


export const GetImages = ( props ) => {

  const [images, setImages] = useState();
  const [imageList, setImageList] = useState([]);
  const [imageListEmpty, setImageListEmpty] = useState(true);
  const [isToday, setToday] = useState(false);
  const [user, setUser] = useState({});
  const [loader, setLoader] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  

  if (user.uid === undefined) {  
    onAuthStateChanged(auth, (currentUser) => {  
      console.log("current user uid: ", user.uid);
      setUser(currentUser);
    });
  }

  useEffect(() => {
    
    console.log("checking if user is undefined");
    if(!checkNeededData) {
      console.log("user is undefined");
      setIsUserLoading(true);
      
    } else {
      setIsUserLoading(false);
      console.log("user is defined");
      console.log("setting loader status to true");
      setLoader(true);
    }

    if (loader) {
      if (props.formattedStartDate === undefined || props.formattedEndDate === undefined) { return <></> }
      else {
      try {
        console.log("fetching data from db");
        getStorageItems();
        console.log("setting loader status to false");
        setLoader(false);
      } catch(error) {
        console.log("try catch error: ", error.message);
      };
    }
    }

    
  }, [user, imageList]);


  const checkNeededData = () => {
      if (user.uid === undefined) { // userName === "" || email === "" || mealsPerDay === "" || userChoice === "" || 
        return false;
      } else {
        return true
      }
    }

  async function getStorageItems() {
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
                  });
                });
              });
          }
        });
    }  
  

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
      <Carousel>
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
        loader ? 
        
        <LoadingSpinner /> :
        
        imageList.map((url) => {
          return <Carousel.Item><img src={url} alt='img' className='home-page-images'/></Carousel.Item>
        })}
        
        </Carousel>
      </div>
      
    </a>
  );
}

