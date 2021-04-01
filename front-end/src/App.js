import { React, useState } from 'react'

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import pages
import RecipePage from './RecipePage.js'
import FeedPage from './FeedPage.js'
// import RecipeBoxPage from './RecipeBoxPage.js'
import Navbar from './Navbar.js'
import BrowseRecipesPage from './BrowseRecipesPage.js'
import ProfilePage from './ProfilePage.js'
import NewRecipePage from './NewRecipePage.js'
import SignInForm from './SignInForm.js'
import AppSettings from './AppSettings.js'
import CreateAccountPage from './CreateAccountPage.js'
import FollowersPage from './FollowersPage.js'
import FollowingPage from './FollowingPage.js'
import BrowseUsersPage from './BrowseUsersPage.js'
import EditProfilePage from './EditProfilePage.js'


function App() {

  // comment out and uncomment the following to test with or without a signed-in user

  const [signedIn, setSignedIn] = useState(
    //false // no signed-in user
    true // signed-in user
    )
    const [user, setUser] = useState(
      /*{
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      bio: '',
      followers: [],
      following: [],
      liked: [],
      slug: '',
      imagePath: '',
      id: null,
      blockedUsers: [],
      blockedTags: [],
      notificationSettings: {
        "emailNotifications": false,
        "likes": false,
        "comments": false,
        "follows": false,
        "posts": false
      }
    }*/ // no signed-in user
    {
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
      id: 1,
      blockedUsers: [1,5,9],
      blockedTags: [
        "breakfast",
        "gluten",
        "sugar"
      ],
      notificationSettings: {
        "emailNotifications": true,
        "likes": true,
        "comments": false,
        "follows": false,
        "posts": true
      }
    }) // signed in user
  return (
    <>
    <Navbar signedIn={signedIn} user={user}/>
    <div className='App container' id='outer-container'>
      {/*<HamburgerNotSignedIn pageWrapId={ 'page-wrap' } outerContainerId={ 'outer-container' } />*/}
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
                {signedIn ? <Redirect to={'/user-' + user.slug} /> : <SignInForm />}
            </Route>

            {/* CREATE ACCOUNT PAGE */}
            <Route path="/create-account">
            {signedIn ? <Redirect to={'/user-' + user.slug} /> : <CreateAccountPage />}
            </Route>

            {/* BROWSE RECIPES PAGE */}
            <Route path="/browse-recipes">
              <BrowseRecipesPage user={user} />
            </Route>

            {/* RECIPE PAGE */}
            <Route path="/recipe-:slug">
              <RecipePage user={user} signedIn={signedIn} />
            </Route>

            {/* BROWSE USERS PAGE */}
            <Route path="/browse-users">
              <BrowseUsersPage />
            </Route>

            {/* USER PROFILE AND MY PROFILE PAGES */}
            <Route exact path="/user-:slug">
              <ProfilePage user={user} signedIn={signedIn} />
            </Route>

            {/* FOLLOWERS PAGE */}
            <Route exact path="/user-:slug/followers">
              <FollowersPage user={user} />
            </Route>

            {/* FOLLOWING PAGE */}
            <Route exact path="/user-:slug/following">
              <FollowingPage user={user} />
            </Route>

            {/* EDIT PROFILE PAGE */}
            <Route path="/edit-profile">
              {signedIn ? <EditProfilePage user={user} signedIn={signedIn} /> : <Redirect to="/sign-in" />}
            </Route>

            {/* FEED PAGE */}
            <Route path="/feed">
              {signedIn ? <FeedPage user={user} /> : <Redirect to="/sign-in" />}
            </Route>

            {/* NEW RECIPE PAGE */}
            <Route path="/new-recipe">
              {signedIn ? <NewRecipePage user={user} /> : <Redirect to="/sign-in" />}
            </Route>

            {/* MY RECIPE BOX PAGE 
            <Route path="/my-recipe-box">
              {signedIn ? <RecipeBoxPage user={user} /> : <Redirect to="/sign-in" />}
            </Route> */}

            {/* SETTINGS PAGE*/
            <Route path="/settings" exact={true}>
              {signedIn ? <AppSettings user={user} setSignedIn={setSignedIn}/> : <Redirect to="/sign-in" />}
            </Route>
            }           

          </Switch>
        </BrowserRouter>
      </main>
    </div>
    </>
  )
}

export default App