import './FeedPage.css'
import RecipeList from './RecipeList'
import LargeRecipePreview from './LargeRecipePreview'

import { useEffect, useState } from 'react'
import axios from 'axios'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const Feed = (props) => {

    // TODO: Back-end task -- Fill feedEntries. Also need to adjust below so the array contains both "recipe" and "likes"
    let feedRecipes = [
        {
            imagePath:'https://picsum.photos/300',
            slug:'foobar-guacamole',
            name:'Guacamole',
            user:{
            username:'foobar',
            slug:'foobar'
                },
            likes:36,
            createdAt:1615864425952,
            caption:'Because who doesn\'t love guac?',
            tags:[
            'mexican',
            'spicy',
            'dip'
            ],
            id:2
        },
        {
            imagePath:'https://picsum.photos/300',
            slug:'foobar-guacamole',
            name:'Guacamole',
            user:{
            username:'foobar',
            slug:'foobar'
                },
            likes:36,
            createdAt:1615864425952,
            caption:'Because who doesn\'t love guac?',
            tags:[
            'mexican',
            'spicy',
            'dip'
            ],
            id:3
        }
    ]

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
    })

    return (
        <div className="container">
            <RecipeList size="large" recipes={feedRecipes} user={props.user} />
        </div>
    )
}

export default Feed