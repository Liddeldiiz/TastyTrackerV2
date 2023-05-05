import { auth, googleProvider } from '../config/Firebase';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup, 
    signOut,
    onAuthStateChanged } from 'firebase/auth';
import { useState } from "react";
import { Navigate } from 'react-router-dom';

export const Auth = () => {

    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const [user, setUser] = useState({});

    onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });

    console.log(auth?.currenUser?.email);

    const login = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth, 
                loginEmail, 
                loginPassword);
        } catch(err) {
            console.log(err);
        }
    };

    const signIn = async () => {
        try {
            const user = await createUserWithEmailAndPassword(
                auth, 
                registerEmail, 
                registerPassword);
        } catch(err) {
            console.log(err);
        }
    };

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch(err) {
            console.error(err);
        }
    };

    const logout = async () => {
        try {
            console.log("logging out");
            await signOut(auth);
        } catch(err) {
            console.error(err);
        }
    };

    if (user.email != undefined) {
        return Navigate("../pages/Home");
    } else {

        return (
            <div>
                <div>
                    <h3> Login </h3>

                    <input 
                    placeholder="Email..." 
                    onChange={(e) => setLoginEmail(e.target.value)}/>
                    <input 
                    placeholder="Password..." 
                    type="password" 
                    onChange={(e) => setLoginPassword(e.target.value)}/>

                    <button onClick={login}> Login </button>
                </div>
                <div>
                    <h3> Sign in </h3>

                    <input 
                    placeholder="Email..." 
                    onChange={(e) => setRegisterEmail(e.target.value)}/>
                    <input 
                    placeholder="Password..." 
                    type="password" 
                    onChange={(e) => setRegisterPassword(e.target.value)}/>
                    <button onClick={signIn}> Sign in </button>

                    <button onClick={signInWithGoogle}> Sign in with Google </button>

                    <button onClick={logout}> Logout </button>

                    <h4> User Logged In: </h4>
                    {user?.email}
                </div>
            </div>
        );
    }
}