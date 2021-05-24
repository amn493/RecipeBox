import { useEffect, useState } from 'react'
import React from 'react'
import axios from 'axios'
import { Redirect, useParams } from 'react-router-dom'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Dropdown from 'react-bootstrap/Dropdown'
import { ThreeDots } from 'react-bootstrap-icons'
import Carousel from 'react-bootstrap/Carousel'
import Alert from 'react-bootstrap/Alert'

import Comment from './Comment.js'
import Timestamp from '../../../gencomponents/Timestamp.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'
import CreateAccountModal from '../../../gencomponents/CreateAccountModal.js'
import Number from '../../../gencomponents/Number.js'
import LikeButton from './LikeButton.js'

import './RecipePage.css'

// Recipe Page
// Expects no props - must be accessed via a url with a slug (/recipes-:slug)
// Example: <RecipePage />

const RecipePage = (props) => {
    const [reqError, setReqError] = useState(false)
    const [deletedRecipe, setDeletedRecipe] = useState(false)

    // get slug from url params
    const { slug } = useParams()

    // request current recipe (slug = slug) on initial render
    const [recipe, setRecipe] = useState()

    useEffect(() => {
        // fetch the recipe that corresponds to the slug from the url
        axios(`http://${process.env.REACT_APP_ORIGIN}:4000/recipe?slug=${slug}`)
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
    const [userBlocked, setUserBlocked] = useState(false)

    useEffect(() => {
        if (recipe) {
            if (props.user._id === recipe.user) {
                setAuthorUser({
                    id: props.user._id,
                    username: props.user.username,
                    slug: props.user.slug
                })
            } else {
                axios(
                    `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${recipe.user}`
                )
                    .then((response) => {
                        setAuthorUser({
                            id: response.data._id,
                            username: response.data.username,
                            slug: response.data.slug,
                            blockedUsers: response.data.blockedUsers
                        })
                        if (
                            props.user.blockedUsers.includes(
                                response.data._id
                            ) ||
                            response.data.blockedUsers.includes(props.user._id)
                        ) {
                            setUserBlocked(true)
                        }
                    })
                    .catch((err) => console.error(err))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe])

    // request comments for current recipe (recipe = recipe.id) on initial render
    const [comments, setComments] = useState()

    // sort threads and replies properly
    const sortComments = (comments) => {
        const threads = comments.filter((comment) => !comment.thread)
        const replies = comments.filter((comment) => comment.thread).reverse()

        replies.forEach((reply) => {
            for (let i = 0; i < threads.length; i++) {
                if (threads[i]._id === reply.thread) {
                    threads.splice(i + 1, 0, reply)
                    break
                }
            }
        })
        return threads
    }

    useEffect(() => {
        if (recipe) {
            axios(
                `http://${process.env.REACT_APP_ORIGIN}:4000/comments?recipeID=${recipe._id}`
            )
                .then((response) => {
                    setComments(sortComments(response.data))
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

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault()
                onClick(e)
            }}
        >
            {children}
        </a>
    ))

    // delete button clicked
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            // delete recipe
            axios
                .post(
                    `http://${process.env.REACT_APP_ORIGIN}:4000/deleterecipe`,
                    {
                        id: recipe._id
                    }
                )
                .then(() => {
                    //redirect to my profile
                    setDeletedRecipe(true)
                })
                .catch((err) => {
                    console.error(err)
                    setReqError(true)
                })
        }
    }

    // pin/unpin button clicked
    const handlePin = () => {
        axios
            .post(`http://${process.env.REACT_APP_ORIGIN}:4000/pinrecipe`, {
                id: recipe._id,
                pin: !recipe.pinned
            })
            .then((response) => {
                setRecipe(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
    }

    return !reqError && !userBlocked ? (
        recipe && comments ? (
            !deletedRecipe ? (
                // render the page if all required data has been fetched
                <div className="recipe">
                    {recipe.user === props.user._id ? (
                        <Dropdown className="dotsDropdown">
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-basic"
                            >
                                <i className="text-dark">
                                    <ThreeDots size={20} />
                                </i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                className="dotsDropdownMenu"
                                align="right"
                            >
                                <Dropdown.Item onClick={handlePin}>
                                    {recipe.pinned ? 'Unpin' : 'Pin'} Recipe
                                </Dropdown.Item>
                                <Dropdown.Item onClick={handleDelete}>
                                    Delete Recipe
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <></>
                    )}

                    {recipe.imagePath.length > 1 ? (
                        <Carousel interval={null}>
                            {recipe.imagePath.map((image) => (
                                <Carousel.Item>
                                    <img
                                        className="recipeImage"
                                        src={image}
                                        alt="food"
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <img
                            className="recipeImage"
                            src={recipe.imagePath[0]}
                            alt="food"
                        />
                    )}

                    <div className="recipeText">
                        <div className="recipeDetails">
                            <table className="recipeDetailsTable recipeDetailsTopTable">
                                <tbody>
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
                                </tbody>
                            </table>
                            <table className="recipeDetailsTable">
                                <tbody>
                                    <tr>
                                        <td>
                                            <a
                                                className="recipeUsername"
                                                href={
                                                    '/user-' + authorUser.slug
                                                }
                                            >
                                                {'@' + authorUser.username}
                                            </a>
                                        </td>
                                        <td className="recipeDetailsTableRightCol">
                                            <Timestamp
                                                createdAt={recipe.createdAt}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <a
                                                href={`/recipe-${slug}/likes`}
                                                className="numLikes"
                                            >
                                                <Number number={recipe.likes} />{' '}
                                                {recipe.likes === 1
                                                    ? `like`
                                                    : `likes`}
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
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
                            setComments={setComments}
                            sortComments={sortComments}
                            comments={comments}
                            user={props.user}
                            recipeId={recipe._id}
                            recipeUserId={recipe.user}
                            signedIn={props.signedIn}
                            setShowModal={setShowModal}
                            setReqError={setReqError}
                        />
                    </div>
                    <CreateAccountModal
                        show={showModal}
                        setShow={setShowModal}
                        user={props.user}
                        setSignedIn={props.setSignedIn}
                    />
                </div>
            ) : (
                <Redirect to={`/user-${props.user.slug}`} />
            )
        ) : (
            // not all data has been fetched yet
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

// Component for comments section
const CommentsSection = (props) => {
    // state variable for text field value
    const [value, setValue] = useState('')

    // state variables for replying to comments
    const [replyingTo, setReplyingTo] = useState()
    const [thread, setThread] = useState()

    // update page to include new comment on submit
    const handleSubmit = (event) => {
        event.preventDefault()

        if (props.signedIn) {
            // don't add empty comments
            if (value !== '') {
                const newComment = {
                    user: props.user._id,
                    comment: value,
                    recipe: props.recipeId,
                    createdAt: Date.now()
                }

                if (replyingTo) {
                    newComment.replyTo = replyingTo._id
                    newComment.thread = thread
                }

                axios
                    .post(
                        `http://${process.env.REACT_APP_ORIGIN}:4000/comment`,
                        newComment
                    )
                    .then((response) => {
                        //update page to include the new comment
                        const oldComments = props.comments
                        props.setComments([]) // change this ?
                        props.setComments(
                            props.sortComments(
                                oldComments.concat([response.data])
                            )
                        )
                        setValue('')
                        setReplyingTo()
                        setThread()
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
            {props.comments.map((comment, i) => (
                <Comment
                    setComments={props.setComments}
                    comments={props.comments}
                    recipeUser={props.recipeUserId}
                    comment={comment}
                    key={i}
                    setReqError={props.setReqError}
                    setShowModal={props.setShowModal}
                    user={props.user}
                    signedIn={props.signedIn}
                    setReplyingTo={setReplyingTo}
                    setThread={setThread}
                />
            ))}

            {replyingTo ? (
                <Alert
                    variant="info"
                    onClose={() => {
                        setReplyingTo()
                        setThread()
                    }}
                    dismissible
                    className="replyAlert"
                >
                    Replying to <b>@{replyingTo.username}</b>
                </Alert>
            ) : (
                <></>
            )}

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
