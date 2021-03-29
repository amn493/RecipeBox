import './FeedPage.css'
import RecipeList from './RecipeList'

import { useEffect, useState } from 'react'
import axios from 'axios'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const Feed = (props) => {

    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    /* Pull in recipes from mockaroo using the GET route handler */
    useEffect(async() => {
        const response = await axios.get('/feedrecipes')
        setRecBoxRecipes(response)
        // This will be set to some dummy value that we can check in order to return an error component
    }, [])

    return (
        <div className="container">
            <RecipeList size="large" recipes={recBoxRecipes} user={props.user} />
        </div>
    )
}

export default Feed