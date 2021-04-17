import Button from 'react-bootstrap/Button'
import axios from 'axios'

import './FollowButton.css'

const FollowButton = (props) => {
    const follow = () => {
        if (props.signedIn) {
            // post request to update followers and following
            const followData = {
                signedInUserID: props.currentUser._id,
                profileUserID: props.profileUserId,
                follow: !props.currentUser.following.includes(
                    props.profileUserId
                )
            }
            axios
                .post('http://localhost:4000/followuser', followData)
                .then((response) => {
                    // update signed-in user and profile user
                    props.setCurrentUser(response.data.signedInUser)
                    props.setProfileUser(response.data.profileUser)
                })
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
                !props.currentUser.following.includes(props.profileUserId)
                    ? 'info'
                    : 'outline-info'
            }
            id="followBtn"
            onClick={follow}
        >
            {!props.currentUser.following.includes(props.profileUserId)
                ? props.currentUser.followers.includes(props.profileUserId)
                    ? 'Follow Back'
                    : 'Follow'
                : 'Unfollow'}
        </Button>
    )
}

export default FollowButton
