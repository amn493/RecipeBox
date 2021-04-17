import { useEffect, useState } from 'react'
import axios from 'axios'

import Timestamp from './Timestamp'

import './Comment.css'

// Component for comment
// Expects comment (a comment object) as props
//Example: <Comment comment={{recipe: 2, user: 5, comment: 'Love this recipe!', createdAt: 1615864460796}} />

const Comment = (props) => {

    // request user that authored recipe (user id = props.comment.user) when component is rendered
    const [user, setUser] = useState([])

    useEffect(() => {
        axios(`http://localhost:4000/userbyid?id=${props.comment.user}`)
            .then((response) => {
                setUser(response.data)
            })
            .catch((err) => {
                console.error(err)
                props.setReqError(true)

                // make some backup fake data
                const backupData = [
                    {
                        username: 'therealfoobar',
                        //password: // a password hash,
                        firstName: 'Foo',
                        lastName: 'Bar',
                        bio: 'follow me! :)',
                        //followers: // an array of references to User documents,
                        //following: // an array of references to User documents,
                        liked: [], // an array of references to Recipe documents
                        imagePath: 'https://picsum.photos/200',
                        slug: 'therealfoobar'
                    }
                ]

                setUser(backupData[0])
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.comment.user])



    return (
        <div className='comment'>
            <p className="commentText">{props.comment.comment}</p>
            <table className="commentDetailsTable">
                <tr>
                    <td className="commentDetailsTableCell">
                        <a className="commentUsername" href={'/user-' + user.slug}>{'@' + user.username}</a>
                    </td>
                    <td className="commentDetailsTableCell commentDetailsTableRightCol">
                        <Timestamp createdAt={props.comment.createdAt} />
                    </td>
                </tr>
            </table>
        </div>
    )
}

export default Comment