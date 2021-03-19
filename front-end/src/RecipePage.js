import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

import Comment from './Comment.js'
import Timestamp from './Timestamp'

import './RecipePage.css'


// Recipe Page
// Expects no props - must be accessed via a url with a slug (/recipes-:slug)
// Example: <RecipePage />

const RecipePage = (props) => {

    // get slug from url params
    const { slug } = useParams();

    // state variables for knowing when all required data has been fetched from the apis
    const [loadedRecipe, setLoadedRecipe] = useState(false)
    const [loadedComments, setLoadedComments] = useState(false)


    // request current recipe (slug = slug) on initial render
    const [recipe, setRecipe] = useState([])

    useEffect(() => {
        // fetch the recipe that corresponds to the slug from the url
        axios('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
        .then((response) => {
            
            setRecipe(response.data[0]) //TODO: change when database is integrated
            setLoadedRecipe(true)
        })
        .catch((err) => {
            console.error(err)

            // make some backup fake data
            const backupData = [
                {
                    user: {
                      id: 1,
                      username: 'foobar',
                      slug: 'foobar'
                    },
                    name: 'Guacamole',
                    imagePath: 'logo192.png',
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
        axios('https://my.api.mockaroo.com/comment.json?key=f6a27260')
        .then((response) => {
            setComments(response.data) //TODO: change when database is integrated
            setLoadedComments(true)
        })
        .catch((err) => {
            console.error(err)

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
    }, [loadedRecipe])


    // render the page if all required data has been fetched
    if(loadedRecipe && loadedComments) {
        return (
            <div className="recipe">
                <img className="recipeImage" src={recipe.imagePath} alt="food" />
                <div className="recipeText">
                    <div className="recipeDetails">
                        <h1 className="recipeName">{recipe.name}</h1>
                        <LikeButton recipe={recipe} user={props.user} />
                        <br />
                        <a className="recipeUsername" href={'/user-' + recipe.user.slug}>{'@' + recipe.user.username}</a>
                        <Timestamp createdAt={recipe.createdAt} />
                        <p>{recipe.caption}</p>
                        {recipe.tags.map((tag, i) => (<a className="recipeTag" href={'/browserecipes?tag=' + tag} key={i}>{'#' + tag}</a>))}
                    </div>
                    
                    <div className="recipeSubsection">
                        <h2 className="recipeSubheading">Ingredients</h2>
                        <ul className="ingredients">
                            {recipe.ingredients.map((ingredient, i) => (<li className="ingredient" key={i}>{ingredient}</li>))}
                        </ul>
                    </div>
                    <br />
                    <div className="recipeSubsection">
                        <h2 className="recipeSubheading">Instructions</h2>
                        <ul className="instructions">
                            {recipe.instructions.map((instruction, i) => (<li className="instruction" key={i}>{instruction}</li>))}
                        </ul>
                    </div>
                    <br />
    
                    <CommentsSection comments={comments} userId={props.user.id} recipeId={recipe.id} />
                    
                </div>
            </div> 
        )
    }

    // not all data has been fetched yet
    else {
        return (
            <></>
        )
    }
    
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
        <>
            <input className="likeButton" type="image" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'} onClick={() => {
                setLikes(likes + (liked ? -1 : 1))
                setLiked(!liked)
            }} />
            {likes}
        </>
        
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
        const newComment = {
            user: props.userId,
            comment: value,
            recipe: props.recipeId,
            createdAt: Date.now()
        }

        //TODO: store newComment in database


        //update page to include new comment
        setComments(comments.concat([newComment]))
        setValue('')

        
    }

    // update text field as user types into it
    const handleChange = (event) => {
        setValue(event.target.value)
    }


    return (
        <div className="commentsSection">
            <h2 className="recipeSubheading">Comments</h2>
            {comments.map((comment, i) => (<Comment comment={comment} key={i} />))}
        
            <form onSubmit={handleSubmit}>
                <input className="textField" type="text" name="comment" value={value} onChange={handleChange} />
                <input className="submitButton" type="submit" value="Comment" onSubmit={handleSubmit} />
            </form>
        </div>
    )
}



export default RecipePage