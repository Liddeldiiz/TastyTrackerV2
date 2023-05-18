import { auth, db } from '../config/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { AccordionHome } from '../components/AccordionHome';
import { GetImages } from '../components/GetImagesV2';

import settings_icon from '../static/images/settings_icon.svg';
import folder_icon from '../static/images/folder_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../App';


export const Home = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});
  // const [image, setImage] = useState("") should we pass pictures as string?
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);

  useEffect(() => {
    
    onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setNewUser(currentUser);
        console.log("onAuthStateChanged: new user set: ", currentUser);
      } else {
        console.log("no user detected, redirecting to login page");
        navigate('/login');
      }
    })
    console.log("home: user: ", newUser);

  }, [navigate, newUser])

  /////////////////////////// Date Formating ///////////////////////////

  const dateObject = new Date();
  const currentDay = dateObject.getDate();
  const currentMonth = dateObject.getMonth();
  const currentYear = dateObject.getFullYear();

  const dayBeforeDateObject = new Date();
  dayBeforeDateObject.setDate(dateObject.getDate() - 1);

  const twoDaysBeforeDateObject = new Date();
  twoDaysBeforeDateObject.setDate(dateObject.getDate() - 2);
 
  const formatDate = (dateObject) => {

    const day = dateObject.getDate();
    let dayStartString = "";
    let dayEndString = "";
    if (day < 10) { dayStartString = `0${day}`} else { dayStartString = `${day}`};
    if (day+1 < 10) { dayEndString = `0${day+1}`} else { dayEndString = `${day+1}`};

    const month = dateObject.getMonth() + 1;
    let monthString = "";
    if (month < 10) { monthString = `0${month}`} else { monthString = `${month}`};

    const year = dateObject.getFullYear();
    let yearString = "";
    if (year < 10) { yearString = `0${year}`} else { yearString = `${year}`};

    const formattedStartDate = `${yearString}-${monthString}-${dayStartString}`;
    const formattedStartDateDisplay = `${dayStartString}/${monthString}/${yearString}`;
    const formattedEndDate = `${yearString}-${monthString}-${dayEndString}`;
    const formattedEndDateDisplay = `${dayStartString}/${monthString}/${yearString}`;
    return [formattedStartDate, formattedEndDate, formattedStartDateDisplay, formattedEndDateDisplay];
  }
  
  const box1 = formatDate(dateObject);
  const box2 = formatDate(dayBeforeDateObject);
  const box3 = formatDate(twoDaysBeforeDateObject);
  /*  */

  return (
    <div>
      {isLoading ? 
      <LoadingSpinner /> :
       <>
      <div className='app-header'>
        <h3 className='welcome-user'>Hi, {user.email}</h3>
        <a href='./settings' className='settings-img'>
          <img src={settings_icon} />
        </a>
      </div>

      <div className='app-body'>
        <hr />
        <a href='./library'><img src={folder_icon} className='lib-img'/><h3 className='lib-desc'>Library</h3> </a>
        <hr />
          <div className='uploads'>
            <div className='images-flex-container'>
              <p>{box1[2]}</p>                
              <GetImages formattedStartDate={box1[0]} formattedEndDate={box1[1]}/>  
            </div>
          </div>

        <div className='uploads'>
          <hr />
          <div className='images-flex-container'>
          <p>{box2[2]}</p>
            <GetImages formattedStartDate={box2[0]} formattedEndDate={box2[1]}/>

          </div>
          <hr />
        </div>

        <div className='uploads'>
          <div className='images-flex-container'>
            <p>{box3[2]}</p>
            <GetImages formattedStartDate={box3[0]} formattedEndDate={box3[1]}/>

          </div>
          <hr />
        </div>
        
      </div>
      <div className='app-footer'>
        
        <p> This is the app footer. </p>
          <AccordionHome />
      
      </div>
      </>
    }
    </div>
    );

}

/*

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

*/


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