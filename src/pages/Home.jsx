import { auth, db } from '../config/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect } from "react";

import { AccordionHome } from '../components/AccordionHome';

export const Home = () => {
  const [user, setUser] = useState({});
  // const [image, setImage] = useState("") should we pass pictures as string?
  const [images, setImages] = useState([])

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  useEffect(() => {
    const fetchImages = async () => {

    try {
      await getDocs(collection(db, "images"))
        .then(((querySnapshot) => {
          const newData = querySnapshot.docs
            .map((doc) => ({...doc.data(), id:doc.id }));
          setImages(newData);
          console.log("fetched data from images collection");
          //console.log(images, newData);
      }));
      
    } catch (e) {
      let errorMessage = e.message;
      console.log(errorMessage);
    }
  } 
    
    fetchImages();
  }, []);

  return (
    <div>
      <div className='app-header'>
        <h3 className='welcome-user'>Hi, {user.email}</h3>
        <a href='./settings' className='settings-img'> Settings symbol </a>
      </div>

      <div className='app-body'>
        <p> This is the app body. </p>
        <a href='./library' className='lib-img'>Library img <p className='lib-desc'>Library</p> </a>

        <div className='uploads'>
          <h3 className='uploads-msg'> Add your first meal of the day </h3>
        </div>

        <div className='uploads'>
          <h3> Yesterday </h3>
          <div>
            <p>--------------</p>
             {
                images?.map((image,i) => {
                  
                  const uploadDate = image.upload_date.toDate();
                  //console.log(image.i); // func not showing the <p> element on hte page
                  return (
                    <div key={i}> 
                      <p>{image.name}</p>
                      <p>{uploadDate.toString()}</p>
                      <p> Location </p>
                      <p>Location: lat: {image.Location.latitude} long: {image.Location.longitude}</p>
                      <p>{image.id}</p>
                    </div>
                  );
                })
              }
            <p>--------------</p>
          </div>
        </div>

        <div className='uploads'>
          <h3> images </h3>
        </div>
        
      </div>
      <div className='app-footer'>
        
        <p> This is the app footer. </p>
          <AccordionHome />
      
      </div>
      
    </div>
    );

}


///////////////////////////////////////Not used///////////////////////////////////////
/*

<div className='collapsible'>
          
          <div className='header' {...getToggleProps({onClick: handleCollapsibleOnClick /* this is freezing the application })}>*/
          /*{isExpanded ? 'Collapse' : 'Expand'}
          </div>
          
          <div {...getCollapseProps()}>
            
            <div className='content'>
              Now you can see the hidden content <br></br>
            </div>
          
          </div>
        
        </div>

*/