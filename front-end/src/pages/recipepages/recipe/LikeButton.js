import React from 'react'
import axios from 'axios'

import './LikeButton.css'

// Component for like button
const LikeButton = (props) => {
    const handleLiked = () => {
        const requestData = {
            like: props.recipe
                ? !props.user.liked.includes(props.recipe._id)
                : !props.comment.likers.includes(props.user._id),
            userID: props.user._id
        }
        if (props.recipe) {
            requestData.recipeID = props.recipe._id
        } else {
            requestData.commentID = props.comment._id
        }

        axios
            .post(
                `http://${process.env.REACT_APP_ORIGIN}/${
                    props.recipe ? 'likerecipe' : 'likecomment'
                }`,
                requestData
            )
            .then((response) => {
                if (response.data.recipe.user) {
                    props.setRecipe(response.data.recipe)
                    props.setUser(response.data.user)
                } else {
                    props.setComment(response.data)
                }
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className="likeButtonDiv">
            <input
                className={
                    props.recipe ? 'recipeLikeButton' : 'commentLikeButton'
                }
                type="image"
                src={
                    (
                        props.recipe
                            ? props.user.liked.includes(props.recipe._id)
                            : props.comment.likers.includes(props.user._id)
                    )
                        ? 'icons/heartFill.png'
                        : 'icons/heartOutline.png'
                }
                alt={
                    (
                        props.recipe
                            ? props.user.liked.includes(props.recipe._id)
                            : props.comment.likers.includes(props.user._id)
                    )
                        ? 'heart fill'
                        : 'heart outline'
                }
                onClick={() => {
                    if (props.signedIn) {
                        handleLiked()
                    } else {
                        // show sign-in modal if a not-signed in user attempts to like the recipe / comment
                        props.setShowModal(true)
                    }
                }}
            />
        </div>
    )
}

export default LikeButton
