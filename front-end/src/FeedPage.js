import './FeedPage.css'
import RecipeList from './RecipeList'

import { useEffect, useState } from 'react'
import axios from 'axios'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const Feed = (props) => {

    let feedRecipesURL = '/feedrecipes'
    let feedRecipes = async(reqlink) => {
        try {
            let response = await axios.get(reqlink)
            return response
        } catch (err) {
            // TODO: Error component
        }
    }
    feedRecipes(feedRecipesURL)

    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    /* Pull in recipes from mockaroo */
    useEffect(() => {
        axios('https://my.api.mockaroo.com/recipe.json?key=f6a27260').then((response) => {
            setRecBoxRecipes(response.data)
        }).catch((err) =>{
            // TODO: Print an error to the user, but for now mockaroo is likely
            console.log(err)
            setRecBoxRecipes(feedRecipes)
        })
    }, [])

    return (
        <div className="container">
            <RecipeList size="large" recipes={recBoxRecipes} user={props.user} />
        </div>
    )
}

export default Feed