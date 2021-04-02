import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Tab from 'react-bootstrap/Tab'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import { Plus, ViewList, ViewStacked } from 'react-bootstrap-icons'

import ProfileHeader from './ProfileHeader.js'
import FollowButton from './FollowButton.js'
import SmallRecipePreview from './SmallRecipePreview.js'
import LargeRecipePreview from './LargeRecipePreview.js'
import CreateAccountModal from './CreateAccountModal.js'

import './ProfilePage.css'
import { ButtonGroup, InputGroup } from 'react-bootstrap'


const ProfilePage = (props) => {

    // get slug from url params
    const { slug } = useParams();


    // request user whose profile is being displayed on initial render
    const [profileUser, setProfileUser] = useState([])
    const [loadedUser, setLoadedUser] = useState(false)

    useEffect(() => {
        // fetch the user whose profile is being displayed (slug = slug)
        axios(`http://localhost:4000/userbyslug?slug=${slug}`)
        .then((response) => {
            setProfileUser(response.data)
            setLoadedUser(true)
        })
        .catch((err) => {
            console.error(err)

            // make some backup fake data
            const backupData = [
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
                    id: 1
                    }
            ]

            setProfileUser(backupData[0])
            setLoadedUser(true)
        })
    }, [slug])



    // request user's recipes on initial render (user.id = profileUser.id)
    const [recipes, setRecipes] = useState([])
    const [loadedRecipes, setLoadedRecipes] = useState(false)

    useEffect(() => {
        if (profileUser.username) {
            // fetch user's recipes
            axios(`http://localhost:4000/recipesbyuser?userID=${profileUser.id}`)
            .then((response) => {
                setRecipes(response.data.sort((a, b) => b.createdAt - a.createdAt))
                setLoadedRecipes(true)
            })
            .catch((err) => {
                console.error(err)

                // make some backup fake data
                const backupData = [
                    {
                        user: {
                            id: 1,
                            username: 'foobar',
                            slug: 'foobar'
                        },
                        name: 'Guacamole',
                        imagePath: 'https://picsum.photos/200',
                        tags: ['mexican', 'vegan'],
                        caption: "my secret recipe:)",
                        ingredients: [
                            '3 avocados', 
                            '1 tomato', 
                            '1/2 yellow onion', 
                            '2 jalapeños', 
                            '1/4 bunch cilantro', 
                            '1 lime', 
                            'salt', 
                            'pepper'
                        ],
                        instructions: [
                            'Mash the avocados', 
                            'Dice the tomato, onion, and jalapeños', 
                            'Chop the cilantro', 
                            'Put everything in a bowl', 
                            'Squeeze in the lime', 
                            'Add salt and pepper to taste', 
                            'Mix'
                        ],
                        likes: 36,
                        createdAt: 1615864425952,
                        slug: 'foobar-guacamole',
                        id: 1
                        },
                        {
                        user: {
                            id: 1,
                            username: 'foobar',
                            slug: 'foobar'
                        },
                        name: 'Tacos',
                        imagePath: 'https://picsum.photos/200',
                        tags: ['mexican', 'appetizer'],
                        caption: "my secret recipe:)",
                        ingredients: [
                            '3 avocados', 
                            '1 tomato', 
                            '1/2 yellow onion', 
                            '2 jalapeños', 
                            '1/4 bunch cilantro', 
                            '1 lime', 
                            'salt', 
                            'pepper'
                        ],
                        instructions: [
                            'Mash the avocados', 
                            'Dice the tomato, onion, and jalapeños', 
                            'Chop the cilantro', 
                            'Put everything in a bowl', 
                            'Squeeze in the lime', 
                            'Add salt and pepper to taste', 
                            'Mix'
                        ],
                        likes: 12,
                        createdAt: 1615864425952,
                        slug: 'foobar-tacos',
                        id: 2
                        },
                        {
                        user: {
                            id: 1,
                            username: 'foobar',
                            slug: 'foobar'
                        },
                        name: 'Tofu',
                        imagePath: 'https://picsum.photos/200',
                        tags: ['vegan'],
                        caption: "my secret recipe:)",
                        ingredients: [
                            '3 avocados', 
                            '1 tomato', 
                            '1/2 yellow onion', 
                            '2 jalapeños', 
                            '1/4 bunch cilantro', 
                            '1 lime', 
                            'salt', 
                            'pepper'
                        ],
                        instructions: [
                            'Mash the avocados', 
                            'Dice the tomato, onion, and jalapeños', 
                            'Chop the cilantro', 
                            'Put everything in a bowl', 
                            'Squeeze in the lime', 
                            'Add salt and pepper to taste', 
                            'Mix'
                        ],
                        likes: 30,
                        createdAt: 1615864425952,
                        slug: 'foobar-tofu',
                        id: 3
                        }
                ]

                setRecipes(backupData)
                setLoadedRecipes(true)
            })
        }
    }, [profileUser])

    // state variable for storing the active tab
    const [activeTab, setActiveTab] = useState('small')

    // state variable for showing sign-in modal
    const [showModal, setShowModal] = useState(false)

    return (

        loadedUser && loadedRecipes ?
            <div className="profilePage">
                <ProfileHeader user={profileUser} recipeCount={recipes.length} />

                {(slug === props.user.slug) ?
                    <ButtonGroup size="sm" className="profileButtons" >
                        <Button variant="outline-info" className="editProfileButton" href="/edit-profile">Edit Profile</Button>
                        <Button variant="info" className="newRecipeButton" href="./new-recipe"><i><Plus /></i></Button>
                    </ButtonGroup>
                :
                    <FollowButton profileUserId={profileUser.id} currentUser={props.user} signedIn={props.signedIn} setShowModal={setShowModal} />
                }
                
                <div className="tabContainer">
                    <Tab.Container defaultActiveKey="small">
                        <Nav variant="tabs" className="justify-content-center w-100 nav-fill">
                            <Nav.Item>
                                <Nav.Link activeClassName="" eventKey="small" onSelect={() => setActiveTab('small')}>{<i><ViewList className={(activeTab === 'small') ? 'activeTab' : 'inactiveTab'} /></i>}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="large" onSelect={() => setActiveTab('large')}>{<i><ViewStacked className={(activeTab === 'large') ? 'activeTab' : 'inactiveTab'} /></i>}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                
                        <Tab.Content>
                            <Tab.Pane eventKey="small">
                                <div className="recipesSection">
                                    {recipes.map((recipe, i) => <SmallRecipePreview recipe={recipe} user={props.user} key={i} />)}
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="large">
                                <div className="recipesSection">
                                    {recipes.map((recipe, i) => <LargeRecipePreview recipe={recipe} user={props.user} key={i} />)}
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </div>

                <CreateAccountModal show={showModal} setShow={setShowModal} />
            </div>
        :
            <></>
    )
}

export default ProfilePage