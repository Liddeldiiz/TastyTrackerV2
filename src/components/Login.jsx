import React, { useState } from 'react';
import { auth } from '../config/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom';


export const Login = (props) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await signInWithEmailAndPassword(
                auth, 
                email, 
                password);
        } catch(err) {
            console.log(err);
        }
        //console.log(email);
    }

    return (
        <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
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
        <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
        </div>
    )
}