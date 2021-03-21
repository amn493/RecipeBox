import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import './FollowingPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'

// Following Page
// Expects a user object for props
// Example - <FollowingPage user={user} />
const FollowingPage = (props) => {
    // Get slug from url params
    const { slug } = useParams();

    // Request all following on initial render
    const [allFollowing, setAllFollowing] = useState([])
    // Array of following to be displayed
    const [following, setFollowing] = useState([])

    useEffect(() => {
        // Fetch all following
        axios('https://my.api.mockaroo.com/user.json?key=f6a27260')
        .then((response) => {
            setAllFollowing(response.data)
            setFollowing(response.data)
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

            setAllFollowing(backupData)
            setFollowing(backupData)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])


    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter following based on keyword entered by the user
    useEffect(() => {
        // Set following array to only include following whose name contains the filter keyword
        // setFollowing(allFollowing.filter(followingUser => ((filterKeyword !== '') ? followingUser.name.toLowerCase().includes(filterKeyword.toLowerCase()) : true)))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update following when a new keyword is entered


    return (
        <div className='following'>
            <div className='followingHeading'>
                <a className='backLink' href='javascript:history.back()'>Back</a>
                <p className='title'>Following</p>
                <h3 className='userName'>{props.user.firstName} {props.user.lastName}</h3>
            </div>
            <div className='userSearchBar'>
                <KeyWordSearchBar isRecipe={false} filter={filterKeyword} setFilter={setFilterKeyword} />
            </div>
            <div className='followingList'>
                <div className='followingUserPreview'>
                    {following.sort((a, b) => a.firstName.localeCompare(b.firstName)).map((followingUser, i) => (<SmallUserPreview user={followingUser} isBlockedUserProfile={false} key={i}/>))}
                </div>
            </div>
        </div>
    )
}

export default FollowingPage