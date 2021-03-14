import React from 'react'

import HamburgerNotSignedIn from './HamburgerNotSignedIn.js'
import './App.css';


function App() {
  return (
    <div className='App' id='outer-container'>
      {/*<HamburgerNotSignedIn pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } />*/}
      <main id='page-wrap'>
        <p>Page content starts here! There's padding within the navbar which is why this looks off.</p>
      </main>
    </div>
  );
}

export default App;