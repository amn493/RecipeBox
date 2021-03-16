import Timestamp from './Timestamp'

import './LargeRecipePreview.css'

//Component for large recipe previews
//Expects recipe (a recipe object) and liked (a boolean indicating whether or not the signed-in user has liked the recipe) as props
//Example: <LargeRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobarguacamole', name: 'Guacamole', user: {username: 'foobar'}, likes: 36, createdAt: '2 days ago', caption: 'Because who doesn\'t love guac?', tags: ['mexican', 'spicy', 'dip']}} liked={false}></LargeRecipePreview>
const LargeRecipePreview = (props) => {
    return (
        <div className="largeRecipePreview">
            <img className="largeRecipePreviewImage" src={props.recipe.imagePath} alt="food"></img>
            <div className="recipeInfo">
                <a className="largeRecipePreviewRecipeName" href={'/recipe/' + props.recipe.slug}>{props.recipe.name}</a>
                <img className="heartImage" src={props.liked ? 'heartFill.png' : 'heartOutline.png'} alt={props.liked ? 'heart fill' : 'heart outline'}></img>
                {props.recipe.likes}
                <br></br>
                <a className="largeRecipePreviewUsername" href={'/user/' + props.recipe.user.username}>{'@' + props.recipe.user.username}</a>
                <Timestamp createdAt={props.recipe.createdAt} />
                <p>{props.recipe.caption}</p>
                {props.recipe.tags.map(tag => (<a className="largeRecipePreviewTag" href={'/browserecipes?tag=' + tag}>{'#' + tag}</a>))}
            </div>
        </div>   
    )
}

export default LargeRecipePreview


