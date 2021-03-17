import './FeedPage.css'
import RecipeList from './RecipeList'
import LargeRecipePreview from './LargeRecipePreview'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const Feed = (props) => {

    // TODO: Back-end task -- Fill feedEntries. Also need to adjust below so the array contains both "recipe" and "likes"
    let feedRecipes = [
        {
            imagePath:'logo192.png',
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
        }
    ]

    return (
        <div className="feed-body container">
            <RecipeList size="large" recipes={feedRecipes} user={props.user} />
        </div>
    )
}

export default Feed