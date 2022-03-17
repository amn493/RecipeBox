import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { ViewList, ViewStacked } from 'react-bootstrap-icons'
import { useMediaQuery } from 'react-responsive'

import ProfileHeader from './components/ProfileHeader.js'
import FollowButton from './components/FollowButton.js'
import SmallRecipePreview from '../../../recipepages/components/SmallRecipePreview.js'
import LargeRecipePreview from '../../../recipepages/components/LargeRecipePreview.js'
import CreateAccountModal from '../../../../gencomponents/CreateAccountModal.js'
import ErrorComponent from '../../../../gencomponents/ErrorComponent.js'

import './ProfilePage.css'

const ProfilePage = (props) => {
    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams()

    // request user whose profile is being displayed on initial render
    const [profileUser, setProfileUser] = useState()
    const [userBlocked, setUserBlocked] = useState(false)

    useEffect(() => {
        // fetch the user whose profile is being displayed (slug = slug)
        axios(
            `https://${process.env.REACT_APP_ORIGIN}/userbyslug?slug=${slug}`
        )
            .then((response) => {
                setProfileUser(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }, [slug])

    useEffect(() => {
        if (profileUser) {
            if (
                profileUser.blockedUsers.includes(props.user._id) ||
                props.user.blockedUsers.includes(profileUser._id)
            ) {
                setUserBlocked(true)
            }
        }
    }, [profileUser, props.user._id, props.user.blockedUsers])

    // request user's recipes on initial render (user.id = profileUser.id)
    const [recipes, setRecipes] = useState()
    useEffect(() => {
        if (profileUser) {
            if (userBlocked === false) {
                // fetch user's recipes
                axios(
                    `https://${process.env.REACT_APP_ORIGIN}/recipesbyuser?userID=${profileUser._id}`
                )
                    .then((response) => {
                        setRecipes(response.data)
                    })
                    .catch((err) => {
                        console.error(err)
                        setReqError(true)
                    })
            } else {
                setRecipes([])
            }
        }
    }, [profileUser, userBlocked])

    // state variable for storing the active tab
    const [activeTab, setActiveTab] = useState('small')

    // state variable for showing sign-in modal
    const [showModal, setShowModal] = useState(false)

    // max-width for mobile devices for responsive design
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' })

    return !reqError ? (
        profileUser && recipes && userBlocked !== undefined ? (
            <div className="profilePage">
                <ProfileHeader
                    currentUser={props.user}
                    profileUser={profileUser}
                    setProfileUser={setProfileUser}
                    setCurrentUser={props.setUser}
                    recipeCount={userBlocked ? 0 : recipes.length}
                    userBlocked={userBlocked}
                    isMyProfile={profileUser._id === props.user._id}
                />
                {slug === props.user.slug ? (
                    <Button
                        block
                        size="sm"
                        variant="outline-info"
                        className="editProfileButton"
                        href="/edit-profile"
                    >
                        Edit Profile
                    </Button>
                ) : !userBlocked ? (
                    // remove follow button if user is blocked

                    <FollowButton
                        isBlockedUser={false}
                        profileUser={profileUser}
                        setProfileUser={setProfileUser}
                        currentUser={props.user}
                        setCurrentUser={props.setUser}
                        setUserBlocked={setUserBlocked}
                        signedIn={props.signedIn}
                        setShowModal={setShowModal}
                    />
                ) : !profileUser.blockedUsers.includes(props.user._id) ? (
                    <FollowButton
                        isBlockedUser={true}
                        profileUser={profileUser}
                        setProfileUser={setProfileUser}
                        currentUser={props.user}
                        setCurrentUser={props.setUser}
                        setUserBlocked={setUserBlocked}
                        signedIn={props.signedIn}
                        setShowModal={setShowModal}
                    />
                ) : (
                    <></>
                )}
                {isMobile ? (
                    <div className="tabContainer">
                        <Tab.Container
                            defaultActiveKey="small"
                            transition={false}
                        >
                            <Nav
                                variant="tabs"
                                className="justify-content-center w-100 nav-fill"
                            >
                                <Nav.Item>
                                    <Nav.Link
                                        activeclassname=""
                                        eventKey="small"
                                        onSelect={() => setActiveTab('small')}
                                    >
                                        {
                                            <i>
                                                <ViewList
                                                    className={
                                                        activeTab === 'small'
                                                            ? 'activeTab'
                                                            : 'inactiveTab'
                                                    }
                                                />
                                            </i>
                                        }
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        eventKey="large"
                                        onSelect={() => setActiveTab('large')}
                                    >
                                        {
                                            <i>
                                                <ViewStacked
                                                    className={
                                                        activeTab === 'large'
                                                            ? 'activeTab'
                                                            : 'inactiveTab'
                                                    }
                                                />
                                            </i>
                                        }
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>

                            <Tab.Content>
                                <Tab.Pane eventKey="small">
                                    {recipes.length > 0 && !userBlocked ? (
                                        <div className="recipesSection">
                                            {recipes.map((recipe, i) => (
                                                <SmallRecipePreview
                                                    recipe={recipe}
                                                    user={props.user}
                                                    key={i}
                                                    profileUser={profileUser}
                                                    pinned={recipe.pinned}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="noRecipesMessage">
                                            No recipes yet
                                        </p>
                                    )}
                                </Tab.Pane>
                                <Tab.Pane eventKey="large">
                                    {recipes.length > 0 && !userBlocked ? (
                                        <div className="recipesSection">
                                            {recipes.map((recipe, i) => (
                                                <LargeRecipePreview
                                                    recipe={recipe}
                                                    user={props.user}
                                                    key={i}
                                                    profileUser={profileUser}
                                                    pinned={recipe.pinned}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="noRecipesMessage">
                                            No recipes yet
                                        </p>
                                    )}
                                </Tab.Pane>
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                ) : recipes.length > 0 && !userBlocked ? (
                    <div className="recipesSection">
                        {recipes.map((recipe, i) => (
                            <SmallRecipePreview
                                recipe={recipe}
                                user={props.user}
                                key={i}
                                profileUser={profileUser}
                                pinned={recipe.pinned}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="noRecipesMessage">No recipes yet</p>
                )}
                <CreateAccountModal
                    show={showModal}
                    setShow={setShowModal}
                    user={props.user}
                    setSignedIn={props.setSignedIn}
                />
            </div>
        ) : (
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

export default ProfilePage
