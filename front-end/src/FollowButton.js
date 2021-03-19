import React, { useState } from "react"
import "./FollowButton.css"

const FollowButton = (props) => {
  let state = "Follow"
  if (props.profileUserId in props.currentUser.following) {
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
  }

/* component */
  return (
    <button className="follow-btn" onClick={follow}>
      {text}
    </button>
  );
};

export default FollowButton
