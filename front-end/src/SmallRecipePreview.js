import './SmallRecipePreview.css'

//Component for small recipe previews
//Expects a recipe object as props
//Example: <SmallRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobarguacamole', name: 'Guacamole', user: {username: 'foobar'}, likes: 36}} liked={false}></SmallRecipePreview>
const SmallRecipePreview = (props) => {
    return (
        <table className="smallRecipePreview">
            <tr>
            <td>
                <img className="smallRecipePreviewImage" src={props.recipe.imagePath} alt="food"></img>
            </td>
            <td>
                <a className="smallRecipePreviewRecipeName" href={'/recipe/' + props.recipe.slug}>{props.recipe.name}</a>
                <img className="heartImage" src={props.liked ? 'heartFill.png' : 'heartOutline.png'} alt={props.liked ? 'heart fill' : 'heart outline'}></img>
                {props.recipe.likes}
                <br></br>
                <a className="smallRecipePreviewUsername" href={'/user/' + props.recipe.user.username}>{'@' + props.recipe.user.username}</a>
                {props.recipe.createdAt}
            </td>
            </tr>
        </table>
    )
}

export default SmallRecipePreview