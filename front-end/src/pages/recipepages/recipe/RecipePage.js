import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Comment from './Comment.js'
import Timestamp from '../../../gencomponents/Timestamp.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'
import CreateAccountModal from '../../../gencomponents/CreateAccountModal.js'

import './RecipePage.css'

// Recipe Page
// Expects no props - must be accessed via a url with a slug (/recipes-:slug)
// Example: <RecipePage />

const RecipePage = (props) => {
    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams()

    // request current recipe (slug = slug) on initial render
    const [recipe, setRecipe] = useState()

    useEffect(() => {
        // fetch the recipe that corresponds to the slug from the url
        axios(`http://localhost:4000/recipe?slug=${slug}`)
            .then((response) => {
                setRecipe(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }, [slug])

    // request author user
    const [authorUser, setAuthorUser] = useState({})

    useEffect(() => {
        if (recipe) {
            if (props.user._id === recipe.user) {
                setAuthorUser({
                    id: props.user._id,
                    username: props.user.username,
                    slug: props.user.slug
                })
            } else {
                axios(`http://localhost:4000/userbyid?id=${recipe.user}`)
                    .then((response) => {
                        setAuthorUser({
                            id: response.data._id,
                            username: response.data.username,
                            slug: response.data.slug
                        })
                    })
                    .catch((err) => console.error(err))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe])

    // request comments for current recipe (recipe = recipe.id) on initial render
    const [comments, setComments] = useState()

    useEffect(() => {
        if (recipe) {
            axios(`http://localhost:4000/comments?recipeID=${recipe._id}`)
                .then((response) => {
                    setComments(
                        response.data.sort((a, b) => a.createdAt - b.createdAt)
                    )
                })
                .catch((err) => {
                    console.error(err)
                    setReqError(true)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe])

    // state variable for showing sign-in modal
    const [showModal, setShowModal] = useState(false)

    return !reqError ? (
        recipe && comments ? (
            // render the page if all required data has been fetched
            <div className="recipe">
                <img
                    className="recipeImage"
                    src={recipe.imagePath}
                    alt="food"
                />
                <div className="recipeText">
                    <div className="recipeDetails">
                        <table className="recipeDetailsTable recipeDetailsTopTable">
                            <tr>
                                <td className="recipeDetailsTopTableCell">
                                    <h1 className="recipeName">
                                        {recipe.name}
                                    </h1>
                                </td>
                                <td className="recipeDetailsTableRightCol recipeDetailsTableLikedCol recipeDetailsTopTableCell">
                                    <LikeButton
                                        recipe={recipe}
                                        setRecipe={setRecipe}
                                        user={props.user}
                                        setUser={props.setUser}
                                        signedIn={props.signedIn}
                                        setShowModal={setShowModal}
                                    />
                                </td>
                            </tr>
                        </table>
                        <table className="recipeDetailsTable">
                            <tr>
                                <td>
                                    <a
                                        className="recipeUsername"
                                        href={'/user-' + authorUser.slug}
                                    >
                                        {'@' + authorUser.username}
                                    </a>
                                </td>
                                <td className="recipeDetailsTableRightCol">
                                    <Timestamp createdAt={recipe.createdAt} />
                                </td>
                            </tr>
                        </table>

                        <p className="recipeCaption">{recipe.caption}</p>
                        {recipe.tags.map((tag, i) => (
                            <a
                                className="recipeTag  text-info"
                                href={`/browse-recipes?tag=${tag}`}
                                key={i}
                            >
                                {'#' + tag}
                            </a>
                        ))}
                    </div>

                    <div className="recipeSubsection">
                        <h2 className="recipeSubheading">Ingredients</h2>
                        <ul className="ingredients">
                            {recipe.ingredients.map((ingredient, i) => (
                                <li className="liIngredient" key={i}>
                                    <div className="ingredient">
                                        {ingredient}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <br />
                    <div className="recipeSubsection">
                        <h2 className="recipeSubheading">Instructions</h2>
                        <ol className="instructions">
                            {recipe.instructions.map((instruction, i) => (
                                <li className="liInstruction" key={i}>
                                    <div className="instruction">
                                        {instruction}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                    <br />

                    <CommentsSection
                        comments={comments}
                        userId={props.user._id}
                        recipeId={recipe._id}
                        signedIn={props.signedIn}
                        setShowModal={setShowModal}
                        setReqError={setReqError}
                    />
                </div>

                <CreateAccountModal show={showModal} setShow={setShowModal} />
            </div>
        ) : (
            // not all data has been fetched yet
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

// Component for like button
const LikeButton = (props) => {
    const handleLiked = () => {
        let requestData = {
            like: !props.user.liked.includes(props.recipe._id),
            userID: props.user._id,
            recipeID: props.recipe._id
        }

        axios
            .post('http://localhost:4000/likerecipe', requestData)
            .then((response) => {
                props.setRecipe(response.data.recipe)
                props.setUser(response.data.user)
            })
            .catch((err) => console.error(err))
    }

    return (
        <div className="likeButtonDiv">
            <input
                className="likeButton"
                type="image"
                src={
                    props.user.liked.includes(props.recipe._id)
                        ? 'icons/heartFill.png'
                        : 'icons/heartOutline.png'
                }
                alt={
                    props.user.liked.includes(props.recipe._id)
                        ? 'heart fill'
                        : 'heart outline'
                }
                onClick={() => {
                    if (props.signedIn) {
                        handleLiked()
                    } else {
                        // show sign-in modal if a not-signed in user attempts to like the recipe
                        props.setShowModal(true)
                    }
                }}
            />
            {props.recipe.likes}
        </div>
    )
}

// Component for comments section
// Expects comments (an array of comment objects), userId (the id of the signed in user), and recipeId (the id of the current recipe) as props
// Example: <CommentsSection comments={comments} userId={user.id} recipeId={recipe.id} />

const CommentsSection = (props) => {
    // state variables for comments array and text field value
    const [comments, setComments] = useState(props.comments)
    const [value, setValue] = useState('')

    // update page to include new comment on submit
    const handleSubmit = (event) => {
        event.preventDefault()

        if (props.signedIn) {
            // don't add empty comments
            if (value !== '') {
                const newComment = {
                    user: props.userId,
                    comment: value,
                    recipe: props.recipeId,
                    createdAt: Date.now()
                }

                axios
                    .post('http://localhost:4000/comment', newComment)
                    .then((response) => {
                        //update page to include new comment
                        setComments(comments.concat([response.data]))
                        setValue('')
                    })
            }
        } else {
            // show sign-in modal if a not-signed in user attempts to comment on the recipe
            props.setShowModal(true)
        }
    }

    // update text field as user types into it
    const handleChange = (event) => {
        setValue(event.target.value)
    }

    return (
        <div className="commentsSection">
            <h2 className="recipeSubheading">Comments</h2>
            {comments.map((comment, i) => (
                <Comment
                    comment={comment}
                    key={i}
                    setReqError={props.setReqError}
                />
            ))}

            <Form className="commentFieldAndButton" onSubmit={handleSubmit}>
                <InputGroup>
                    <FormControl
                        size="sm"
                        className="commentField"
                        name="comment"
                        value={value}
                        onChange={handleChange}
                    />
                    <InputGroup.Append>
                        <Button
                            variant="info"
                            size="sm"
                            className="commentButton"
                            type="submit"
                            onSubmit={handleSubmit}
                        >
                            Comment
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        </div>
    )
}

export default RecipePage
