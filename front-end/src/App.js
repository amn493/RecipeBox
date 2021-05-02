import { React, useState, useEffect } from 'react'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

import RecipePage from './pages/recipepages/recipe/RecipePage.js'
import FeedPage from './pages/recipepages/feed/FeedPage.js'
import RecipeBoxPage from './pages/recipepages/recipebox/RecipeBoxPage.js'
import NavbarAndMenu from './gencomponents/navbar/NavbarAndMenu.js'
import BrowseRecipesPage from './pages/recipepages/browserecipes/BrowseRecipesPage.js'
import ProfilePage from './pages/userpages/profilepages/mainprofile/ProfilePage.js'
import NewRecipePage from './pages/recipepages/newrecipe/NewRecipePage.js'
import SignInForm from './pages/accountpages/signinform/SignInForm.js'
import AppSettings from './pages/accountpages/settingspage/AppSettings.js'
import CreateAccountPage from './pages/accountpages/createaccount/CreateAccountPage.js'
import BrowseUsersPage from './pages/userpages/browseusers/BrowseUsersPage.js'
import EditProfilePage from './pages/userpages/profilepages/editprofile/EditProfilePage.js'
import UserListPage from './pages/userpages/userlistpage/UserListPage.js'
import ErrorComponent from './gencomponents/ErrorComponent.js'

function App() {
    const [signedIn, setSignedIn] = useState(false)
    const [user, setUser] = useState()

    const [userSet, setUserSet] = useState(false)

    let location = useLocation()

    // authenticate user
    useEffect(() => {
        axios(`http://${process.env.REACT_APP_ORIGIN}:4000/signedinuser`, {
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
            <NavbarAndMenu signedIn={signedIn} user={user} />
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
                        <Route exact path="/sign-in">
                            {signedIn ? (
                                <Redirect to={'user-' + user.slug} />
                            ) : (
                                <SignInForm setSignedIn={setSignedIn} />
                            )}
                        </Route>

                        {/* CREATE ACCOUNT PAGE */}
                        <Route exact path="/create-account">
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
                        <Route exact path="/browse-recipes">
                            <BrowseRecipesPage user={user} />
                        </Route>

                        {/* RECIPE PAGE */}
                        <Route exact path="/recipe-:slug">
                            <RecipePage
                                user={user}
                                signedIn={signedIn}
                                setUser={setUser}
                            />
                        </Route>

                        {/* LIKES PAGE */}
                        <Route exact path="/recipe-:slug/likes">
                            <UserListPage user={user} />
                        </Route>

                        {/* BROWSE USERS PAGE */}
                        <Route exact path="/browse-users">
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
                            <UserListPage user={user} />
                        </Route>

                        {/* FOLLOWING PAGE */}
                        <Route exact path="/user-:slug/following">
                            <UserListPage user={user} />
                        </Route>

                        {/* EDIT PROFILE PAGE */}
                        <Route exact path="/edit-profile">
                            {signedIn ? (
                                <EditProfilePage
                                    user={user}
                                    signedIn={signedIn}
                                    setUser={setUser}
                                />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* FEED PAGE */}
                        <Route exact path="/feed">
                            {signedIn ? (
                                <FeedPage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* NEW RECIPE PAGE */}
                        <Route exact path="/new-recipe">
                            {signedIn ? (
                                <NewRecipePage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* MY RECIPE BOX PAGE */}
                        <Route exact path="/my-recipe-box">
                            {signedIn ? (
                                <RecipeBoxPage user={user} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* SETTINGS PAGE*/}
                        <Route exact path="/settings">
                            {signedIn ? (
                                <AppSettings user={user} setUser={setUser} />
                            ) : (
                                <Redirect to="/sign-in" />
                            )}
                        </Route>

                        {/* page doesn't exist */}
                        <Route path="*">
                            <ErrorComponent />
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
