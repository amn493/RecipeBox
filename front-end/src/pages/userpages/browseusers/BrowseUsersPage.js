import { useEffect, useState } from 'react'
import axios from 'axios'

import './BrowseUsersPage.css'
import KeyWordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

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

    // array of recommended users
    const [recommendedUsers, setRecommendedUsers] = useState([])

    useEffect(() => {
        axios('http://localhost:4000/recommendedusers')
            .then((response) => setRecommendedUsers(response.data))
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }, [])

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
                        <p className="noUsersFoundMessage">
                            No users found
                            <hr />
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

            <div
                className={
                    users.length === 0 ? 'recommendedUsersSection' : 'hidden'
                }
            >
                <b className="recommendedUsersTitle">Recommended Users</b>
                <div className="userPreviews">
                    {recommendedUsers.map((user, i) => (
                        <SmallUserPreview
                            user={user}
                            isBlockedUserProfile={false}
                            key={i}
                        />
                    ))}
                </div>
            </div>
        </div>
    ) : (
        <ErrorComponent />
    )
}

export default BrowseUsersPage
