import LargeRecipePreview from './LargeRecipePreview.js'
import SmallRecipePreview from './SmallRecipePreview.js'
import './RecipeList.css'

// Generates a list of recipes with a particular amount passed in
// props.size -- "small" or "large" depending on preview size
// props.recipes -- The passed in database list of recipes
// props.user -- This is the user object of the user signed in
const RecipeList = (props) => {
    // Will put "recipe" and "likes" details here when passed in / fetched from database
    let recipeArray = props.recipes
    let previewArray = []

    recipeArray.forEach((recipeEntry) => {
        // Define whether or not the previews are large and small (default to small)
        if (props.size === 'large') {
            previewArray.push(
                <div key={recipeEntry.id} className="entrySingle">
                    <LargeRecipePreview
                        key={recipeEntry.id}
                        recipe={recipeEntry}
                        user={props.user}
                    />
                </div>
            )
        } else {
            previewArray.push(
                <div key={recipeEntry.id} className="entrySingle">
                    <SmallRecipePreview
                        key={recipeEntry.id}
                        recipe={recipeEntry}
                        user={props.user}
                    />
                </div>
            )
        }
    })

    return previewArray
}

export default RecipeList
