import { useEffect, useState } from 'react'
import axios from 'axios'

import './BrowseUsersPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'

// Browse Users Page
// Does not expect any argument for props
// Example - <BrowseRecipesPage />
const BrowseUsersPage = (props) => {

    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter users based on keyword entered by the user
    useEffect(() => {
        // Function to filter through all users based on keyword search term entered
        function searchName(user) {
            if (filterKeyword) {
                const match = filterKeyword.toLowerCase()
                const names = match.split(' ')
                // Compares every word in search term against username, firstName, and lastName
                for (let i = 0; i < names.length; i++) {
                    if (user.username.toLowerCase().includes(names[i]) ||
                        user.firstName.toLowerCase().includes(names[i]) || 
                        user.lastName.toLowerCase().includes(names[i])) {
                            return true;
                    }
                }
                return false;
            }
        }

        // Set users array to only include user whose name contains the filter keyword
        setUsers(allUsers.filter(searchName))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update users when a new keyword is entered

    // Request all users on initial render
    const [allUsers, setAllUsers] = useState([])
    // Array of users to be displayed
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch all users
        axios(`https://localhost:4000/usersbyname?name=${filterKeyword}`)
        .then((response) => {
            setAllUsers(response.data)
            setUsers([])
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
                            likes: false,
                            comments: false,
                            follows: false,
                            posts: false
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
                            emailNotifications: true,
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
                    followers: [1,2,3,4,5,5,6],
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

            setAllUsers(backupData)
            setUsers([])
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return(
        <div className='browseUsers'>
            <div className='browseUserSearch'>
                <div className="browseUsersSearchBar">
                    <KeyWordSearchBar isRecipe={false} filter={filterKeyword} setFilter={setFilterKeyword} />
                </div>
                <div className='userPreviews'>
                    {(users.length === 0 && filterKeyword) ? <p className="noUsersFoundMessage">No users found</p> : users.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((user, i) => 
                        (<SmallUserPreview user={user} isBlockedUserProfile={false} key={i}/>))}
                </div>
            </div>
            <hr />
            <div className='recommendedUsers'>
                <b className='recommendedUsersTitle'>
                    Recommended Users
                </b>
                <div className='userPreviews'>
                    {allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((user, i) => (<SmallUserPreview user={user} isBlockedUserProfile={false} key={i}/>))} 
                </div>
            </div>
        </div>
    )
}

export default BrowseUsersPage