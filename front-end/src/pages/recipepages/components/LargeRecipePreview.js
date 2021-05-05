import { useEffect, useState } from 'react'
import axios from 'axios'
import { PinAngleFill } from 'react-bootstrap-icons'

import Timestamp from '../../../gencomponents/Timestamp.js'
import Number from '../../../gencomponents/Number.js'

import './LargeRecipePreview.css'

//Component for large recipe previews
//Expects recipe (a recipe object) and user (a user object for the currently signed-in user) as props
//Example: <LargeRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobar-guacamole', name: 'Guacamole', user: {username: 'foobar', slug: 'foobar'}, likes: 36, createdAt: 1615864425952, caption: 'Because who doesn\'t love guac?', tags: ['mexican', 'spicy', 'dip'], id: 2}} user={{liked: [1, 2, 3, 4, 5]}}></LargeRecipePreview>
const LargeRecipePreview = (props) => {
    const liked = props.user.liked.includes(props.recipe._id)

    const [authorUser, setAuthorUser] = useState({})

    useEffect(() => {
        if (props.profileUser) {
            setAuthorUser({
                id: props.profileUser._id,
                username: props.profileUser.username,
                slug: props.profileUser.slug
            })
        } else if (props.user._id === props.recipe.user) {
            setAuthorUser({
                id: props.user._id,
                username: props.user.username,
                slug: props.user.slug
            })
        } else {
            axios(
                `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${props.recipe.user}`
            )
                .then((response) => {
                    setAuthorUser({
                        id: response.data._id,
                        username: response.data.username,
                        slug: response.data.slug
                    })
                })
                .catch((err) => console.error(err))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.recipe])

    return (
        <div className="largeRecipePreview">
            {props.pinned ? (
                <div className="pinLarge">
                    <i>
                        <PinAngleFill />
                    </i>
                </div>
            ) : (
                <></>
            )}
            <div
                className={`largeRecipePreviewCard${
                    props.pinned ? ' pinnedRecipeLarge' : ''
                }`}
            >
                <img
                    className="largeRecipePreviewImage"
                    src={process.env.PUBLIC_URL + props.recipe.imagePath[0]}
                    alt="food"
                />
                <table className="largeRecipePreviewTable largeRecipePreviewTopTable">
                    <tbody>
                        <tr>
                            <td className="largeRecipePreviewTopTableCell">
                                <a
                                    className="largeRecipePreviewRecipeName"
                                    href={'/recipe-' + props.recipe.slug}
                                >
                                    {props.recipe.name}
                                </a>
                            </td>
                            <td className="largeRecipePreviewTableRightCol largeRecipePreviewLikedCol largeRecipePreviewTopTableCell">
                                <div className="likedLarge">
                                    <img
                                        className="heartImage"
                                        src={
                                            'icons/' +
                                            (liked
                                                ? 'heartFill.png'
                                                : 'heartOutline.png')
                                        }
                                        alt={
                                            liked
                                                ? 'heart fill'
                                                : 'heart outline'
                                        }
                                    ></img>
                                    <Number
                                        className="numLikes"
                                        number={props.recipe.likes}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="largeRecipePreviewTable">
                    <tbody>
                        <tr>
                            <td>
                                <a
                                    className="largeRecipePreviewUsername"
                                    href={'/user-' + authorUser.slug}
                                >
                                    {'@' + authorUser.username}
                                </a>
                            </td>
                            <td className="largeRecipePreviewTableRightCol">
                                <Timestamp createdAt={props.recipe.createdAt} />
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p className="largeRecipePreviewCaption">
                    {props.recipe.caption}
                </p>
                {props.recipe.tags.map((tag, i) => (
                    <a
                        className="largeRecipePreviewTag text-info"
                        href={`/browse-recipes?tag=${tag}`}
                        key={i}
                    >
                        {'#' + tag}
                    </a>
                ))}
            </div>
        </div>
    )
}

export default LargeRecipePreview
