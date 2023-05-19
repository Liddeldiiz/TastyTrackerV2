import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './views/Login';
import { Register } from "./views/Register";
import { Home } from './views/Home';
import { Settings } from './views/Settings';
import { Library } from './views/Library';
import { AddImage } from './views/AddImage';
import { ChangeUserName } from './views/ChangeUserName';
import { Camera } from './components/Camera';
import { NoPage } from './views/NoPage';


import './static/css/App.css';

export const UserContext = createContext();

function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [refreshKey, setRefreshKey] = useState(0); 

  const pullUserCredentials = (data) => {
    setUser(data);
    console.log("app.js: userUid(data): ", data);
  }
    return (
      <div className='App'>
        <UserContext.Provider value={{
          user, setUser,
          email, setEmail,
          refreshKey, setRefreshKey
          }}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />}/>
              <Route path="/" element={<Home />}/>
              <Route path="/register" element={<Register />}/>
              <Route path="/settings" element={<Settings />} />
              <Route path="/library" element={<Library />} />
              <Route path="/addImage" element={<AddImage />} />
              <Route path="/changeUserName" element={<ChangeUserName />} />
              <Route path="/camera" element={<Camera />}/>
              <Route path="*" element={<NoPage />} />
            </Routes>   
          </Router>
        </UserContext.Provider>
      </div>
    );
};

export default App;