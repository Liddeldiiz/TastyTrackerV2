import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
//import addNotification from 'react-push-notification';

import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from 'react-bootstrap';

import { db } from '../config/Firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';

import logo from '../static/images/logo.svg';
import 'react-toastify/dist/ReactToastify.css';

export const NotificationSettings = () => {

    const notify = (text) => {
        try {
            toast(text);
        } catch (error) {
            console.log("Error: ", error);
        }
    }
    const navigate = useNavigate();
    const location = useLocation(); // location for file
    
    const [username, setUsername] = useState();
    const [uid, setUid] = useState();
    const [email, setEmail] = useState();
    const [mealsPerDay, setMealsPerDay] = useState();
    const [notifications, setNotifications] = useState();
    const [documentReference, setDocumentReference] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const mealTimesRef = useRef({});

    useEffect(() => {
        if(!username || !uid || !email || !mealsPerDay || !notifications || !documentReference) {
            setIsLoading(true)
            
            setUsername(location.state?.data.username);
            setUid(location.state.data?.userId);
            setEmail(location.state.data?.email);
            setMealsPerDay(location.state?.data.mealsPerDay);
            setNotifications(location.state?.data.notifications);
            setDocumentReference(location.state?.data.documentReference);
            
            

        } else {
            setIsLoading(false);
            console.log("loading finished");
            console.log("loading content")
            console.log("username: ", username);
            console.log("uid: ", uid);
            console.log("email: ", email);
            console.log("mealsPerDay: ", mealsPerDay);
            console.log("notifications: ", notifications);
        }
    }, [isLoading])

    /*
    useEffect(() => {
        console.log("location.state.username: ", location.state.data.username)
        
    })*/

    const handleSubmit = (e) => {
        e.preventDefault();

        const timeValues = Object.keys(mealTimesRef.current).map(
            (key) => mealTimesRef.current[key].value
          );

        const finalData = {
            username: username,
            userId: uid,
            email: email,
            mealsPerDay: mealsPerDay,
            notifications: notifications,
            timeValues: timeValues
        }

        const docRef = doc(db, 'users', documentReference);
        //console.log("Time values: ", timeValues);
        setDoc(docRef, finalData)
            .then(docRef => {

                navigate('/', {state: {msg: 'Settings have been updated successfully'}});
            })
            .catch(error => {
                
                const errorMessage = `An error has occured while trying to upadet the settings, ${error}`;
                notify(errorMessage);
            });
        
        
    }

    const test = () => {
        const timeValues = Object.keys(mealTimesRef.current).map(
            (key) => mealTimesRef.current[key].value
          );
        console.log("Time values: ", timeValues);
    }

    const renderMealTimeSettings = () => {
        const mealTimeInputs = [];
        
        if (mealsPerDay === 0) {
            navigate('/settings', {state: {msg: '\"Meals per day\" cannot be 0'}});
        }
  
        for(let i = 0; i < mealsPerDay; i++) {
            
          
            mealTimeInputs.push(
              <div key={i}>
                <label htmlFor={`meal-time-${i}`}>
                  Choose time for meal {i + 1}:
                </label>
                <input 
                ref={(ref) => (mealTimesRef.current[i] = ref)}
                id={`meal-time-${i}`} 
                type="time" 
                name={`meal-time-${i}`} 
                className='time-settings'/>
              </div>
            );
        }  
        
        return mealTimeInputs;
      }

    return (
        <div>
            {isLoading ? 
            (<LoadingSpinner />) : 
            <div>
            <h3>Settings</h3>
            <p>Username: {username}</p>
            <p>Email: {email}</p>
            <p>Meals per day: {mealsPerDay}</p>
            <p>Notifications: {notifications}</p>

            <form onSubmit={handleSubmit}>
                {renderMealTimeSettings()}
                <Button type='submit' className="my-button"> Save </Button>
            </form>
            
            </div>
            }
            <ToastContainer />
        </div>
    )
}