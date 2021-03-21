import React, { useState } from "react"
import "./FollowButton.css"

<<<<<<< HEAD
const FollowButton = (props) => {
  let state = "Follow"
  if (props.profileUserId in props.currentUser.following) {
    state = "Following"
  }
  /* text is a state variable that changes the text
  on the button depending on whether the active user 
  is already following the profile they are viewing */
  let [text, setText] = useState(state)

  // click event handler changes text state 
  function follow() {

    if (props.signedIn) {
      setText((prevText) => {
        if (prevText === "Follow") {
          return "Following"
        } else {
          return "Follow"
        }
      })
  
      // TODO: update props.currentUser.following and props.profileUserId's user .following in the database
    }
    else {
      // show sign-in modal if a not-signed in user attempts to follow a user
      props.setShowModal(true)
    }
    
  }

/* component */
  return (
    <button id="followBtn" className={(text === 'Follow') ? 'followBtnNotFollowing' : 'followBtnFollowing'} onClick={follow}>
      {text}
    </button>
  );
};
=======

const FollowButton = (props) => {

/* text is a state variable that changes the text
on the button depending on whether the active user 
is already following the profile they are viewing */  
    let state = "Follow"
    if (props.profile in props.user.following) {
        state = "Unfollow"
    }
    let [text, setText] = useState(state)

/* click event handler changes text state 
    and css styles for the button */
    function follow(evt) {
        setText((prevText) => {
            if (prevText === "Follow") {
                evt.target.classList.add("following")
                evt.target.classList.remove("not-following")
                return "Unfollow"
            } else {
                evt.target.classList.add("not-following")
                evt.target.classList.remove("following")
                return "Follow"
            }
        })
    }

/* component */
    return (
        <button className="FollowBtn" onClick={follow}>
            {text}
        </button>
    )

}
>>>>>>> 593d3e8 (add Follow Button)

export default FollowButton
