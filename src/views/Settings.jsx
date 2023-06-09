import React, { useEffect, useContext, useState } from "react";
import Select from 'react-select';
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
/*
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";*/
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/Firebase';
import { db } from '../config/Firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';



// Components
import { Delete } from '../components/Delete';
import { Logout } from '../components/Logout';

// Images
import home_icon from '../static/images/home_icon.svg';
import settings_icon from '../static/images/settings_icon.svg';

import Button from 'react-bootstrap/Button';
import LoadingSpinner from "../components/LoadingSpinner";

import '../static/css/Settings.css';
import 'react-toastify/dist/ReactToastify.css';

import { UserContext } from '../App';
import { ToastBody } from "react-bootstrap";

export const Settings = () => {

  const { nextAlarm } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [userChoice, setUserChoice] = useState("");
  const [documentReference, setDocumentReference] = useState();
  
  var isMealsPerDay = false;

    var options = [
      { value: 5, label: '5 min'},
      { value: 10, label: '10 min'},
      { value: 15, label: '15 min'},
      { value: 30, label: '30 min'},
      { value: 60, label: '60 min'},
    ]
    

    const customStyles = {
      option: (defaultStyles, state) => ({
        ...defaultStyles,
        color: state.isSelected ? "#fff" : "#fff",
        backgroundColor: state.isSelected ? "#356d54" : "#191919",
        borderColor: "none"
      }),

      control: (defaultStyles) => ({
        ...defaultStyles,
        backgroundColor: "#356d54",
        padding: "10px",
        border: "none",
        boxShadow: "none"
      }),
      singleValue: (defaultStyles) => ({ ...defaultStyles, color: "fff" }),
    };

    const notify = () => {
      try {
          toast(location.state.msg);
      } catch (error) {
          console.log("Error: ", error);
      }
  }

    
    
    useEffect(() => {
      console.log("checking if user is loaded");
      onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setNewUser(currentUser);
          console.log("checking user data in db")
          getDataFromDb();
        }
        
        
      });
      
      /*
      if(!checkNeededData()) {
        setIsLoading(true);
        console.log("user is loaded");
      } else {
        setIsLoading(false);
        console.log("user is not loaded");
        
      }
      if (isLoading) {
        console.log("checking user data in db")
        getDataFromDb();
      }
      */
    }, [newUser])

    const checkNeededData = () => {
      if (!newUser) { // userName === "" || email === "" || mealsPerDay === "" || userChoice === "" || 
        return false;
      } else {
        return true
      }
    }
    
  

    const queryResults = [];
    const getDataFromDb = () => {
      try {

        console.log(newUser.uid);
        const colRef = collection(db, 'users');
        const q = query(colRef, where('userId', '==', newUser.uid)); // this user.uid is undefined

        
        let queryResult;

        onSnapshot(q, (snapshot) => {
            snapshot.docs.forEach((doc) => {
                queryResults.push({ ...doc.data(), id: doc.id });
            })
            setDocumentReference(queryResults[0].id);
        });

        console.log("queryResults: ", queryResults);
      } catch(error) {
        console.log("error: ", error);
      }
    }

    const handleSubmit = () => {
      if(tempUserName === "") {
        tempUserName = queryResults[0].username;
      }
      if(tempEmail === "") {
        console.log("taking existing email address");
        tempEmail = queryResults[0].email;
      }
      if(tempMeals === "") {
        tempMeals = queryResults[0].mealsPerDay;
      }
      if(tempChoice === "") {
        tempChoice = queryResults[0].notifications;
      }
      //const docRef = doc(db, 'users', documentReference);

      const data = {
        username: tempUserName,
        userId: newUser.uid,
        email: tempEmail,
        mealsPerDay: tempMeals,
        notifications: tempChoice,
        documentReference: documentReference
      };
      /*
      setDoc(docRef, data)
        .then(docRef => {
            console.log("document has been updated successfully");
        })
        .catch(error => {
            console.log(error);
        })*/
        navigate('/notificationSettings', {state: {data: data}});
        //navigate("/addImage", {state:{image: tempImg}});
    }

    

    const gatherInfo = () => {
      console.log("gathering data...");
      console.log("username: ", tempUserName);
      console.log("email: ", tempEmail);
      console.log("meals: ", tempMeals);
      console.log("choice: ", tempChoice);
    }

    var tempUserName =""
    const handleUserNameChange = (e) => {
      e.preventDefault();
      //setUserName(e.target.value);
      tempUserName = e.target.value;
    }

    var tempEmail = "";
    const handleEmailChange = (e) => {
      e.preventDefault();

      tempEmail = e.target.value;
    }
    
    var tempMeals;
    const handleMealsChange = (e) => {
      e.preventDefault();
      //setMealsPerDay(e.target.value);
      
      //console.log(tempMeals)
      tempMeals = e.target.value;
      
      }

    var tempChoice;
    const handleSelect = (e) => {
      //e.preventDefault();
      tempChoice = e.value;
    }


    return (

      <div className="settings-page">
        <div className="settings-header">
          { /*<img src={settings_icon} className='settings-img' /> */ }
          
          <h3 className='welcome-user'>Hi, {newUser.email}</h3>
          <a href='/' className='home-img'>
            <img src={home_icon}/>
          </a>
        </div>

        <div className='settings-body'>
            {isLoading ? <LoadingSpinner /> : (
              <div>
              <h3 className='settings-title'> Settings </h3>

              <div className='user-settings'>
                <form onSubmit={handleSubmit} className="settings-form">
                  <input 
                  onChange={handleUserNameChange}
                  type='text'
                  placeholder="Username..."
                  id='username'
                  name='username'/>

                  <input 
                  onChange={handleEmailChange}
                  type='email'
                  placeholder="Email address..."
                  id='email'
                  name='email'/>

                  <input 
                  onChange={handleMealsChange}
                  type='number'
                  placeholder="Meals per day..."
                  id='mealsPerDay'
                  name='mealsPerDay'/>

                  

                  <Select
                  styles={customStyles}
                  options={options} 
                  onChange={handleSelect}/>

                  <Button type="submit" className="my-button">Next</Button>
                  { /*
                  {!nextAlarm ? (<p> Please finish the setup process </p>) : <p> Next notification: {nextAlarm}</p>} 


                  <div className="notification-settings">
                    <p> notification settings</p>
                  </div>
            */}
                </form>

              </div>
              
              </div>
            )}

          </div>
          

        <div className='settings-footer'>

          <Logout />
          <ToastContainer />
          { /* <Delete /> */ }
        </div>
    </div>);
}