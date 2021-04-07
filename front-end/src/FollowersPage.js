import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import './FollowersPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'
import ErrorComponent from './ErrorComponent.js'

// Followers Page
// Expects a user object for props
// Example - <FollowersPage user={user} />
const FollowersPage = (props) => {
    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams()

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
                setReqError(true)

                // make some backup fake data
                const backupData = [
                    {
                        username: 'anonymous',
                        password: 'Abc123',
                        firstName: 'Anonymous',
                        lastName: 'User',
                        bio: 'fun, easy recipes!',
                        followers: [2, 3, 5, 7, 9],
                        following: [2, 3, 4, 8, 9],
                        liked: [1, 3, 5, 10, 33],
                        slug: 'anonymous',
                        imagePath: 'https://picsum.photos/200',
                        id: 1
                    }
                ]

                setUser(backupData[0])
                setLoadedUser(true)
            })
    }, [slug])

    // Request all followers on initial render
    const [allFollowers, setAllFollowers] = useState([])
    // Array of followers to be displayed
    const [followers, setFollowers] = useState([])
    const [loadedFollowers, setLoadedFollowers] = useState(false)

    useEffect(() => {
        // Fetch all followers (followers are an array of user objects)
        if (user.followers) {
            axios(
                `http://localhost:4000/usersbyid?id=${user.followers.reduce(
                    (acc, userFromFollowers) => `${acc}&id=${userFromFollowers}`
                )}`
            )
                .then((response) => {
                    setAllFollowers(
                        response.data.slice(0, user.followers.length)
                    )
                    setFollowers(response.data.slice(0, user.followers.length))
                    setLoadedFollowers(true)
                })
                .catch((err) => {
                    console.error(err)
                    setReqError(true)

                    // Backup fake data
                    const backupData = [
                        {
                            username: 'therealfoobar',
                            password: '12345',
                            email: 'foobar@foo.org',
                            firstName: 'Foo',
                            lastName: 'Bar',
                            bio: 'I love food',
                            followers: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                            following: [1, 2, 3, 4, 5],
                            liked: [1, 2, 3, 4, 5],
                            slug: 'therealfoobar',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [8],
                            blockedTags: [],
                            notificationSettings: {
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
                            followers: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8,
                                9,
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8
                            ],
                            following: [1, 2, 3, 4, 5],
                            liked: [1, 2, 3, 4, 5],
                            slug: 'foobar_travels',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [2],
                            blockedTags: [],
                            notificationSettings: {
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
                            followers: [1, 2, 3, 4, 5],
                            following: [1, 2, 3, 4, 5],
                            liked: [1, 2, 3, 4, 5],
                            slug: 'foobar_travels',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [],
                            blockedTags: [],
                            notificationSettings: {
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
                            firstName: 'Foo',
                            lastName: 'Bar',
                            bio: 'A house of chefs',
                            followers: [1, 2, 3, 4, 5, 5, 6, 7],
                            following: [1, 2, 3, 4, 5],
                            liked: [1, 2, 3, 4, 5],
                            slug: 'foobar_and_family',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [25],
                            blockedTags: [],
                            notificationSettings: {
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
                            followers: [1, 2, 3, 4, 5, 5, 6, 7],
                            following: [1, 2, 3, 4, 5],
                            liked: [1, 2, 3, 4, 5],
                            slug: 'pizza_lover',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [25],
                            blockedTags: [],
                            notificationSettings: {
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
                            followers: [1, 2, 3, 4, 5, 5, 6, 7, 8, 9],
                            following: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3],
                            liked: [1, 2, 3, 4],
                            slug: 'sweet_and_salty',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [13],
                            blockedTags: [],
                            notificationSettings: {
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
                            followers: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                5,
                                6,
                                7,
                                8,
                                9,
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                7,
                                8
                            ],
                            following: [1, 2, 3],
                            liked: [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3],
                            slug: 'home_chef',
                            imagePath: 'https://picsum.photos/250',
                            blockedUsers: [13],
                            blockedTags: [],
                            notificationSettings: {
                                emailNotifications: false,
                                likes: false,
                                comments: false,
                                follows: false,
                                posts: false
                            },
                            id: 6
                        }
                    ]

                    setAllFollowers(backupData.slice(0, user.followers.length))
                    setFollowers(backupData.slice(0, user.followers.length))
                    setLoadedFollowers(true)
                })
        }
    }, [user.followers])

    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter followers based on keyword entered by the user
    useEffect(() => {
        // Function to filter through all followers based on keyword search term entered
        function searchName(follower) {
            const match = filterKeyword.toLowerCase()
            const names = match.split(' ')
            // Compares every word in search term against username, firstName, and lastName
            for (let i = 0; i < names.length; i++) {
                if (
                    follower.username.toLowerCase().includes(names[i]) ||
                    follower.firstName.toLowerCase().includes(names[i]) ||
                    follower.lastName.toLowerCase().includes(names[i])
                ) {
                    return true
                }
            }
            return false
        }

        // Set users array to only include followers whose name contains the filter keyword
        setFollowers(allFollowers.filter(searchName))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update followers when a new keyword is entered

    return !reqError ? (
        loadedUser && loadedFollowers ? (
            <div className="followers">
                <div className="followersHeading">
                    <a className="backLink text-info" href={`/user-${slug}`}>
                        <i>
                            <ArrowLeftCircleFill />
                        </i>
                    </a>
                    <h3 className="userName">@{user.username}</h3>
                    <h4 className="title">{`${user.followers.length} ${
                        user.followers.length !== 1 ? 'Followers' : 'Follower'
                    }`}</h4>
                </div>
                <div className="userSearchBar">
                    <KeyWordSearchBar
                        isRecipe={false}
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <div className="followersList">
                    <div className="followerUserPreview">
                        {followers.length === 0 ? (
                            <p className="noFollowersFoundMessage">
                                No users found
                            </p>
                        ) : (
                            followers
                                .sort((a, b) =>
                                    a.firstName.localeCompare(b.firstName)
                                )
                                .map((follower, i) => (
                                    <SmallUserPreview
                                        user={follower}
                                        isBlockedUserProfile={false}
                                        key={i}
                                    />
                                ))
                        )}
                    </div>
                </div>
            </div>
        ) : (
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

export default FollowersPage
