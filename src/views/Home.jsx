import { auth, db } from '../config/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

import { AccordionHome } from '../components/AccordionHome';
import { GetImages } from '../components/GetImagesV2';

import settings_icon from '../static/images/settings_icon.svg';
import folder_icon from '../static/images/folder_icon.svg';
import LoadingSpinner from '../components/LoadingSpinner';
import { UserContext } from '../App';

import plus_icon from '../static/images/plus_icon.svg';
import 'react-toastify/dist/ReactToastify.css';

import '../static/css/Home.css';


export const Home = () => {
  const { refreshKey, setNextAlarm } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({});
  // const [image, setImage] = useState("") should we pass pictures as string?
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [imageUpload, setImagesUpload] = useState(null);
  const [documentReference, setDocumentReference] = useState();
  const [timeValues, setTimeValues] = useState();
  const [sortedTimeValues, setSortedTimeValues] = useState();
  const [notification, setNotification] = useState();
  const [currentTime, setCurrentTime] = useState();
  //const [nextAlarm, setNextAlarm] = useState();
  const [milisecToAlarm, setMiliSecToAlarm] = useState();
  const [isLogin, setIsLogin] = useState(true);
  

  const notify = () => {
    try {
        toast(location.state.msg);
    } catch (error) {
        console.log("Error: ", error);
    }
}

useEffect(() => {
  
  if (!isLogin) {
    notify();
    setIsLogin(true);
  }
}, [isLogin])

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

    if (newUser === {}) {
      navigate('/login');
    }

    if (newUser) {
      getDataFromDb();
      setIsLogin(false);

      
    }

    
    console.log("home: user: ", newUser);
    //console.log("refreshKey: ", refreshKey);

  }, [navigate, newUser])

  
  useEffect(() => {
    const myPushNotification = () => {
      alert(`Your next meal should be in: ${notification}`);
    };


    if (milisecToAlarm !== undefined || notification !== undefined) {
      const interval = setInterval(myPushNotification, milisecToAlarm);
      console.log("interval for push notification as been set: ", interval);
      return () => {
        clearInterval(interval);
      };
    }
    
  }, [milisecToAlarm])

  function onSelectedImage( event ) {
        
    setImagesUpload(event.target.files[0]);
    let tempImg =  event.target.files[0]
    console.log("event: ", event.target.files[0]);
    console.log("tempImg: ", tempImg);
    navigate("/addImage", {state:{image: tempImg}});
    
  }

  const queryResults = [];
  const getDataFromDb = async () => {
    try {

      console.log("inside getDataFromDB: user id: ", newUser.uid);
      const colRef = collection(db, 'users');
      const q = query(colRef, where('userId', '==', newUser.uid)); // this user.uid is undefined

      
      let queryResult;

      onSnapshot(q, (snapshot) => {
          snapshot.docs.forEach((doc) => {
              queryResults.push({ ...doc.data(), id: doc.id });
          })
          setDocumentReference(queryResults[0].id);
          setTimeValues(queryResults[0].timeValues);
          setNotification(queryResults[0].notifications);
      });

      sortTimeValuesAndSetAlarm();

  
      const currentDate = new Date();

      const currentHour = currentDate.getHours();
      const currentMinute = currentDate.getMinutes();
      setCurrentTime(`${currentHour}:${currentMinute}`);

      //console.log("queryResults: ", queryResults);
      //console.log(`current time: ${currentHour}:${currentMinute}`);
    } catch(error) {
      console.log("error: ", error);
    }
  }
  

  const sortTimeValuesAndSetAlarm = () => {
    console.log("timeValues:", timeValues);
    const tempSorted = timeValues.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a}`);
      const timeB = new Date(`2000-01-01T${b}`);
      return timeA - timeB;
    });

    setSortedTimeValues(tempSorted);

    // Sort the time values based on the time differences
    /*const nearestSortedTimeValues = timeValues.sort((a, b) => {
      return getTimeDifference(a) - getTimeDifference(b);
    });*/

    const currentDate = new Date();

    const nearestSortedTimeValues = timeValues
      .filter(timeValue => getTimeDifference(timeValue) >= 0) // Filter out time values in the past
      .sort((a, b) => getTimeDifference(a) - getTimeDifference(b));
  
    const nearestNextTimeValue = nearestSortedTimeValues[0];
    
    // The nearest time value is the first value in the sorted array
    const nearestTimeValue = nearestSortedTimeValues[0];
    
    console.log("nearest time value from arr: ", nearestNextTimeValue);
    setNextAlarm(nearestTimeValue);
    let interval = getTimeDifference(nearestTimeValue);
    setMiliSecToAlarm(interval);
    //console.log("the interval until next alarm is: ", interval)
  }

  const currentTimeForFunc = new Date(); // Get the current time

  function getTimeDifference(timeValue) {
    const [hours, minutes] = timeValue.split(":");
    const time = new Date();
    time.setHours(hours, minutes, 0, 0);
    return Math.abs(time - currentTimeForFunc);
  }

  function getTimeDifferenceForAlarm(timeValue) {
    const [hours, minutes] = timeValue.split(":");
    const currentTime = new Date(); // Get the current time
  
    // Create a new Date object for the specified time value
    const targetTime = new Date(currentTime);
    targetTime.setHours(hours, minutes, 0, 0);
  
    // If the target time is in the past, move it to the next day
    if (targetTime < currentTime) {
      targetTime.setDate(targetTime.getDate() + 1);
    }
  
    // Calculate the time difference in milliseconds
    return targetTime - currentTime;
  }

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
    <div className='app-page'>
      <ToastContainer />
      {isLoading ? 
      <LoadingSpinner /> :
       <>
      <div className='app-header'>
        <h3 className='welcome-user'>Hi, {newUser.email}</h3>
        <a href='./settings' className='settings-img'>
          <img src={settings_icon} />
        </a>
      </div>

      <div className='app-body'>
        <hr />

        <a href='./library' className='lib-div'><img src={folder_icon} className='lib-img'/><h3 className='lib-desc'>Library</h3> </a>

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
          <br />
          <hr />
        </div>

        <div className='uploads'>
          <div className='images-flex-container'>
            <p>{box3[2]}</p>
            <GetImages formattedStartDate={box3[0]} formattedEndDate={box3[1]}/>

          </div>
          <br />
          <hr />
        </div>
        
      </div>
      <div className='app-footer'>
        
        {/*<AccordionHome />*/}
        <div>
          
          <label className="select-image-input">
            <input id="getFile" type="file" onChange={(event) => {onSelectedImage(event)}} accept=".jpg, .jpeg, .png"/>
            <img src={plus_icon} alt='plus'/>
          </label>
        </div>
      
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