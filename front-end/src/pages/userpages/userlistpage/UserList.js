import { useEffect, useState } from 'react'
import axios from 'axios'

import KeyWordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'

import './UserList.css'

// List of Users for Followers / Following / Likes Page / Modal
const UserList = (props) => {
    // Request all users on initial render
    const [allUsers, setAllUsers] = useState()
    // Array of users to be displayed
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (
            props.dataFromSlug &&
            props.pageType &&
            props.userBlocked !== undefined
        ) {
            let url
            if (props.pageType === 'likes') {
                url = `http://${process.env.REACT_APP_ORIGIN}/likedby?id=${props.dataFromSlug._id}`
            } else {
                url = `http://${
                    process.env.REACT_APP_ORIGIN
                }/usersbyid?id=${props.dataFromSlug[props.pageType].reduce(
                    (acc, userid) => acc + `&id=${userid}`,
                    ''
                )}`
            }

            if (
                (props.dataFromSlug.likes > 0 ||
                    props.dataFromSlug[props.pageType].length > 0) &&
                props.userBlocked === false &&
                url !== undefined
            ) {
                axios(url)
                    .then((response) => {
                        setAllUsers(response.data)
                        setUsers(response.data)
                    })
                    .catch((err) => {
                        console.error(err)
                        props.setReqError(true)
                    })
            } else {
                setAllUsers([])
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.pageType, props.dataFromSlug, props.userBlocked])

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

    const numText = props.pageType !== 'likers' ? props.pageType : 'likes'

    return allUsers ? (
        <div>
            <h4 className="numUsers">{`${
                props.userBlocked
                    ? 0
                    : props.pageType === 'likes'
                    ? props.dataFromSlug.likes
                    : props.dataFromSlug[props.pageType].length
            } ${
                numText[0].toUpperCase() +
                numText.slice(
                    1,
                    numText.length -
                        (numText !== 'following' && allUsers.length === 1
                            ? 1
                            : 0)
                )
            }`}</h4>

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
                        <p className="noUsersFoundMessage">No users found</p>
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
}

export default UserList
