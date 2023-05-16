import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const Logout = () => {
    const navigate = useNavigate();
    const notify = (text) => toast(text);
  
    const handleLogout = () => {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          notify("Signed out successfully");
          navigate("/login");
        })
        .catch((error) => {
          notify(error);
        });
    };
  
    return (
      <button onClick={handleLogout}>
        Logout
      </button>
    );
  };