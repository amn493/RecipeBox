import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { ArrowLeftCircleFill } from 'react-bootstrap-icons'

import ErrorComponent from '../../../gencomponents/ErrorComponent.js'
import UserList from './UserList.js'

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
                `https://${process.env.REACT_APP_ORIGIN}/recipe?slug=${slug}`
            ).then((recipeResponse) => {
                setDataFromSlug(recipeResponse.data)
                setLoadedData(true)
                // get author user
                axios(
                    `https://${process.env.REACT_APP_ORIGIN}/userbyid?id=${recipeResponse.data.user}`
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
                `https://${process.env.REACT_APP_ORIGIN}/userbyslug?slug=${slug}`
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

    return !reqError ? (
        loadedData && userBlocked !== undefined ? (
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
                </div>
                <UserList
                    userBlocked={userBlocked}
                    pageType={pageType}
                    dataFromSlug={dataFromSlug}
                    setReqError={setReqError}
                />
            </div>
        ) : (
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

export default UserListPage
