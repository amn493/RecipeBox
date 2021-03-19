import React, { useState } from "react"
import "./FollowButton.css"

const FollowButton = (props) => {
  let state = "Follow"
  if (props.profileUserId in props.currentUser.following) {
    state = "Unfollow"
  }
/* text is a state variable that changesg the text
on the button depending on whether the active user 
is already following the profile they are viewing */
  let [text, setText] = useState(state)

/* click event handler changes text state 
    and css styles for the button */
  function follow(evt) {
    setText((prevText) => {
      if (prevText === "Follow") {
        return "Unfollow"
      } else {
        return "Follow"
      }
    })
  }

/* component */
  return (
    <button id="followBtn" className={(text === 'Follow') ? 'followBtnNotFollowing' : 'followBtnFollowing'} onClick={follow}>
      {text}
    </button>
  );
};

export default FollowButton
