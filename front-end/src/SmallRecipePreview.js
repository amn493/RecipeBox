import './SmallRecipePreview.css'

//Component for small recipe previews
//Expects a recipe object as props
//Example: <SmallRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobar-guacamole', name: 'Guacamole', user: {username: 'foobar'}, likes: 36, id: 2, createdAt: 1615864425952}} user={{liked: [1, 2, 3, 4, 5]}}></SmallRecipePreview>
const SmallRecipePreview = (props) => {
    
    const liked = props.user.liked.includes(props.recipe.id)
    
    return (
        <table className="smallRecipePreview">
            <tr>
                <td>
                    <img className="smallRecipePreviewImage" src={props.recipe.imagePath} alt="food" />
                </td>
                <td>
                    <a className="smallRecipePreviewRecipeName" href={'/recipe/' + props.recipe.slug}>{props.recipe.name}</a>
                    <img className="heartImage" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'} />
                    {props.recipe.likes}
                    <br />
                    <a className="smallRecipePreviewUsername" href={'/user/' + props.recipe.user.username}>{'@' + props.recipe.user.username}</a>
                    {props.recipe.createdAt}
                </td>
            </tr>
        </table>
    )
}

export default SmallRecipePreview