import React from 'react'

import HamburgerNotSignedIn from './HamburgerNotSignedIn.js'
import Navbar from './Navbar.js'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Feed from './Feed.js';


function App() {
  return (
    <>
    <HamburgerNotSignedIn pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } />
    <div className='App' id='outer-container'>
      <div className="container">
        <Navbar signedIn="true" />
        // Put your test content here!
      </div>
    </div>
    </>
  );
}

export default App;