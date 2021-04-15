import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import axios from 'axios'
import './FollowButton.css'


const FollowButton = (props) => {
    let state = 'Follow'
    if (props.profileUserId in props.currentUser.following) {
        state = 'Following'
    }
    /* text is a state variable that changes the text
  on the button depending on whether the active user 
  is already following the profile they are viewing */
    let [text, setText] = useState(state)

    // click event handler changes text state
    function follow() {
        if (props.signedIn) {
            setText((prevText) => {
                if (prevText === 'Follow') {
                    return 'Following'
                } else {
                    return 'Follow'
                }
            })

            // TODO: update props.currentUser.following and props.profileUserId's user .following in the database

            const followData = {
                signedInUserId: props.currentUser._id,
                followedUserId: props.profileUserId,
                follow:
                    props.profileUserId in props.currentUser.following
                        ? false
                        : true
            }

            axios.post('http://localhost:4000/followuser', followData)
        } else {
            // show sign-in modal if a not-signed in user attempts to follow a user
            props.setShowModal(true)
        }
    }

    /* component */
    return (
        <Button
            block
            size="sm"
            variant={text === 'Follow' ? 'info' : 'outline-info'}
            id="followBtn"
            className={
                text === 'Follow'
                    ? 'followBtnNotFollowing'
                    : 'followBtnFollowing'
            }
            onClick={follow}
        >
            {text}
        </Button>
    )
}

export default FollowButton
