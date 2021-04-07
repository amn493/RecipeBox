import './FeedPage.css'

import { useEffect, useState } from 'react'
import axios from 'axios'
import RecipeList from './RecipeList'
import ErrorComponent from './ErrorComponent'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const Feed = (props) => {
    const [reqError, setReqError] = useState(false)

    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    /* Pull in recipes from mockaroo using the GET route handler */
    useEffect(() => {
        // Get a list of feed recipes
        // userid is the logged in user so we can get their following
        // timestamp is the current time to pull recipes from a certain timeframe, e.g. a week

        const followingArray = props.user.following

        axios(
            `http://localhost:4000/feedrecipes?${
                followingArray.length > 0
                    ? followingArray.reduce(
                          (acc, following) => `${acc}&following=${following}`,
                          `following=`
                      )
                    : `following=`
            }`
        )
            .then((response) => {
                setRecBoxRecipes(response.data)
            })
            .catch((err) => {
                console.log(err)
                setReqError(true)
                setRecBoxRecipes() // Returns empty, that way we can check in the RecipeList component if it's empty and return an error if so (e.g. "no recipes found")
            })
    }, [props.user.following])

    return !reqError ? (
        <>
            <div className="container">
                <RecipeList
                    size="large"
                    recipes={recBoxRecipes}
                    user={props.user}
                />
            </div>
        </>
    ) : (
        <ErrorComponent />
    )
}

export default Feed
