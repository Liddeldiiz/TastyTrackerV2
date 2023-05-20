import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import addNotification from 'react-push-notification';

import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from 'react-bootstrap';

import { db } from '../config/Firebase';
import { collection, query, where, onSnapshot, doc, setDoc } from 'firebase/firestore';

import logo from '../static/images/logo.svg';

export const NotificationSettings = () => {
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
                addNotification({
                    title: 'TastyTracker',
                    message: 'Settings have been updated successfully',
                    duration: 4000,
                    icon: logo, // custom logo would be nice
                    native: true,
                })
            })
            .catch(error => {
                alert("An error has occured while trying to upadet the settings", error);
                addNotification({
                    title: 'TastyTracker',
                    message: `An error has occured while trying to upadet the settings, ${error}`,
                    duration: 4000,
                    icon: logo, // custom logo would be nice
                    native: true,
                })
            });
        navigate('/');
        
    }

    const test = () => {
        const timeValues = Object.keys(mealTimesRef.current).map(
            (key) => mealTimesRef.current[key].value
          );
        console.log("Time values: ", timeValues);
    }

    const renderMealTimeSettings = () => {
        const mealTimeInputs = [];
        
  
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
            <Button onClick={test}>Test</Button>
            </div>
            }
            
        </div>
    )
}