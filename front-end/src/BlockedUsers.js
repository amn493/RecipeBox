import { useEffect, useState } from 'react'
import axios from 'axios'
import ComboBoxSearchBar from './ComboBoxSearchBar.js'
import SmallUserPreview from './SmallUserPreview'

import './BlockedUsers.css'

//expects the current user object
const BlockedUsers = (props) => {

    const [loadedUsers, setLoadedUsers] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState([]) //user info for each user currently blocked
    const [usersToBlock, setUsersToBlock] = useState([]) //user info for currently blockable users

    const blockUser = (props) => { //function to add a blocked user
        usersToBlock.map((user) =>  user.username === props ? setBlockedUsers(blockedUsers.concat(user)) : null) 
    }

    const unBlockUser = (props) => { //function to unblock a user
        if (blockedUsers.includes(props) === true){
            console.log(props)
            let index = blockedUsers.indexOf(props)
            setBlockedUsers(blockedUsers.slice(0,index).concat(blockedUsers.slice(index+1,blockedUsers.length)))
            setUsersToBlock(usersToBlock.includes(props) ? usersToBlock : usersToBlock.concat(props))
        }
    }

    //retrieve blocked/blockable users
    useEffect(() => {
        axios('https://my.api.mockaroo.com/user.json?key=f6a27260')
        .then((response) => {
            setBlockedUsers((response.data).slice(1,1+props.user.blockedUsers.length)) //TODO: replace with actual blocked users list
            setUsersToBlock((response.data).slice(1,20))
            setLoadedUsers(true)
        })
        .catch((err) => {
            console.error(err)
            // make some backup fake data
            const backupData = [
                {
                    username: 'anonymous', 
                    password: 'Abc123', 
                    firstName: 'Anonymous', 
                    lastName: 'User', 
                    bio: 'fun, easy recipes!',
                    followers: [2,3,5,7,9], 
                    following: [2,3,4,8,9], 
                    liked: [1,3,5,10,33],
                    slug: 'anonymous',
                    id: 1,
                    imagePath: "https://thumbs.dreamstime.com/z/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg"
                },
                {
                    username: 'foobar2', 
                    password: 'Abc123', 
                    firstName: 'foo', 
                    lastName: 'bar', 
                    bio: 'fun, easy recipes!',
                    followers: [2,3,5,7,9], 
                    following: [2,3,4,8,9], 
                    liked: [1,3,5,10,33],
                    slug: 'foobar2',
                    id: 2,
                    imagePath: "https://thumbs.dreamstime.com/z/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg"
                },
                {
                    username: 'blockeduser6', 
                    password: 'Abc123', 
                    firstName: 'blocked', 
                    lastName: 'user', 
                    bio: 'fun, easy recipes!',
                    followers: [2,3,5,7,9], 
                    following: [2,3,4,8,9], 
                    liked: [1,3,5,10,33],
                    slug: 'blockeduser6',
                    id: 3,
                    imagePath: "https://thumbs.dreamstime.com/z/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg"
                },
                {
                    username: 'usertoblock', 
                    password: 'Abc123', 
                    firstName: 'user', 
                    lastName: 'toblock', 
                    bio: 'fun, easy recipes!',
                    followers: [2,3,5,7,9], 
                    following: [2,3,4,8,9], 
                    liked: [1,3,5,10,33],
                    slug: 'usertoblock',
                    id: 4,
                    imagePath: "https://thumbs.dreamstime.com/z/heart-shape-various-vegetables-fruits-healthy-food-concept-isolated-white-background-140287808.jpg"
                }
            ]
                
            setBlockedUsers((backupData).slice(0,props.user.blockedUsers.length))
            setUsersToBlock((backupData).slice(props.user.blockedUsers.length,backupData.length))
            setLoadedUsers(true)
        })
    },[props.user.username])

    return(
        loadedUsers && usersToBlock ?

            <div className="blockedUsers">

                <div className="backToSettings">
                    <a href="/settings"><br/><br/>
                        <button>Back to settings</button>
                    </a>
                </div><br/>

                <div className="addBlockedUser"> 
                    {/* prompt user to block any user who is not currently in their blocklist */}
                    <ComboBoxSearchBar className="addBlockedUsersField" isTag={false} tags={[]} users={usersToBlock.map((user, i) => (blockedUsers.includes(usersToBlock[i]) ? false : user.username))} setSelection={blockUser}/>
                </div>

                {/* preview for each of current user's blocked users */}
                <br/><div className="blockedUsersList"> 
                    {blockedUsers.map((users, i) => <SmallUserPreview user={users} isBlockedUserProfile={true} handleClick={() => unBlockUser(users)} key={i} />)}
                </div>
            </div>
        :
            <></>
    )

}

export default BlockedUsers