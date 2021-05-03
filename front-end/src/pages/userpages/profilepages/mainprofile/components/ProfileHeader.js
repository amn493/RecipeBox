import React from 'react'
import axios from 'axios'

import { PlusSquareFill } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import { ThreeDots } from 'react-bootstrap-icons'
import Number from '../../../../../gencomponents/Number.js'
import './ProfileHeader.css'

//Component for profile headers (my profile and other user profile)
//Expects user (a user object) and recipeCount (the number of recipes the user has posted) as props

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    // eslint-disable-next-line jsx-a11y/anchor-is-valid
    <a
        href=""
        ref={ref}
        onClick={(e) => {
            e.preventDefault()
            onClick(e)
        }}
    >
        {children}
    </a>
))

const ProfileHeader = (props) => {
    // block user button clicked
    const handleBlock = () => {
        axios
            .post(`http://${process.env.REACT_APP_ORIGIN}:4000/blockuser`, {
                addBlock: true,
                signedInUserID: props.currentUser._id,
                signedInBlockedUsers: props.currentUser.blockedUsers,
                signedInUserFollowing: props.currentUser.following,
                signedInUserFollowers: props.currentUser.followers,
                blockedUserID: props.profileUser._id,
                blockedUserFollowing: props.profileUser.following,
                blockedUserFollowers: props.profileUser.followers
            })
            .then((response) => {
                props.setCurrentUser(response.data.currentUser)
                props.setProfileUser(response.data.otherUser)
            })
    }

    return (
        <div className="profileHeader">
            <table className="profileTopTable">
                <tbody>
                    <tr>
                        <td className="profilePictureCell">
                            <img
                                className="profilePicture"
                                src={props.profileUser.imagePath}
                                alt="user profile"
                            />
                        </td>
                        <td className="userFullNameAndUserHandle">
                            <b className="userFirstAndLastName">
                                {props.profileUser.firstName +
                                    ' ' +
                                    props.profileUser.lastName}
                            </b>
                            <br />
                            {'@' + props.profileUser.username}
                        </td>
                        {props.isMyProfile ? (
                            <td className="plusButtonCell">
                                <a className="text-info" href="/new-recipe">
                                    <i>
                                        <PlusSquareFill size={31} />
                                    </i>
                                </a>
                            </td>
                        ) : !props.userBlocked ? (
                            <Dropdown className="dotsDropdown">
                                <Dropdown.Toggle
                                    as={CustomToggle}
                                    id="dropdown-basic"
                                >
                                    <i className="text-dark">
                                        <ThreeDots size={20} />
                                    </i>
                                </Dropdown.Toggle>

                                <Dropdown.Menu
                                    className="dotsDropdownMenu"
                                    align="right"
                                >
                                    <Dropdown.Item onClick={handleBlock}>
                                        Block User
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        ) : (
                            <></>
                        )}
                    </tr>
                </tbody>
            </table>

            <table className="profileStatsSection">
                <tbody>
                    <tr>
                        <td className="profileStat">
                            <b className="profileStatNumber">
                                <Number number={props.recipeCount} />
                            </b>
                            <br />
                            <small className="profileStatText">
                                {props.recipeCount !== 1 ? 'Recipes' : 'Recipe'}
                            </small>
                        </td>
                        <td className="profileStat">
                            <a
                                className={`profileStatLink ${
                                    props.userBlocked
                                        ? 'clickDisabled'
                                        : 'clickEnabled'
                                }`}
                                href={`/user-${props.profileUser.slug}/followers`}
                            >
                                <b className="profileStatNumber">
                                    <Number
                                        number={
                                            props.userBlocked
                                                ? 0
                                                : props.profileUser.followers
                                                      .length
                                        }
                                    />
                                </b>
                                <br />
                                <small className="profileStatText">
                                    {props.profileUser.followers.length !== 1
                                        ? 'Followers'
                                        : 'Follower'}
                                </small>
                            </a>
                        </td>
                        <td className="profileStat">
                            <a
                                className={`profileStatLink ${
                                    props.userBlocked
                                        ? 'clickDisabled'
                                        : 'clickEnabled'
                                }`}
                                href={`/user-${props.profileUser.slug}/following`}
                            >
                                <b className="profileStatNumber">
                                    <Number
                                        number={
                                            props.userBlocked
                                                ? 0
                                                : props.profileUser.following
                                                      .length
                                        }
                                    />
                                </b>
                                <br />
                                <small className="profileStatText">
                                    {'Following'}
                                </small>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="userBio">{props.profileUser.bio}</p>
        </div>
    )
}

export default ProfileHeader
