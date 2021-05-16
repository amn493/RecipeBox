import { useEffect, useState } from 'react'
import axios from 'axios'
import { ThreeDots } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import React from 'react'

import './Comment.css'
import Timestamp from '../../../gencomponents/Timestamp.js'

// Component for comment
// Expects comment (a comment object) as props
//Example: <Comment comment={{recipe: 2, user: 5, comment: 'Love this recipe!', createdAt: 1615864460796}} />

const Comment = (props) => {
    // request user that authored recipe (user id = props.comment.user) when component is rendered
    const [user, setUser] = useState([])

    useEffect(() => {
        axios(
            `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${props.comment.user}`
        )
            .then((response) => {
                setUser(response.data)
            })
            .catch((err) => {
                console.error(err)
                props.setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.comment.user])

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault()
                onClick(e)
            }}
        >
            {children}
        </a>
    ))

    // delete button clicked
    const handleDeleteComment = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            // delete comment
            axios
                .post(
                    `http://${process.env.REACT_APP_ORIGIN}:4000/deletecomment`,
                    {
                        id: props.comment._id
                    }
                )
                .then(() => {
                    props.setComments(
                        props.comments
                            .slice(0, props.comments.indexOf(props.comment))
                            .concat(
                                props.comments.slice(
                                    props.comments.indexOf(props.comment) + 1,
                                    props.comments.length
                                )
                            )
                    )
                })
                .catch((err) => {
                    console.error(err)
                    props.setReqError(true)
                })
        }
    }

    return (
        <div className="comment">
            <div className="commentFirstRow">
                {props.currentUser === props.comment.user ||
                props.currentUser === props.recipeUser ? (
                    <div className="commentFirstRowDropdown">
                        <Dropdown className="dotsDropdown">
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-basic"
                            >
                                <i className="text-dark">
                                    <ThreeDots size={20} />
                                </i>
                            </Dropdown.Toggle>

                            <Dropdown.Menu
                                className="dotsDropdownMenu"
                                align="right"
                            >
                                <Dropdown.Item onClick={handleDeleteComment}>
                                    Delete Comment
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                ) : (
                    <></>
                )}
                <p className="commentText">{props.comment.comment}</p>
            </div>
            <table className="commentDetailsTable">
                <tbody>
                    <tr>
                        <td className="commentDetailsTableCell">
                            <a
                                className="commentUsername"
                                href={'/user-' + user.slug}
                            >
                                {'@' + user.username}
                            </a>
                        </td>
                        <td className="commentDetailsTableCell commentDetailsTableRightCol">
                            <Timestamp createdAt={props.comment.createdAt} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default Comment
