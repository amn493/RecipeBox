import React, { useState } from "react"
import "./FollowButton.css"

const FollowButton = (props) => {
  let state = "Follow"
<<<<<<< HEAD
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
    
=======
  if (props.profile in props.user.following) {
    state = "Unfollow"
  }
/* text is a state variable that changes the text
on the button depending on whether the active user 
is already following the profile they are viewing */
  let [text, setText] = useState(state)

/* click event handler changes text state 
    and css styles for the button */
  function follow(evt) {
    setText((prevText) => {
      if (prevText === "Follow") {
        evt.target.classList.add("follow-btn-following")
        evt.target.classList.remove("follow-btn-not-following")
        return "Unfollow"
      } else {
        evt.target.classList.add("follow-btn-not-following")
        evt.target.classList.remove("follow-btn-following")
        return "Follow"
      }
    })
>>>>>>> 3128d7e (add css for Follow/Unfollow button)
  }

/* component */
  return (
<<<<<<< HEAD
    <button id="followBtn" className={(text === 'Follow') ? 'followBtnNotFollowing' : 'followBtnFollowing'} onClick={follow}>
=======
    <button className="follow-btn" onClick={follow}>
>>>>>>> 3128d7e (add css for Follow/Unfollow button)
      {text}
    </button>
  );
};

export default FollowButton
