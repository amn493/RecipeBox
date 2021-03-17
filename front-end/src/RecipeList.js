import LargeRecipePreview from './LargeRecipePreview.js'
import SmallRecipePreview from './SmallRecipePreview.js'
import './RecipeList.css'

// Generates a list of recipes with a particular amount passed in
// props.size -- "small" or "large" depending on preview size
// props.recipes -- The passed in database list of recipes
// props.user -- This is the user object of the user signed in
const RecipeList = (props) => {
    
    // Will put "recipe" and "likes" details here when passed in / fetched from database
    let previewArray = []
    let preview

    props.recipes.map((recipeEntry, index) => {
            // Define whether or not the previews are large and small (default to small)
            if (props.size === "large"){
                // TODO: Put in the recipe to be "entry" and get rid of likes
                preview = <LargeRecipePreview key={index} recipe={recipeEntry} user={props.user} />
            } else {
                preview = <SmallRecipePreview key={index} recipe={recipeEntry} user={props.user} />
            }

            // Add the proper list to the previewarray
            previewArray.push(
                <div className="entry-single">
                    {preview}
                </div>
            )
        }
    )
    
    // Return the list of previews
    return (
        <div className="container .entry-body">
            {previewArray}
        </div>
    )

}

export default RecipeList