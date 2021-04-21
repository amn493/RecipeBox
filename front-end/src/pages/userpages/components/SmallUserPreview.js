/* eslint-disable jsx-a11y/anchor-is-valid */
import Button from 'react-bootstrap/Button'

import './SmallUserPreview.css'

//This component is used in both the blocked users page and browse users page
//In both cases, it expects a user object. It also expects a boolean (isBlockedUserProfile)
//To include the component without 'unblock' buttons for each user, specify isBlockedUserProfile=false
//Otherwise, pass in isBlockedUserProfile=true
const SmallUserPreview = (props) => {
    return (
        <div className="userPreview">
            {/*preview links to the user profile*/}
            <a
                className="userPreviewProfileLink"
                href={
                    props.isBlockedUserProfile
                        ? undefined
                        : `/user-${props.user.slug}`
                }
            >
                {/*TODO(?): Disable link if component used for blocked users page?*/}
                <table className="userPreviewTable">
                    <tbody>
                        <tr>
                            {/* user profile picture preview */}
                            <td className="userPreviewImg">
                                <img
                                    src={'../' + props.user.imagePath}
                                    alt=""
                                    className="smallUserProfilePic"
                                />
                            </td>
                            <td>
                                <table className="userPreviewTopTable">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <b className="userPreviewFullName">{`${props.user.firstName} ${props.user.lastName}`}</b>
                                            </td>
                                            <td className="unBlock">
                                                {props.isBlockedUserProfile ? (
                                                    <Button
                                                        variant="info"
                                                        size="sm"
                                                        className="unBlockUserButton"
                                                        onClick={
                                                            props.handleClick
                                                        }
                                                    >
                                                        Unblock
                                                    </Button>
                                                ) : (
                                                    <></>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="userPreviewBottomTable">
                                    <tbody>
                                        <tr>
                                            <td className="userPreviewBottomCell">
                                                <b className="userPreviewUsername">{`@${props.user.username}`}</b>
                                            </td>
                                            <td className="userPreviewNumericalData userPreviewBottomCell">
                                                {`${
                                                    props.user.followers.length
                                                } ${
                                                    props.user.followers
                                                        .length !== 1
                                                        ? 'followers'
                                                        : 'follower'
                                                }`}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </a>
        </div>
    )
}

export default SmallUserPreview
