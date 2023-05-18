import React, { useState, useContext } from 'react';
import { auth, googleProvider} from '../config/Firebase';
import { 
        signInWithEmailAndPassword,
        FacebookAuthProvider,
        signInWithPopup
    } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { UserContext } from '../App';

// spinner for loading...


export const Login = () => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    const { setUser, email, setEmail } = useContext(UserContext)
    const [isLoading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    //const [email, setEmail] = useState("");
    //const [newUser, setNewUser] = useState({});
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                let user = userCredential.user;
                setUser(userCredential.user);
                console.log(user.uid);
                setLoading(false);
                navigate("/");
            })
        } catch(err) {
            const errorMessage = err.message;
            notify(errorMessage);
            setLoading(false);
        }
    }

    const logInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider).then((userCredential) => {
              const user = userCredential.user;
              setUser(userCredential.user);
              setLoading(false);
  
              navigate('/');
            });
        } catch(err) {
            console.error(err);
        }
      };

    const signInWithFacebook = async ()=>{
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider)
        .then((userCredential)=> {
            setUser(userCredential.user);
            console.log(userCredential);
            navigate('/');
        })
        .catch((err)=>{
            console.log(err.message);
        })
    };


      const redirectLogin = async => {
        navigate("/login");
    }

    const redirectSignIn = async => {
        navigate("/register");
    }


    return (
        <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
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

            <button type="submit"> Login </button>
        </form>
        <button onClick={redirectSignIn}>Sign in</button>
        <button onClick={logInWithGoogle}>Log in with Google</button>
        <button onClick={signInWithFacebook}>Sign in with Facebook</button>
        </div>
    )
}