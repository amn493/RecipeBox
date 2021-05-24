import { useEffect, useState } from 'react'
import axios from 'axios'
import { ThreeDots, ReplyFill } from 'react-bootstrap-icons'
import Dropdown from 'react-bootstrap/Dropdown'
import React from 'react'

import Timestamp from '../../../gencomponents/Timestamp.js'
import LikeButton from './LikeButton.js'
import Number from '../../../gencomponents/Number.js'

import './Comment.css'
import UserListModal from '../../userpages/userlistpage/UserListModal.js'

// Component for comment
// Expects comment (a comment object) as props
//Example: <Comment comment={{recipe: 2, user: 5, comment: 'Love this recipe!', createdAt: 1615864460796}} />

const Comment = (props) => {
    const [comment, setComment] = useState(props.comment)

    // request user that authored recipe (user id = props.comment.user) when component is rendered
    const [user, setUser] = useState([])

    useEffect(() => {
        axios(
            `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${comment.user}`
        )
            .then((response) => {
                setUser(response.data)
            })
            .catch((err) => {
                console.error(err)
                props.setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.user])

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

    const [replyTo, setReplyTo] = useState()

    useEffect(() => {
        if (comment.replyTo) {
            axios(
                `http://${process.env.REACT_APP_ORIGIN}:4000/userbyid?id=${comment.replyTo}`
            )
                .then((response) => {
                    setReplyTo(response.data)
                })
                .catch((err) => {
                    console.error(err)
                    props.setReqError(true)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comment.replyTo])

    // delete button clicked
    const handleDeleteComment = () => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            // delete comment
            axios
                .post(
                    `http://${process.env.REACT_APP_ORIGIN}:4000/deletecomment`,
                    {
                        id: comment._id,
                        thread: comment.thread ? comment.thread : undefined
                    }
                )
                .then((response) => {
                    if (response.data.deleted) {
                        setComment(response.data)
                    } else {
                        // remove the comment from the comments array
                        const oldComments = props.comments
                        props.setComments([]) // change this ?
                        props.setComments(
                            oldComments
                                .slice(
                                    0,
                                    oldComments.indexOf(props.comment) -
                                        (response.data.deletedThread ? 1 : 0)
                                )
                                .concat(
                                    oldComments.slice(
                                        oldComments.indexOf(props.comment) + 1
                                    )
                                )
                        )
                    }
                })
                .catch((err) => {
                    console.error(err)
                    props.setReqError(true)
                })
        }
    }

    // state variable for showing likes modal
    const [showModal, setShowModal] = useState(false)

    return (
        <div className={`comment ${comment.thread ? 'reply' : ''}`}>
            {!comment.deleted ? (
                <div>
                    <div className="commentFirstRow">
                        {props.user._id === user._id ||
                        props.user._id === props.recipeUser ? (
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
                                        <Dropdown.Item
                                            onClick={handleDeleteComment}
                                        >
                                            Delete Comment
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        ) : (
                            <></>
                        )}
                        <p className="commentText">
                            <a
                                className="commentUsername"
                                href={'/user-' + user.slug}
                            >
                                {user.username}
                            </a>{' '}
                            {replyTo ? (
                                <a
                                    href={`/user-${replyTo.slug}`}
                                    className="replyTo"
                                >
                                    @{replyTo.username}
                                </a>
                            ) : (
                                <></>
                            )}{' '}
                            {comment.comment}
                        </p>
                    </div>
                    <table className="commentDetailsTable">
                        <tbody>
                            <tr>
                                <td className="commentDetailsTableCell">
                                    <ReplyButton
                                        setReplyingTo={props.setReplyingTo}
                                        setThread={props.setThread}
                                        author={user}
                                        comment={comment}
                                    />
                                    <LikeButton
                                        comment={comment}
                                        setComment={setComment}
                                        user={props.user}
                                        setUser={props.setUser}
                                        signedIn={props.signedIn}
                                        setShowModal={props.setShowModal}
                                    />
                                    {comment.likers.length > 0 ? (
                                        <button
                                            className="numLikesComment"
                                            onClick={() => setShowModal(true)}
                                        >
                                            <Number
                                                number={comment.likers.length}
                                            />{' '}
                                            {comment.likers.length === 1
                                                ? `like`
                                                : `likes`}
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </td>
                                <td className="commentDetailsTableCell commentDetailsTableRightCol">
                                    <Timestamp createdAt={comment.createdAt} />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <i className="deletedText">This comment was deleted</i>
            )}
            <UserListModal
                show={showModal}
                setShow={setShowModal}
                comment={comment}
            />
        </div>
    )
}

const ReplyButton = (props) => {
    const handleReply = () => {
        props.setReplyingTo(props.author)
        props.setThread(
            props.comment.thread ? props.comment.thread : props.comment._id
        )
    }

    return (
        <button className="replyButton" onClick={handleReply}>
            <i>
                <ReplyFill className="text-info" />
            </i>
        </button>
    )
}

export default Comment
