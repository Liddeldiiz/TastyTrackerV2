import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/Firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithPopup } from 'firebase/auth';
import { toast } from "react-toastify";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/Firebase';

export const Register = (props) => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [isLoading, setLoading] = useState(false);

    const addUserName = async () => {
      //e.preventDefault();
      console.log("userId from previous step:", auth?.currentUser.uid);
      try {
        const docRef = await addDoc(collection(db, "users"), {
          username: userName,
          userId: auth?.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            notify("Provide email!");
            return;
          }
      
          if (!password) {
            notify("Provide password!");
            return;
          }
          setLoading(true);

          try {
            await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                setUserId(auth?.currentUser.uid) // this writes null to the userId
                console.log("userId in createUserWithEmailAndPassword: ", auth?.currentUser.uid); // gets the user uid

                console.log("adding the username to the /users collection");
                addUserName(); //adding user name does not work yet

                setLoading(false);

                navigate('/login');
            })
          } catch (err) {
            const errorMessage = err.message;
            notify(errorMessage);
            setLoading(false);
          }
          
    }

    const signInWithGoogle = async () => {
      try {
          await signInWithPopup(auth, googleProvider).then((userCredential) => {
            const user = userCredential.user;
            setLoading(false);

            navigate('/login');
          });
      } catch(err) {
          console.error(err);
      }
    };

    const redirectLogin = async => {
      navigate("/login");
  }

    return (
        <div className="auth-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
            <input 
            onChange={(e) => setUserName(e.target.value)} 
            placeholder="your username" 
            id="name" 
            name="name"/>

            <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="your email" 
            id="email" 
            name="email"/>

            <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="your password" 
            id="password" 
            name="password"/>

            <button type="submit"> Sign in </button>
        </form>
        <button onClick={signInWithGoogle}> Sign in with Google </button>
        <button onClick={redirectLogin}>To Login page</button>
        </div>
    )
}