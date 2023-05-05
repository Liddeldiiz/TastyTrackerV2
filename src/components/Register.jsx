import React, { useState } from 'react';

export const Register = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(email);
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
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}> Already have an account? Login here</button>
        </div>
    )
}