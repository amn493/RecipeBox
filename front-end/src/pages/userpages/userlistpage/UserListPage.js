import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import KeyWordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

import './UserListPage.css'

// Followers / Following / Likes Page
const UserListPage = (props) => {
    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams()

    // Request user / recipe on initial render
    const [dataFromSlug, setDataFromSlug] = useState()

    const [loadedData, setLoadedData] = useState(false)

    const [userBlocked, setUserBlocked] = useState()
    const pageType = window.location
        .toString()
        .slice(window.location.toString().lastIndexOf('/') + 1)

    useEffect(() => {
        if (pageType === 'likes') {
            // fetch the recipe whose likes are being displayed
            axios(
                `http://${process.env.REACT_APP_ORIGIN}:4000/recipe?slug=${slug}`
            ).then((recipeResponse) => {
                setDataFromSlug(recipeResponse.data)
                setLoadedData(true)
                // get author user
                axios(
                    `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${recipeResponse.data.user}`
                ).then((userResponse) => {
                    setUserBlocked(
                        userResponse.data.blockedUsers.includes(
                            props.user._id
                        ) ||
                            props.user.blockedUsers.includes(
                                userResponse.data._id
                            )
                            ? true
                            : false
                    )
                })
            })
        } else {
            // fetch the user whose followers / following are being displayed
            axios(
                `http://${process.env.REACT_APP_ORIGIN}:4000/userbyslug?slug=${slug}`
            )
                .then((response) => {
                    setDataFromSlug(response.data)
                    setLoadedData(true)
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug])

    // Request all users on initial render
    const [allUsers, setAllUsers] = useState()
    // Array of users to be displayed
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (dataFromSlug && pageType && userBlocked !== undefined) {
            let url
            if (pageType === 'likes') {
                url = `http://${process.env.REACT_APP_ORIGIN}:4000/likedby?id=${dataFromSlug._id}`
            } else {
                url = `http://${
                    process.env.REACT_APP_ORIGIN
                }:4000/usersbyid?id=${dataFromSlug[pageType].reduce(
                    (acc, userid) => acc + `&id=${userid}`,
                    ''
                )}`
            }

            if (
                (dataFromSlug.likes > 0 || dataFromSlug[pageType].length > 0) &&
                userBlocked === false &&
                url !== undefined
            ) {
                axios(url)
                    .then((response) => {
                        setAllUsers(response.data)
                        setUsers(response.data)
                    })
                    .catch((err) => {
                        console.error(err)
                        setReqError(true)
                    })
            } else {
                setAllUsers([])
            }
        }
    }, [pageType, dataFromSlug, userBlocked])

    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')
    // Filter users based on keyword entered by the user
    useEffect(() => {
        if (allUsers) {
            // Function to filter through all users based on keyword search term entered
            function searchName(user) {
                const match = filterKeyword.toLowerCase()
                const names = match.split(' ')
                // Compares every word in search term against username, firstName, and lastName
                for (let i = 0; i < names.length; i++) {
                    if (
                        user.username.toLowerCase().includes(names[i]) ||
                        user.firstName.toLowerCase().includes(names[i]) ||
                        user.lastName.toLowerCase().includes(names[i])
                    ) {
                        return true
                    }
                }
                return false
            }

            // Set users array to only include users whose names contain the filter keyword
            setUsers(allUsers.filter(searchName))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword]) // Update users when a new keyword is entered

    return !reqError ? (
        loadedData && allUsers && userBlocked !== undefined ? (
            <div className="users">
                <div className="usersHeading">
                    <a
                        className="backLink text-info"
                        href={`/${
                            pageType === 'likes' ? 'recipe' : 'user'
                        }-${slug}`}
                    >
                        <i>
                            <ArrowLeftCircleFill />
                        </i>
                    </a>
                    <h3 className="name">
                        {pageType === 'likes'
                            ? dataFromSlug.name
                            : `@${dataFromSlug.username}`}
                    </h3>
                    {/* TODO */}
                    <h4 className="numUsers">{`${
                        userBlocked
                            ? 0
                            : pageType === 'likes'
                            ? dataFromSlug.likes
                            : dataFromSlug[pageType].length
                    } ${
                        pageType[0].toUpperCase() +
                        pageType.slice(
                            1,
                            pageType.length -
                                (pageType !== 'following' &&
                                allUsers.length === 1
                                    ? 1
                                    : 0)
                        )
                    }`}</h4>
                </div>
                <div className="userSearchBar">
                    <KeyWordSearchBar
                        isRecipe={false}
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <div className="usersList">
                    <div className="userUserPreview">
                        {users.length === 0 ? (
                            <p className="noUsersFoundMessage">
                                No users found
                            </p>
                        ) : (
                            users
                                .sort((a, b) =>
                                    a.firstName.localeCompare(b.firstName)
                                )
                                .map((user, i) => (
                                    <SmallUserPreview
                                        user={user}
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

export default UserListPage
