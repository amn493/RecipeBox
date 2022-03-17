import Button from 'react-bootstrap/Button'
import axios from 'axios'

import './FollowButton.css'

const FollowButton = (props) => {
    const follow = () => {
        if (props.signedIn) {
            if (props.isBlockedUser) {
                axios
                    .post(
                        `https://${process.env.REACT_APP_ORIGIN}/blockuser`,
                        {
                            addBlock: false,
                            signedInUserID: props.currentUser._id,
                            signedInBlockedUsers:
                                props.currentUser.blockedUsers,
                            signedInUserFollowing: props.currentUser.following,
                            signedInUserFollowers: props.currentUser.followers,
                            blockedUserID: props.profileUser._id,
                            blockedUserFollowing: props.profileUser.following,
                            blockedUserFollowers: props.profileUser.followers
                        }
                    )
                    .then((response) => {
                        // update signed-in user
                        props.setCurrentUser(response.data.currentUser)
                        props.setProfileUser(response.data.otherUser)
                        props.setUserBlocked(false)
                    })
            } else {
                // post request to update followers and following
                const followData = {
                    signedInUserID: props.currentUser._id,
                    profileUserID: props.profileUser._id,
                    follow: !props.currentUser.following.includes(
                        props.profileUser._id
                    )
                }
                axios
                    .post(
                        `https://${process.env.REACT_APP_ORIGIN}/followuser`,
                        followData
                    )
                    .then((response) => {
                        // update signed-in user and profile user
                        props.setCurrentUser(response.data.signedInUser)
                        props.setProfileUser(response.data.profileUser)
                    })
            }
        } else {
            // show sign-in modal if a not-signed in user attempts to follow a user
            props.setShowModal(true)
        }
    }

    return (
        <Button
            block
            size="sm"
            variant={
                !props.currentUser.following.includes(props.profileUser._id)
                    ? 'info'
                    : 'outline-info'
            }
            id="followBtn"
            onClick={follow}
        >
            {props.isBlockedUser
                ? 'Unblock'
                : `${
                      !props.currentUser.following.includes(
                          props.profileUser._id
                      )
                          ? props.currentUser.followers.includes(
                                props.profileUser._id
                            )
                              ? 'Follow Back'
                              : 'Follow'
                          : 'Unfollow'
                  }`}
        </Button>
    )
}

export default FollowButton
