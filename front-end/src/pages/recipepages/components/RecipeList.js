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

    previewArray = recipeArray.map((recipeEntry, index) =>
        props.size === 'large' ? (
            // Define whether or not the previews are large and small (default to small)
            <div key={index} className="entrySingle">
                <LargeRecipePreview
                    key={recipeEntry.id}
                    recipe={recipeEntry}
                    user={props.user}
                />
            </div>
        ) : (
            <div key={index} className="entrySingle">
                <SmallRecipePreview
                    key={recipeEntry.id}
                    recipe={recipeEntry}
                    user={props.user}
                />
            </div>
        )
    )

    return previewArray
}

export default RecipeList
