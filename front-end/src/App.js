import { React, useState, useEffect } from 'react'

import { Route, Switch, Redirect, useLocation } from 'react-router-dom'

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

// Import pages
import RecipePage from './RecipePage.js'
import FeedPage from './FeedPage.js'
import RecipeBoxPage from './RecipeBoxPage.js'
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
import axios from 'axios'

function App() {
    const [signedIn, setSignedIn] = useState(false)
    const [user, setUser] = useState()

    const [userSet, setUserSet] = useState(false)

    let location = useLocation()

    // authenticate user
    useEffect(() => {
        axios('http://localhost:4000/signedinuser', {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then((response) => {
                if (response.data.user) {
                    setSignedIn(true)
                    setUser(response.data.user)
                } else {
                    setSignedIn(false)
                    setUser({
                        slug: '',
                        followers: [],
                        following: [],
                        liked: [],
                        id: null,
                        blockedUsers: [],
                        blockedTags: []
                    })
                }
            })
            .catch((err) => {
                //console.error(err)
                setSignedIn(false)
                setUser({
                    slug: '',
                    followers: [],
                    following: [],
                    liked: [],
                    id: null,
                    blockedUsers: [],
                    blockedTags: []
                })
            })
    }, [location])

    // make sure signed-in user has been fetched from server
    useEffect(() => {
        if (user) {
            setUserSet(true)
        }
    }, [user])

    return userSet ? (
        <>
            <Navbar signedIn={signedIn} user={user} />
            <div className="App container" id="outer-container">
                <main id="page-wrap">
                    <Switch>
                        {/* HOME PAGE */}
                        <Route exact path="/">
                            {signedIn ? (
                                <Redirect to="/feed" />
                            ) : (
                                <Redirect to="/browse-recipes" />
                            )}
                        </Route>

                        {/* SIGN IN PAGE */}
                        <Route path="/sign-in">
                            {signedIn ? (
                                <Redirect to={'user-' + user.slug} />
                            ) : (
                                <SignInForm setSignedIn={setSignedIn} />
                            )}
                        </Route>

                        {/* CREATE ACCOUNT PAGE */}
                        <Route path="/create-account">
                            {signedIn ? (
                                <Redirect to={'user-' + user.slug} />
                            ) : (
                                <CreateAccountPage
                                    user={user}
                                    setSignedIn={setSignedIn}
                                />
                            )}
                        </Route>

                        {/* BROWSE RECIPES PAGE */}
                        <Route path="/browse-recipes">
                            <BrowseRecipesPage user={user} />
                        </Route>

                        {/* RECIPE PAGE */}
                        <Route path="/recipe-:slug">
                            <RecipePage
                                user={user}
                                signedIn={signedIn}
                                setUser={setUser}
                            />
                        </Route>

                        {/* BROWSE USERS PAGE */}
                        <Route path="/browse-users">
                            {/*({ user, signedIn } = getUser())*/}
                            <BrowseUsersPage />
                        </Route>

                        {/* USER PROFILE AND MY PROFILE PAGES */}
                        <Route exact path="/user-:slug">
                            <ProfilePage
                                user={user}
                                signedIn={signedIn}
                                setUser={setUser}
                            />
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
                            {signedIn ? (
                                <EditProfilePage
                                    user={user}
                                    signedIn={signedIn}
                                />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* FEED PAGE */}
                        <Route path="/feed">
                            {signedIn ? (
                                <FeedPage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* NEW RECIPE PAGE */}
                        <Route path="/new-recipe">
                            {signedIn ? (
                                <NewRecipePage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* MY RECIPE BOX PAGE */}
                        <Route path="/my-recipe-box">
                            {signedIn ? (
                                <RecipeBoxPage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* SETTINGS PAGE*/}
                        <Route path="/settings" exact={true}>
                            {signedIn ? (
                                <AppSettings user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>
                    </Switch>
                </main>
            </div>
        </>
    ) : (
        <></>
    )
}

export default App
