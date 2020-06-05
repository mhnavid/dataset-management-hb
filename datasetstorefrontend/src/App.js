import React from 'react';
import Home from "./components/home/home";
import './App.css';
import Verification from "./components/verification/verification";

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <div>
        <Router>
            <Route exact path="/" component={Verification}/>
            <Route path="/home" component={Home}/>
            <Route component={handleNoMatch}/>
        </Router>
    </div>
  );
}

function handleNoMatch() {
    return <Redirect to="/"/>
}

export default App;
