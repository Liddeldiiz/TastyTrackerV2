

import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { db, storage, auth } from '../config/Firebase';
import { collection, getDocs, query, where, onSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase/firestore';
import { getDownloadURL, listAll, ref } from 'firebase/storage';

import home_icon from '../static/images/home_icon.svg';
import folder_icon from '../static/images/folder_icon.svg';
import filter_icon from '../static/images/filter_icon.png';
import { useState, useEffect } from 'react';

// import '../static/css/Library.css';
import {Carousel, Row} from 'react-bootstrap';
import Gallery from 'react-grid-gallery';
import MasonryList, {ResponsiveMasonry} from 'react-responsive-masonry';
import Masonry from 'react-responsive-masonry';

import '../static/css/Library.css';

export const Library = () => {

    const [user, setUser] = useState({});
    const [images, setImages] = useState();
    const [imageList, setImageList] = useState([]);
    const [emptyImageList, setImageListEmpty] = useState(false);
    const [emptyMessage, setEmptyMessage] = useState();
    const [loader, setLoader] = useState(false);
    const [displayList, setDisplayList] = useState([]);

    const urlList = [];
    const tempList = [];

    var tempUser;
    

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {  
            //console.log("current user uid: ", user.uid);
            setUser(currentUser);
            tempUser = currentUser;
            //console.log("temp user: ", tempUser);
        });
    },[]);

    useEffect(() => {
      if (user.uid) {
          try {
              getStorageItems();
          } catch (error) {
              console.log("error: ", error);
          }
        }
      }, [user])

      async function getStorageItems() {
        setLoader(true);
        console.log("loader: ", loader);
        
          // collection reference
          const colRef = collection(db, 'images');
  
          // setiing up the constraints for the query
          
          // query
          const q = query(colRef, where('user_id', '==', user.uid));
  
          const imagesFromDb = [];
          // real time collection data
          const imageListRef = ref(storage, `images/${user.uid}`);
          console.log("imageListRef: ", imageListRef);
              listAll(imageListRef).then((response) => {
                //console.log("response: ", response);
                //console.log(response.prefixes[0]);
                response.prefixes.forEach((item) => {
                    console.log("item: ", item)
                    listAll(item).then((response) => {
                        console.log("response: ", response);
                        response.items.forEach((item) => {
                            getDownloadURL(item).then((url) => {
                                for(let i = 0; i < imageList.length; i++) {
                                  if (imageList[i] === url) { // this should prevent downloading the same images twice
                                    return;
                                  }
                                }

                                imageList.map((url) => {
                                  if (urlList.includes(url)) {
                                    return null;
                                  } else {
                                    urlList.push(url);
                                  }
                                })

                                

                                //setDisplayList(tempList)
                                console.log("url: ", url);
                                  setImageList((prev) => [...prev, url]);
                                  setLoader(false)
                            })
                        })
                    })
                })
              })
      }
                    
    return (
        <div>
          <div className='lib-header'>
            <div className='lib-header-title'>
              <img src={folder_icon} className='lib-img' />
              <h3 className='lib-desc'> Library </h3>
            </div>
            <a href='/' className='home-img'>
              <img src={home_icon} className='home-img'/>     
            </a>
          </div>
          <h3> Welcome in your meal library! </h3>
          <div className='app-body'>
            <div className='filter-options'>
              {/*
              <button> Day </button>
              <button> Week </button>
              <button> Month </button>
              <button> From: To: </button>
              <button> Breakfast </button>
              <button> Lunch </button>
              <button> Dinner </button>
              <button> Snack </button>
    */}
            </div>
            <div className='uploads'>

              
                    
                        {emptyImageList ? (
                          <>
                              <h3>
                                  No images added yet
                              </h3>
                          </>
                      ) :
                        <Masonry columnsCount={3} gutter='10px'>
                          {imageList.map((url, i) => (
                            <img 
                              key={i}
                              src={url}
                              loading='lazy'
                              style={{
                                width: "100%",
                                height: "auto",
                                display: "block",
                                marginBottom: "10px",
                              }}
                              alt=""
                            />
                          ))}
                        </Masonry>
                        
                      }
                      
                    
                </div>
              </div>
            

          
        
      </div>
    );
}

/*


<div className='images-container'>
                    <Carousel>
                        {emptyImageList ? (
                          <>
                              <h3>
                                  No images added yet
                              </h3>
                          </>
                      ) :
                      imageList.map((url) => {
                      return <Carousel.Item><img src={url} alt='img' className='home-page-images'/></Carousel.Item>
                      })}
                    </Carousel>
                </div>

onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach((doc) => {
              imagesFromDb.push({ ...doc.data(), id: doc.id });
            });
            setImages(imagesFromDb);
            console.log("imagesFromDb: ", imagesFromDb)
            if (imagesFromDb.length === 0) {
              console.log("imagesFromDb is: ", imagesFromDb.length)
              setImageListEmpty(true);
              setEmptyMessage("No images uploaded yet");
              
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

*/