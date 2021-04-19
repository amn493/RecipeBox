import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { ViewList, ViewStacked } from 'react-bootstrap-icons'

import ProfileHeader from './ProfileHeader.js'
import FollowButton from './FollowButton.js'
import SmallRecipePreview from './SmallRecipePreview.js'
import LargeRecipePreview from './LargeRecipePreview.js'
import CreateAccountModal from './CreateAccountModal.js'
import ErrorComponent from './ErrorComponent.js'

import './ProfilePage.css'

const ProfilePage = (props) => {
    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams()

    // request user whose profile is being displayed on initial render
    const [profileUser, setProfileUser] = useState([])

    useEffect(() => {
        // fetch the user whose profile is being displayed (slug = slug)
        axios(`http://localhost:4000/userbyslug?slug=${slug}`)
            .then((response) => {
                setProfileUser(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }, [slug])

    // request user's recipes on initial render (user.id = profileUser.id
    const [recipes, setRecipes] = useState([])
    const [userBlocked, setUserBlocked] = useState(false)

    useEffect(() => {
        if (profileUser) {
            //if profileUser or user is blocked by the other don't fetch recipes
            if (
                props.user._id in profileUser.blockedUsers ||
                profileUser._id in props.user.blockedUsers
            ) {
                setUserBlocked(true)
            }
            if (!userBlocked) {
                // fetch user's recipes
                axios(
                    `http://localhost:4000/recipesbyuser?userID=${profileUser._id}`
                )
                    .then((response) => {
                        setRecipes(response.data)
                    })
                    .catch((err) => {
                        console.error(err)
                        setReqError(true)
                    })
            }
        }
    }, [profileUser, props.user.blockedUsers, props.user._id, userBlocked])

    // state variable for storing the active tab
    const [activeTab, setActiveTab] = useState('small')

    // state variable for showing sign-in modal
    const [showModal, setShowModal] = useState(false)

    return !reqError ? (
        profileUser && (recipes || userBlocked) ? (
            <div className="profilePage">
                <ProfileHeader
                    user={profileUser}
                    recipeCount={userBlocked ? 0 : recipes.length}
                    userBlocked={userBlocked}
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
                ) : // remove follow button if user is blocked
                !userBlocked ? (
                    <FollowButton
                        profileUserId={profileUser._id}
                        currentUser={props.user}
                        signedIn={props.signedIn}
                        setShowModal={setShowModal}
                    />
                ) : (
                    <></>
                )}

                <div className="tabContainer">
                    <Tab.Container defaultActiveKey="small">
                        <Nav
                            variant="tabs"
                            className="justify-content-center w-100 nav-fill"
                        >
                            <Nav.Item>
                                <Nav.Link
                                    activeClassName=""
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
                            {recipes.length === 0 || userBlocked ? (
                                <ErrorComponent error={'No Recipes'} />
                            ) : (
                                <>
                                    <Tab.Pane eventKey="small">
                                        <div className="recipesSection">
                                            {recipes.map((recipe, i) => (
                                                <SmallRecipePreview
                                                    recipe={recipe}
                                                    user={props.user}
                                                    key={i}
                                                    profileUser={profileUser}
                                                />
                                            ))}
                                        </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="large">
                                        <div className="recipesSection">
                                            {recipes.map((recipe, i) => (
                                                <LargeRecipePreview
                                                    recipe={recipe}
                                                    user={props.user}
                                                    key={i}
                                                    profileUser={profileUser}
                                                />
                                            ))}
                                        </div>
                                    </Tab.Pane>
                                </>
                            )}
                        </Tab.Content>
                    </Tab.Container>
                </div>

                <CreateAccountModal show={showModal} setShow={setShowModal} />
            </div>
        ) : (
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

export default ProfilePage
