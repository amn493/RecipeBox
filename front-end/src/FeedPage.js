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
    useEffect(() => {

        // Get a list of feed recipes
        // userid is the logged in user so we can get their following
        // timestamp is the current time to pull recipes from a certain timeframe, e.g. a week

        // `http://localhost:4000/feedrecipes?userid=${userid}?timestamp=${currentTime}`
        let userid = props.user.id
        let currentTime = Date.now()
        axios(`http://localhost:4000/feedrecipes?userid=${userid}?timestamp=${currentTime}`).then((response) => {
            setRecBoxRecipes(response.data)
        }).catch((err) => {
            console.log(err)
            setRecBoxRecipes() // Returns empty, that way we can check in the RecipeList component if it's empty and return an error if so (e.g. "no recipes found")
        })

        
    }, [])

    return (
        <div className="container">
            <RecipeList size="large" recipes={recBoxRecipes} user={props.user} />
        </div>
    )
}

export default Feed