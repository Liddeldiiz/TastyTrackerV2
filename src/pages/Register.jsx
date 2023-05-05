import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '../config/Firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup } from 'firebase/auth';
import { toast } from "react-toastify";

export const Register = (props) => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setLoading] = useState(false);

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
                setLoading(false);

                navigate('/login');
            })
          } catch (err) {
            const errorMessage = err.message;
            notify(errorMessage);
            setLoading(false);
          }
          
    }

    return (
        <div className="auth-form-container">
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">name</label>
            <input 
            onChange={(e) => setName(e.target.value)} 
            placeholder="your name" 
            id="name" 
            name="name"/>

            <label htmlFor="email">email</label>
            <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="your email" 
            id="email" 
            name="email"/>

            <label htmlFor="password">password</label>
            <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="your password" 
            id="password" 
            name="password"/>

            <button type="submit"> Login </button>
        </form>
        <p>Already have an account?<NavLink to="/register">Login here.</NavLink></p>
        </div>
    )
}