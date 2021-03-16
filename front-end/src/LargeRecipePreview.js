import Timestamp from './Timestamp'

import './LargeRecipePreview.css'

//Component for large recipe previews
//Expects recipe (a recipe object) and user (a user object for the currently signed-in user) as props
//Example: <LargeRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobarguacamole', name: 'Guacamole', user: {username: 'foobar'}, likes: 36, createdAt: 1615864425952, caption: 'Because who doesn\'t love guac?', tags: ['mexican', 'spicy', 'dip'], id: 2}} user={{liked: [1, 2, 3, 4, 5]}}></LargeRecipePreview>
const LargeRecipePreview = (props) => {

    const liked = props.user.liked.includes(props.recipe.id)

    return (
        <div className="largeRecipePreview">
            <img className="largeRecipePreviewImage" src={props.recipe.imagePath} alt="food" />
            <div className="recipeInfo">
                <a className="largeRecipePreviewRecipeName" href={'/recipe/' + props.recipe.slug}>{props.recipe.name}</a>
                <img className="heartImage" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'}></img>
                {props.recipe.likes}
                <br />
                <a className="largeRecipePreviewUsername" href={'/user/' + props.recipe.user.username}>{'@' + props.recipe.user.username}</a>
                <Timestamp createdAt={props.recipe.createdAt} />
                <p>{props.recipe.caption}</p>
                {props.recipe.tags.map(tag => (<a className="largeRecipePreviewTag" href={'/browserecipes?tag=' + tag}>{'#' + tag}</a>))}
            </div>
        </div>   
    )
}

export default LargeRecipePreview


