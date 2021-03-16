import React, { useState } from "react"
import "./FollowButton.css"


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

export default FollowButton
