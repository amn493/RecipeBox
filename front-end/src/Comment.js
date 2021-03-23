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
        axios('https://my.api.mockaroo.com/user.json?key=f6a27260')
        .then((response) => {
            setUser(response.data[0])
        })
        .catch((err) => {
            console.error(err)

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
    }, [props.comment.user])



    return (
        <div className='comment'>
            {props.comment.comment}
            <br />
            <a className="username" href={'/user-' + user.slug}>{'@' + user.username}</a>
            <Timestamp createdAt={props.comment.createdAt} />
        </div>
    )
}

export default Comment