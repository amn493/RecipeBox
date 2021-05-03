import { useEffect, useState } from 'react'
import axios from 'axios'
import { PinAngleFill } from 'react-bootstrap-icons'
import { useMediaQuery } from 'react-responsive'

import Timestamp from '../../../gencomponents/Timestamp.js'
import Number from '../../../gencomponents/Number.js'

import './SmallRecipePreview.css'

//Component for small recipe previews
//Expects a recipe object as props
//Example: <SmallRecipePreview recipe={{imagePath: 'logo192.png', slug: 'foobar-guacamole', name: 'Guacamole', user: {username: 'foobar', slug: 'foobar'}, likes: 36, id: 2, createdAt: 1615864425952}} user={{liked: [1, 2, 3, 4, 5]}}></SmallRecipePreview>
const SmallRecipePreview = (props) => {
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

    // max-width for mobile devices for responsive design
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' })

    return (
        <div className="smallRecipePreview">
            {props.pinned ? (
                <div className="pinSmall">
                    <i>
                        <PinAngleFill />
                    </i>
                </div>
            ) : (
                <></>
            )}
            <div className={props.pinned ? 'pinnedRecipeSmall' : ''}>
                <table className="smallRecipePreviewOuterTable">
                    <tbody>
                        <tr className="smallRecipePreviewOuterTableRow">
                            <td
                                className={`smallRecipePreviewImageCell${
                                    isMobile
                                        ? ''
                                        : ' smallRecipePreviewImageCellExpanded'
                                }`}
                            >
                                <img
                                    className={`smallRecipePreviewImage${
                                        isMobile
                                            ? ''
                                            : ' smallRecipePreviewImageExpanded'
                                    }`}
                                    src={props.recipe.imagePath[0]}
                                    alt="food"
                                />
                            </td>
                            <td
                                className={`smallRecipePreviewTextCell${
                                    isMobile
                                        ? ''
                                        : ' smallRecipePreviewTextCellExpanded'
                                }`}
                            >
                                <table className="smallRecipePreviewTable smallRecipePreviewTopTable">
                                    <tbody>
                                        <tr>
                                            <td className="smallRecipePreviewTopTableCell">
                                                <a
                                                    className="smallRecipePreviewRecipeName"
                                                    href={
                                                        '/recipe-' +
                                                        props.recipe.slug
                                                    }
                                                >
                                                    {props.recipe.name}
                                                </a>
                                            </td>
                                            <td className="smallRecipePreviewTableRightCol smallRecipePreviewLikedCol smallRecipePreviewTopTableCell">
                                                <div className="likedSmall">
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
                                                    />
                                                    <Number
                                                        className="numLikes"
                                                        number={
                                                            props.recipe.likes
                                                        }
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="smallRecipePreviewTable">
                                    <tbody>
                                        <tr>
                                            <td>
                                                <a
                                                    className="smallRecipePreviewUsername"
                                                    href={
                                                        '/user-' +
                                                        authorUser.slug
                                                    }
                                                >
                                                    {'@' + authorUser.username}
                                                </a>
                                            </td>
                                            <td className="smallRecipePreviewTableRightCol">
                                                <Timestamp
                                                    createdAt={
                                                        props.recipe.createdAt
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                {!isMobile ? (
                                    <table className="smallRecipePreviewExtraDetails">
                                        <tbody>
                                            <tr>
                                                <p className="smallRecipePreviewCaption">
                                                    {props.recipe.caption}
                                                </p>

                                                {props.recipe.tags.map(
                                                    (tag, i) => (
                                                        <a
                                                            className="smallRecipePreviewTag text-info"
                                                            href={`/browse-recipes?tag=${tag}`}
                                                            key={i}
                                                        >
                                                            {'#' + tag}
                                                        </a>
                                                    )
                                                )}
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <></>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SmallRecipePreview
