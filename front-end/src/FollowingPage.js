import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import './FollowingPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'

// Following Page
// Expects a user object for props
// Example - <FollowingPage user={user} />
const FollowingPage = (props) => {
    // Get slug from url params
    const { slug } = useParams();

    // Request all followers on initial render
    const [user, setUser] = useState([])
    const [loadedUser, setLoadedUser] = useState(false)

    useEffect(() => {
        // fetch the user whose profile is being displayed (slug = slug)
        axios(`http://localhost:4000/userbyslug?slug=${slug}`)
        .then((response) => {
            setUser(response.data)
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

            setUser(backupData[0])
            setLoadedUser(true)
        })
    }, [slug])


    // Request all following on initial render
    const [allFollowing, setAllFollowing] = useState([])
    // Array of following to be displayed
    const [following, setFollowing] = useState([])
    const [loadedFollowing, setLoadedFollowing] = useState(false)

    useEffect(() => {
        // Fetch all following
        if (user.following) {
            axios('https://my.api.mockaroo.com/user.json?key=f6a27260')
            .then((response) => {
                setAllFollowing(response.data)
                setFollowing(response.data)
                setLoadedFollowing(true)
            })
            .catch((err) => {
                console.error(err)

                // Backup fake data
                const backupData = [
                    {
                        username: 'therealfoobar',
                        password: '12345',
                        email: 'foobar@foo.org',
                        firstName: 'Foo',
                        lastName: 'Bar',
                        bio: 'I love food',
                        followers: [1,2,3,4,5,6,7,8,9],
                        following: [1,2,3,4,5],
                        liked: [1,2,3,4,5],
                        slug: 'therealfoobar',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [8],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: false,
                                likes: true,
                                comments: true,
                                follows: false,
                                posts: true
                            },
                        id: 1
                    },
                    {
                        username: 'foobar_travels',
                        password: '12345',
                        email: 'foobar_travels@foo.org',
                        firstName: 'Foo',
                        lastName: 'Bar',
                        bio: 'I love food and love to travel',
                        followers: [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8],
                        following: [1,2,3,4,5],
                        liked: [1,2,3,4,5],
                        slug: 'foobar_travels',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [2],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: true,
                                likes: true,
                                comments: true,
                                follows: false,
                                posts: true
                            },
                        id: 2
                    },
                    {
                        username: 'foobar_desserts',
                        password: '12345',
                        email: 'foobar_desserts@foo.org',
                        firstName: 'Foo',
                        lastName: 'Bar',
                        bio: 'A page only for the sweet stuff',
                        followers: [1,2,3,4,5],
                        following: [1,2,3,4,5],
                        liked: [1,2,3,4,5],
                        slug: 'foobar_travels',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: false,
                                likes: true,
                                comments: true,
                                follows: false,
                                posts: true
                            },
                        id: 3
                    },
                    {
                        username: 'foobar_and_family',
                        password: '12345',
                        email: 'foobar_and_family@foo.org',
                        firstName: 'Bar',
                        lastName: 'Family',
                        bio: 'A house of chefs',
                        followers: [1,2,3,4,5,5,6,7],
                        following: [1,2,3,4,5],
                        liked: [1,2,3,4,5],
                        slug: 'foobar_and_family',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [25],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: true,
                                likes: false,
                                comments: false,
                                follows: false,
                                posts: true
                            },
                        id: 3
                    },
                    {
                        username: 'pizzalover2020',
                        password: '12345',
                        email: 'makepizza@foo.org',
                        firstName: 'Pizza',
                        lastName: 'Lover',
                        bio: 'How to make pizza from scratch!',
                        followers: [1,2,3,4,5,5,6,7],
                        following: [1,2,3,4,5],
                        liked: [1,2,3,4,5],
                        slug: 'pizza_lover',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [25],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: true,
                                likes: false,
                                comments: false,
                                follows: false,
                                posts: true
                            },
                        id: 4
                    },
                    {
                        username: 'sweetandsalty',
                        password: '12345',
                        email: 'icecream@foo.org',
                        firstName: 'Sweet',
                        lastName: 'Salty',
                        bio: 'Check out my homemade icecream!',
                        followers: [1,2,3,4,5,5,6,7,8,9],
                        following: [1,2,3,4,5,6,7,8,9,1,2,3],
                        liked: [1,2,3,4],
                        slug: 'sweet_and_salty',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [13],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: true,
                                likes: false,
                                comments: false,
                                follows: false,
                                posts: true
                            },
                        id: 5
                    },
                    {
                        username: 'homechef',
                        password: '12345',
                        email: 'cook_at_home@foo.org',
                        firstName: 'Home',
                        lastName: 'Chef',
                        bio: 'All homemade',
                        followers: [1,2,3,4,5,5,6,7,8,9,1,2,3,4,5,6,7,8],
                        following: [1,2,3],
                        liked: [1,2,3,4,5,6,7,8,9,1,2,3],
                        slug: 'home_chef',
                        imagePath: 'https://picsum.photos/250',
                        blockedUsers: [13],
                        blockedTags: [],
                        notificationSettings: 
                            {
                                emailNotifications: false,
                                likes: false,
                                comments: false,
                                follows: false,
                                posts: false
                            },
                        id: 6
                    }
                ]

                setAllFollowing(backupData)
                setFollowing(backupData)
                setLoadedFollowing(true)
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])


    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter following based on keyword entered by the user
    useEffect(() => {
        // Function to filter through all following users based on keyword search term entered
        function searchName(followingUser) {
            const match = filterKeyword.toLowerCase()
            const names = match.split(' ')
            // Compares every word in search term against username, firstName, and lastName
            for (let i = 0; i < names.length; i++) {
                if (followingUser.username.toLowerCase().includes(names[i]) ||
                    followingUser.firstName.toLowerCase().includes(names[i]) || 
                    followingUser.lastName.toLowerCase().includes(names[i])) {
                        return true;
                }
            }
            return false;
        }

        // Set following array to only include user whose name contains the filter keyword
        setFollowing(allFollowing.filter(searchName))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update following when a new keyword is entered


    return (
        loadedUser && loadedFollowing ?
            <div className='following'>
                <div className='followingHeading'>
                    <a className='backLinkFollowing text-info' href={`/user-${slug}`}><i><ArrowLeftCircleFill /></i></a>
                    <h3 className='userNameFollowing'>@{user.username}</h3>
                    <h4 className='title'>{user.following.length} Following</h4>
                </div>
                <div className='userSearchBarFollowing'>
                    <KeyWordSearchBar isRecipe={false} filter={filterKeyword} setFilter={setFilterKeyword} />
                </div>
                <div className='followingList'>
                    <div className='followingUserPreview'>
                        {following.length === 0 ? <p className="noFollowingFoundMessage">No users found</p> : following.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((followingUser, i) => 
                            (<SmallUserPreview user={followingUser} isBlockedUserProfile={false} key={i}/>))}
                    </div>
                </div>
            </div>
        : <></>
    )
}

export default FollowingPage