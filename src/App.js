import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './views/Login';
import { Register } from "./views/Register";
import { Home } from './views/Home';
import { Settings } from './views/Settings';
import { Library } from './views/Library';
import { AddImage } from './views/AddImage';
import { NoPage } from './views/NoPage';

import { UserContext } from './components/UserContext';

import './static/css/App.css';

function App() {

  const [userUid, setUserUid] = useState();
  const pullUserCredentials = (data) => {
    setUserUid(data);
  }
    return (
      <div className='App'>
        <Router>
        <UserContext.Provider value={userUid}>
          <Routes>
            
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login func={pullUserCredentials}/>}/>
            <Route path="/register" element={<Register />}/>
            <Route path="/settings" element={<Settings />} />
            <Route path="/library" element={<Library />} />
            <Route path="/addImage" element={<AddImage />} />
            <Route path="*" element={<NoPage />} />
            
          </Routes>
          </UserContext.Provider>
        </Router>
      </div>
    );
};

export default App;


/*
<BrowserRouter>
        <nav>
          <Link to="/logout">Logout</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/logout" element={<Logout />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="*" element={<ErrorPage />}/>
        </Routes>
      </BrowserRouter>
*/


      /* 
      <Auth />
            <div>
              <input placeholder="File name..."/>
              <input placeholder="upload date..."/>
              
            </div>
      
            <div>
              {imageList.map((image) => (
              <div>
                  <h1> {image.name} </h1>
                  <p>Location: {image.location}</p>
                  <p>Date: {new Date(image.upload_date.seconds * 1000).toLocaleDateString("en-US")}</p>
                </div>
          ))}
            </div>
          </div><div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo"/>
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a 
      className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
      >
                Learn React
              </a>
              <h1>My App</h1>
            </header>
          </div></>
    */