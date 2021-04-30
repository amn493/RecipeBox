import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import KeyWordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

import './FollowingPage.css'

// Following Page
// Expects a user object for props
// Example - <FollowingPage user={user} />
const FollowingPage = (props) => {
    const [reqError, setReqError] = useState(false)

    // Get slug from url params
    const { slug } = useParams()

    // Request all followers on initial render
    const [user, setUser] = useState([])
    const [loadedUser, setLoadedUser] = useState(false)

    const [userBlocked, setUserBlocked] = useState()

    useEffect(() => {
        // fetch the user whose profile is being displayed (slug = slug)
        axios(
            `http://${process.env.REACT_APP_ORIGIN}:4000/userbyslug?slug=${slug}`
        )
            .then((response) => {
                setUser(response.data)
                setLoadedUser(true)
                setUserBlocked(
                    response.data.blockedUsers.includes(props.user._id) ||
                        props.user.blockedUsers.includes(response.data._id)
                        ? true
                        : false
                )
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    // Request all following on initial render
    const [allFollowing, setAllFollowing] = useState([])
    // Array of following to be displayed
    const [following, setFollowing] = useState([])
    const [loadedFollowing, setLoadedFollowing] = useState(false)

    useEffect(() => {
        // Fetch all following
        if (user.following) {
            if (user.following.length > 0 && userBlocked === false) {
                axios(
                    `http://${
                        process.env.REACT_APP_ORIGIN
                    }:4000/usersbyid?id=${user.following.reduce(
                        (acc, userFromFollowing) =>
                            acc + `&id=${userFromFollowing}`,
                        ''
                    )}`
                )
                    .then((response) => {
                        setAllFollowing(
                            response.data.slice(0, user.following.length)
                        )
                        setFollowing(
                            response.data.slice(0, user.following.length)
                        )
                        setLoadedFollowing(true)
                    })
                    .catch((err) => {
                        console.error(err)
                        setReqError(true)
                    })
            } else {
                setLoadedFollowing(true)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.following])

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
                if (
                    followingUser.username.toLowerCase().includes(names[i]) ||
                    followingUser.firstName.toLowerCase().includes(names[i]) ||
                    followingUser.lastName.toLowerCase().includes(names[i])
                ) {
                    return true
                }
            }
            return false
        }

        // Set following array to only include user whose name contains the filter keyword
        setFollowing(allFollowing.filter(searchName))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update following when a new keyword is entered

    return !reqError ? (
        loadedUser && loadedFollowing ? (
            <div className="following">
                <div className="followingHeading">
                    <a
                        className="backLinkFollowing text-info"
                        href={`/user-${slug}`}
                    >
                        <i>
                            <ArrowLeftCircleFill />
                        </i>
                    </a>
                    <h3 className="userNameFollowing">@{user.username}</h3>
                    <h4 className="title">
                        {userBlocked ? 0 : user.following.length} Following
                    </h4>
                </div>
                <div className="userSearchBarFollowing">
                    <KeyWordSearchBar
                        isRecipe={false}
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <div className="followingList">
                    <div className="followingUserPreview">
                        {following.length === 0 || userBlocked ? (
                            <p className="noFollowingFoundMessage">
                                No users found
                            </p>
                        ) : (
                            following
                                .sort((a, b) =>
                                    a.firstName.localeCompare(b.firstName)
                                )
                                .map((followingUser, i) => (
                                    <SmallUserPreview
                                        user={followingUser}
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

export default FollowingPage
