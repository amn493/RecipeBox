import React from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

//import HamburgerNotSignedIn from './HamburgerNotSignedIn.js'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import pages
import RecipePage from './RecipePage.js'
import FeedPage from './FeedPage.js'
import Navbar from './Navbar'
import BrowseRecipesPage from './BrowseRecipesPage.js'
import ProfilePage from './ProfilePage.js'
import SignInForm from './SignInForm'



function App() {

  let signedIn = true // change this when sign-in is implemented
  
  let user = {
    username: 'anonymous',
    password: 'Abc123',
    firstName: 'Anonymous',
    lastName: 'User',
    bio: 'fun, easy recipes!',
    followers: [2,3,5,7,9],
    following: [2,3,4,8,9],
    liked: [1,3,5,10,33],
    slug: 'anonymous',
    imagePath: 'https://picsum.photos/200',
    id: 1
  } // change this when sign-in is implemented



  return (
    <div className='App' id='outer-container' className = "container">
      {/*<HamburgerNotSignedIn pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } />*/}
      <Navbar />
      <main id='page-wrap'>
        <BrowserRouter>

          {/* TODO: uncomment and complete the corresponding route when you implement a page component */}

          <Switch>

            {/* HOME PAGE */}
            <Route exact path="/">
              {signedIn ? <Redirect to="/feed" /> : <Redirect to="/browse-recipes" />}
            </Route>
            
            {/* SIGN IN PAGE */}
            <Route path="/sign-in">
              {/* Note this is the component for sign-in (used in both the pop-up and page*/}
              <SignInForm />
            </Route>

            {/* CREATE ACCOUNT PAGE
            <Route path="/create-account">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* BROWSE RECIPES PAGE */}
            <Route path="/browse-recipes">
              <BrowseRecipesPage user={user} />
            </Route>

            {/* RECIPE PAGE */}
            <Route path="/recipe-:slug">
              <RecipePage user={user} signedIn={signedIn} />
            </Route>

            {/* BROWSE USERS PAGE
            <Route path="/browse-users">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* USER PROFILE AND MY PROFILE PAGES */}
            <Route path="/user-:slug">
              <ProfilePage user={user} signedIn={signedIn} />
            </Route>

            {/* FOLLOWERS PAGE
            <Route path="/user-:slug/followers">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* FOLLOWING PAGE
            <Route path="/user-:slug/following">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* EDIT PROFILE PAGE
            <Route path="/edit-profile">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* FEED PAGE */}
            <Route path="/feed">
              <FeedPage user={user}/>
            </Route>

            {/* NEW RECIPE PAGE
            <Route path="/new-recipe">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* MY RECIPE BOX PAGE
            <Route path="/my-recipe-box">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* SETTINGS PAGE
            <Route path="/settings">
              //insert corresponding page component tag here
            </Route>
            */}

            {/* BLOCKED USERS PAGE
            <Route path="/settings/blocked-users">
              //insert corresponding page component tag here
            </Route>
            */}

          </Switch>
        </BrowserRouter>
      </main>
    </div>
  )
}

export default App