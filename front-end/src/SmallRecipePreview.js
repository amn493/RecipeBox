import Timestamp from './Timestamp'

import './SmallRecipePreview.css'

//Component for small recipe previews
//Expects a recipe object as props
//Example: <SmallRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobar-guacamole', name: 'Guacamole', user: {username: 'foobar', slug: 'foobar'}, likes: 36, id: 2, createdAt: 1615864425952}} user={{liked: [1, 2, 3, 4, 5]}}></SmallRecipePreview>
const SmallRecipePreview = (props) => {
    
    const liked = props.user.liked.includes(props.recipe.id)
    
    return (
        <table className="smallRecipePreview">
            <tr>
                <td className="smallRecipePreviewImageCell">
                    <img className="smallRecipePreviewImage" src={props.recipe.imagePath} alt="food" />
                </td>
                <td>
                    <table className="smallRecipePreviewTable smallRecipePreviewTopTable">
                        <tr>
                            <td className="smallRecipePreviewTopTableCell">
                                <a className="smallRecipePreviewRecipeName" href={'/recipe-' + props.recipe.slug}>{props.recipe.name}</a>
                            </td>
                            <td className="smallRecipePreviewTableRightCol smallRecipePreviewLikedCol smallRecipePreviewTopTableCell">
                                <div className="likedSmall">
                                    <img className="heartImage" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'} />
                                    {props.recipe.likes}
                                </div>
                            </td>
                        </tr>
                    </table>
                    <table className="smallRecipePreviewTable">
                        <tr>
                            <td>
                                <a className="smallRecipePreviewUsername" href={'/user-' + props.recipe.user.slug}>{'@' + props.recipe.user.username}</a>
                            </td>
                            <td className="smallRecipePreviewTableRightCol">
                                <Timestamp createdAt={props.recipe.createdAt} />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    )
}

export default SmallRecipePreview