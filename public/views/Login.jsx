import React, { useState, createContext } from 'react';
import { auth, googleProvider} from '../config/Firebase';
import { 
        signInWithEmailAndPassword,
        FacebookAuthProvider,
        signInWithPopup
    } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

// spinner for loading...


export const Login = (props) => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const UserContext = createContext();
    const [user, setUser] = useState({});
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                let user = userCredential.user;
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
        .then((re)=> {
            console.log(re);
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

    const ColoredLine = (color) => { // Not working yet
        <hr
            style={{
                color: color,
                backgroundColor: color,
                height: 5
            }}
        />
    };

    return (
        <div className="auth-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
            <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="your email" 
            id="email" 
            name="email"/>

            <ColoredLine color="red"/>

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