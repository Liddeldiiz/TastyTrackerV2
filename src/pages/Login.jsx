import React, { useState } from 'react';
import { auth } from '../config/Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

// spinner for loading...


export const Login = (props) => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState({});
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                setLoading(false);
                navigate("/");
            })
        } catch(err) {
            const errorMessage = err.message;
            notify(errorMessage);
            setLoading(false);
        }
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
        <p>Don't have an account?<NavLink to="/register">Register here.</NavLink></p>
        </div>
    )
}