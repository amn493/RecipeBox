import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import './FollowersPage.css'
import KeyWordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

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
            if (user.followers.length > 0) {
                axios(
                    `http://localhost:4000/usersbyid?id=${user.followers.reduce(
                        (acc, userFromFollowers) =>
                            acc + `&id=${userFromFollowers}`,
                        ''
                    )}`
                )
                    .then((response) => {
                        setAllFollowers(
                            response.data.slice(0, user.followers.length)
                        )
                        setFollowers(
                            response.data.slice(0, user.followers.length)
                        )
                        setLoadedFollowers(true)
                    })
                    .catch((err) => {
                        console.error(err)
                        setReqError(true)
                    })
            } else {
                setLoadedFollowers(true)
            }
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
