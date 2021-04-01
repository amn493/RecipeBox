import Timestamp from './Timestamp'

import './LargeRecipePreview.css'

//Component for large recipe previews
//Expects recipe (a recipe object) and user (a user object for the currently signed-in user) as props
//Example: <LargeRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobar-guacamole', name: 'Guacamole', user: {username: 'foobar', slug: 'foobar'}, likes: 36, createdAt: 1615864425952, caption: 'Because who doesn\'t love guac?', tags: ['mexican', 'spicy', 'dip'], id: 2}} user={{liked: [1, 2, 3, 4, 5]}}></LargeRecipePreview>
const LargeRecipePreview = (props) => {

    const liked = props.user.liked.includes(props.recipe.id)

    return (
        <div className="largeRecipePreview">
            <img className="largeRecipePreviewImage" src={props.recipe.imagePath} alt="food" />
            <table className="largeRecipePreviewTable largeRecipePreviewTopTable">
                <tr>
                    <td className="largeRecipePreviewTopTableCell">
                        <a className="largeRecipePreviewRecipeName" href={'/recipe-' + props.recipe.slug}>{props.recipe.name}</a>
                    </td>
                    <td className="largeRecipePreviewTableRightCol largeRecipePreviewLikedCol largeRecipePreviewTopTableCell">
                        <div className="likedLarge">
                            <img className="heartImage" src={liked ? 'heartFill.png' : 'heartOutline.png'} alt={liked ? 'heart fill' : 'heart outline'}></img>
                            {props.recipe.likes}
                        </div>
                    </td>
                </tr>
            </table>
            <table className="largeRecipePreviewTable">
                <tr>
                    <td>
                        <a className="largeRecipePreviewUsername" href={'/user-' + props.recipe.user.slug}>{'@' + props.recipe.user.username}</a>
                    </td>
                    <td className="largeRecipePreviewTableRightCol">
                        <Timestamp createdAt={props.recipe.createdAt} />
                    </td>
                </tr>
            </table>
            
            <p className="largeRecipePreviewCaption">{props.recipe.caption}</p>
            {props.recipe.tags.map((tag, i) => (<a className="largeRecipePreviewTag text-info" href={'#'/*'/browserecipes?tag=' + tag*/} key={i}>{'#' + tag}</a>))}
        </div>
    )
}

export default LargeRecipePreview


