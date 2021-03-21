import { useEffect, useState } from 'react'
import axios from 'axios'

import './BrowseRecipesPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'

// Browse Users Page
// Does not expect any argument for props
// Example - <BrowseRecipesPage />
const BrowseUsersPage = (props) => {
    // To display a search prompt
    const [search, setSearch] = useState(true)

    // Request all users on initial render
    const [allUsers, setAllUsers] = useState([])
    // Array of users to be displayed
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch all users
        axios('https://my.api.mockaroo.com/user.json?key=f6a27260')
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
                }
            ]

            setAllUsers(backupData)
            setUsers([])
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter users based on keyword entered by the user
    useEffect(() => {
        // Set users array to only include user whose name contains the filter keyword
        setUsers(allUsers.filter(user => ((filterKeyword !== '') ? user.name.toLowerCase().includes(filterKeyword.toLowerCase()) : true)))
        // Removes search message to be displayed
        setSearch(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update users when a new keyword is entered


    return(
        <div className='browseUsers'>
            <div className='browseUserSearch'>
                <KeyWordSearchBar isRecipe={false} filter={filterKeyword} setFilter={setFilterKeyword} />
                <p className={search ? 'searchMessage' : 'hidden'}>
                    Enter Name or Username Above to Search for Users
                </p>
                <div className='userPreviews'>
                    {users.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((user, i) => (<SmallUserPreview user={user} isBlockedUserProfile={false} key={i}/>))}
                </div>
            </div>
            <div className='recommendedUsers'>
                <h3 className='recommendedUsersTitle'>
                    Recommended Users
                </h3>
                <div className='userPreviews'>
                    {allUsers.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((user, i) => (<SmallUserPreview user={user} isBlockedUserProfile={false} key={i}/>))} 
                </div>
            </div>
        </div>
    )
}

export default BrowseUsersPage