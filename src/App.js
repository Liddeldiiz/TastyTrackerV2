import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from './pages/Login';
import { Register } from "./pages/Register";
import { Home } from './pages/Home';

// create nav bar component <Navbar />

import './App.css';

function App() {
    return (
      <div className='App'>
        
        <Router>
          <Routes>
            <Route path="/" element={<Home />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />}/>
          </Routes>
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