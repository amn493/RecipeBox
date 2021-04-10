import { useEffect, useState } from 'react'
import axios from 'axios'

import './BrowseUsersPage.css'
import KeyWordSearchBar from './KeywordSearchBar.js'
import SmallUserPreview from './SmallUserPreview.js'
import ErrorComponent from './ErrorComponent'

// Browse Users Page
// Does not expect any argument for props
// Example - <BrowseRecipesPage />
const BrowseUsersPage = (props) => {
    const [reqError, setReqError] = useState(false)

    // For keyword search bar
    const [filterKeyword, setFilterKeyword] = useState('')

    // Array of users to be displayed
    const [users, setUsers] = useState([])

    useEffect(() => {
        // Fetch users that match the filter
        axios(`http://localhost:4000/usersbyname?name=${filterKeyword}`)
            .then((response) => {
                setUsers(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }, [filterKeyword])

    return !reqError ? (
        <div className="browseUsers">
            <div className="browseUserSearch">
                <div className="browseUsersSearchBar">
                    <KeyWordSearchBar
                        isRecipe={false}
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <div className="userPreviews">
                    {users.length === 0 && filterKeyword ? (
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
            <hr />
            <div className="recommendedUsers">
                <b className="recommendedUsersTitle">Recommended Users</b>
                <div className="userPreviews">
                    {/*recommendedUsers
                        .sort((a, b) => a.firstName.localeCompare(b.firstName))
                        .map((user, i) => (
                            <SmallUserPreview
                                user={user}
                                isBlockedUserProfile={false}
                                key={i}
                            />
                        ))*/}
                </div>
            </div>
        </div>
    ) : (
        <ErrorComponent />
    )
}

export default BrowseUsersPage
