import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Comment from './Comment.js'
import Timestamp from './Timestamp'
import ErrorComponent from './ErrorComponent.js'

import './RecipePage.css'
import CreateAccountModal from './CreateAccountModal.js'


// Recipe Page
// Expects no props - must be accessed via a url with a slug (/recipes-:slug)
// Example: <RecipePage />

const RecipePage = (props) => {

    const [reqError, setReqError] = useState(false)

    // get slug from url params
    const { slug } = useParams();

    // state variables for knowing when all required data has been fetched from the apis
    const [loadedRecipe, setLoadedRecipe] = useState(false)
    const [loadedComments, setLoadedComments] = useState(false)


    // request current recipe (slug = slug) on initial render
    const [recipe, setRecipe] = useState([])

    useEffect(() => {
        // fetch the recipe that corresponds to the slug from the url
        axios(`http://localhost:4000/recipe?slug=${slug}`)
            .then((response) => {

                setRecipe(response.data)
                setLoadedRecipe(true)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)

                // make some backup fake data
                const backupData = [
                    {
                        user: {
                            id: 1,
                            username: 'foobar',
                            slug: 'foobar'
                        },
                        name: 'Guacamole',
                        imagePath: 'https://picsum.photos/300',
                        tags: ['mexican', 'spicy', 'dip'],
                        caption: "my secret recipe:)",
                        ingredients: [
                            '3 avocados',
                            '1 tomato',
                            '1/2 yellow onion',
                            '2 jalapeños',
                            '1/4 bunch cilantro',
                            '1 lime',
                            'salt',
                            'pepper'
                        ],
                        instructions: [
                            'Mash the avocados',
                            'Dice the tomato, onion, and jalapeños',
                            'Chop the cilantro',
                            'Put everything in a bowl',
                            'Squeeze in the lime',
                            'Add salt and pepper to taste',
                            'Mix'
                        ],
                        likes: 36,
                        createdAt: 1615864425952,
                        slug: 'foobar-guacamole',
                        id: 2
                    }
                ]

                setRecipe(backupData[0])
                setLoadedRecipe(true)
            })
    }, [slug])



    // request comments for current recipe (recipe = recipe.id) on initial render
    const [comments, setComments] = useState([])

    useEffect(() => {
        if (loadedRecipe) {
            axios(`http://localhost:4000/comments?recipeID=${recipe.id}`)
                .then((response) => {
                    setComments(response.data.sort((a, b) => a.createdAt - b.createdAt))
                    setLoadedComments(true)
                })
                .catch((err) => {
                    console.error(err)
                    setReqError(true)

                    // make some backup fake data
                    const backupData = [
                        {
                            recipe: 2, // a reference to a Recipe object
                            user: 5, // a reference to a User object
                            comment: 'Love this recipe!',
                            createdAt: 1615864460796
                        },
                        {
                            recipe: 2, // a reference to a Recipe object
                            user: 12, // a reference to a User object
                            comment: 'This recipe is amazing',
                            createdAt: 1615864472221
                        }
                    ]

                    setComments(backupData)
                    setLoadedComments(true)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedRecipe])


    // state variable for showing sign-in modal
    const [showModal, setShowModal] = useState(false)



    return (
        //!reqError ?

            loadedRecipe && loadedComments ?

                // render the page if all required data has been fetched
                <div className="recipe">
                    <img className="recipeImage" src={recipe.imagePath} alt="food" />
                    <div className="recipeText">
                        <div className="recipeDetails">
                            <table className="recipeDetailsTable recipeDetailsTopTable">
                                <tr>
                                    <td className="recipeDetailsTopTableCell">
                                        <h1 className="recipeName">{recipe.name}</h1>
                                    </td>
                                    <td className="recipeDetailsTableRightCol recipeDetailsTableLikedCol recipeDetailsTopTableCell">
                                        <LikeButton recipe={recipe} user={props.user} signedIn={props.signedIn} setShowModal={setShowModal} />
                                    </td>
                                </tr>
                            </table>
                            <table className="recipeDetailsTable">
                                <tr>
                                    <td>
                                        <a className="recipeUsername" href={'/user-' + recipe.user.slug}>{'@' + recipe.user.username}</a>
                                    </td>
                                    <td className="recipeDetailsTableRightCol">
                                        <Timestamp createdAt={recipe.createdAt} />
                                    </td>
                                </tr>
                            </table>

                            <p className="recipeCaption">{recipe.caption}</p>
                            {recipe.tags.map((tag, i) => (<a className="recipeTag  text-info" href={`/browse-recipes?tag=${tag}`} key={i}>{'#' + tag}</a>))}
                        </div>

                        <div className="recipeSubsection">
                            <h2 className="recipeSubheading">Ingredients</h2>
                            <ul className="ingredients">
                                {recipe.ingredients.map((ingredient, i) => (<li className="liIngredient" key={i}><div className="ingredient">{ingredient}</div></li>))}
                            </ul>
                        </div>
                        <br />
                        <div className="recipeSubsection">
                            <h2 className="recipeSubheading">Instructions</h2>
                            <ol className="instructions">
                                {recipe.instructions.map((instruction, i) => (<li className="liInstruction" key={i}><div className="instruction">{instruction}</div></li>))}
                            </ol>
                        </div>
                        <br />

                        <CommentsSection comments={comments} userId={props.user.id} recipeId={recipe.id} signedIn={props.signedIn} setShowModal={setShowModal} setReqError={setReqError} />

                    </div>

                    <CreateAccountModal show={showModal} setShow={setShowModal} />
                </div>
                :
                // not all data has been fetched yet
                <></>

            //:

            //<ErrorComponent />
    )
}


// Component for like button
// Expects recipe (a recipe object) and user (a user object for the signed-in user) as props
// Example: <LikeButton recipe={recipe} user={user} />

const LikeButton = (props) => {

    // state variables for number of likes recipe has and whether or not the signed-in user has liked the recipe
    const [likes, setLikes] = useState(props.recipe.likes)
    const [liked, setLiked] = useState(props.user.liked.includes(props.recipeId))

    /*
    useEffect(() => {
        //TODO: update database
      }, [likes])
    */


    return (
        <div className="likeButtonDiv">
            <input className="likeButton" type="image" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'} onClick={() => {
                if (props.signedIn) {
                    setLikes(likes + (liked ? -1 : 1))
                    setLiked(!liked)
                }
                else {
                    // show sign-in modal if a not-signed in user attempts to like the recipe
                    props.setShowModal(true)
                }
            }} />
            {likes}
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

                axios.post('http://localhost:4000/comment', newComment)
                .then(() => {
                    //update page to include new comment
                    setComments(comments.concat([newComment]))
                    setValue('')
                })
                
            }
        }
        else {
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
            {comments.map((comment, i) => (<Comment comment={comment} key={i} setReqError={props.setReqError} />))}

            <Form className="commentFieldAndButton" onSubmit={handleSubmit}>
                <InputGroup>
                    <FormControl size="sm" className="commentField" name="comment" value={value} onChange={handleChange} />
                    <InputGroup.Append>
                        <Button variant="info" size="sm" className="commentButton" type="submit" onSubmit={handleSubmit}>Comment</Button>
                    </InputGroup.Append>
                </InputGroup>
            </Form>
        </div>
    )
}



export default RecipePage