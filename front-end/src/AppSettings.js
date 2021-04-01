import { useEffect, useState } from 'react'
import axios from 'axios'
import ComboBoxSearchBar from './ComboBoxSearchBar.js'
import TagButton from './TagButton'
import Button from 'react-bootstrap/Button'
import SmallUserPreview from './SmallUserPreview'


import './AppSettings.css'

//expects:
//current user and signedIn state variable
const AppSettings = (props) => {



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

    // request all tags that current user has the opportunity to block
    const [tagsToBlock, setTagsToBlock] = useState([])
    const [loadedTagsToBlock, setLoadedTagsToBlock] = useState(false)

    useEffect(() => {
        // fetch recipe tags
        axios('https://my.api.mockaroo.com/tag.json?key=f6a27260')
        .then((response) => {
            setTagsToBlock((response.data.slice(0, 25)).map((tag)=>tag.tag))
            setLoadedTagsToBlock(true)
        })
        .catch((err) => {
            console.error(err)

            // make some backup fake data
            const backupData = [
                    {
                        "tag": "6th generation",
                        "count": 24,
                        "id": 1
                      }, {
                        "tag": "holistic",
                        "count": 3,
                        "id": 2
                      }, {
                        "tag": "leverage",
                        "count": 43,
                        "id": 3
                      }, {
                        "tag": "global",
                        "count": 46,
                        "id": 4
                      }, {
                        "tag": "tangible",
                        "count": 49,
                        "id": 5
                      }, {
                        "tag": "composite",
                        "count": 20,
                        "id": 6
                      }, {
                        "tag": "motivating",
                        "count": 40,
                        "id": 7
                      }, {
                        "tag": "intermediate",
                        "count": 18,
                        "id": 8
                      }, {
                        "tag": "circuit",
                        "count": 6,
                        "id": 9
                      }
            ]

            setTagsToBlock((backupData.map((tag)=> tag.tag)))
            setLoadedTagsToBlock(true)
        })
    }, [props.user.username])


    const [blockedTagsList, addBlockedTagToList] = useState(props.user.blockedTags) //list of current user's blocked tags

    const handleAddBlockedTag = (props) => {
        if (blockedTagsList.includes(props) === false){
            addBlockedTagToList(blockedTagsList.concat(props)) //change (1) list of user's blocked tags
            let index = tagsToBlock.indexOf(props)
            setTagsToBlock(tagsToBlock.slice(0,index).concat(tagsToBlock.slice(index+1,tagsToBlock.length))) //(2) list of tags that are available to user to block
        }
    }

    const [emailNotifs, setEmailNotifs] = useState(props.user.notificationSettings.emailNotifications)
    const [likesNotifs, setLikesNotifs] = useState(props.user.notificationSettings.likes)
    const [commentsNotifs, setCommentsNotifs] = useState(props.user.notificationSettings.comments)
    const [followersNotifs, setFollowersNotifs] = useState(props.user.notificationSettings.follows)
    const [postsNotifs, setPostsNotifs] = useState(props.user.notificationSettings.posts)
    

    return(

        loadedUsers && usersToBlock && loadedTagsToBlock?
            
            <div className="appSettings">
            
                {/* Email Notifications toggle switch*/}
				<div className="emailNotifSettings">
				<table className="notifTable">

                    <tr className='emailSwitch' id={1}>
						<td>
                        	<div className="emailNotifLabel"><b>Email Notifications</b></div>
						</td>
						<td className="tableRight">
							<div className="emailSwitchMaster">
								<div className='custom-control custom-switch'id={1}>
									<input
										type='checkbox'
										className='custom-control-input'
										id='customSwitches1'
										checked={emailNotifs}
										onClick={() => setEmailNotifs(!emailNotifs)}
									/>
									<label className="custom-control-label" id={1} htmlFor='customSwitches1'/>
								</div>
							</div>
						</td>
                    </tr><hr/>

                        <tr className='notifsSwitchSubEmails'>
                            {/* New Likes toggle switch*/}
                                <td>
                                    <div className="emailNotifLabel">New Likes</div>
                                </td>
                                <td className="tableRight">
                                    <div className="indentedButton">
                                        <div className='custom-control custom-switch' id={2}>
                                            <input
                                                type='checkbox'
                                                className='custom-control-input'
                                                id='customSwitches2'
                                                checked={likesNotifs}
                                                disabled={!emailNotifs}
                                                onClick={() => setLikesNotifs(!likesNotifs)}
                                            />
                                            
                                                <label className='custom-control-label' id={2} htmlFor='customSwitches2'/>
                                            
                                        </div>
                                    </div>
                                </td>
                        </tr>
                        <hr/>

                    {/* New Comments toggle switch*/}
                    <tr className='notifsSwitchSubEmails'id={3}>
                        <td>
                            <div className="emailNotifLabel">New Comments</div>
                        </td>
                        <td className="tableRight">
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={3}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches3'
                                checked={commentsNotifs}
                                disabled={!emailNotifs}
                                onClick={() => setCommentsNotifs(!commentsNotifs)}
                            />
                            <label className='custom-control-label' id={3} htmlFor='customSwitches3'/>
                            </div>
                        </div>
                        </td>
                    </tr><hr/>

                    {/* New Followers toggle switch*/}
                    <tr className='notifsSwitchSubEmails'id={4}>
                        <td>
                            <div className="emailNotifLabel">New Followers</div>
                        </td>
                        <td className="tableRight">
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={4}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches4'
                                checked={followersNotifs}
                                disabled={!emailNotifs}
                                onClick={() => setFollowersNotifs(!followersNotifs)}
                            />
                            <label className='custom-control-label' id={4} htmlFor='customSwitches4' />
                            </div>
                        </div>
                        </td>
                    </tr><hr/>

                    {/* New Posts toggle switch*/}
                    <tr className='notifsSwitchSubEmails'id={5}>
                        <td>
                            <div className="emailNotifLabel">New Posts from Following</div>
                        </td>
                        <td className="tableRight">
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={5}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches5'
                                checked={postsNotifs}
                                disabled={!emailNotifs}
                                onClick={() => setPostsNotifs(!postsNotifs)}
                            />
                            <label className='custom-control-label' id={5} htmlFor='customSwitches5'/>
                            </div>
                        </div>
                        </td>
                    </tr><hr/>
				</table>
				</div>
				<br/><br/>

                {/* blocked users section*/}
                <div className="blockedUsers">
                    <p><b>Blocked Users</b></p>
                    <b className="settingsInstructionText">Enter a username to block</b>
                    <div className="addBlockedUser"> 
                        {/* prompt user to block any user who is not currently in their blocklist */}
                        <ComboBoxSearchBar className="addBlockedUsersField" isTag={false} tags={[]} users={usersToBlock.filter((user) => (!blockedUsers.includes(user))).map((user) => user.username)} setSelection={blockUser}/>
                    </div>
    
                    {/* preview for each of current user's blocked users */}
                    <br/><div className="blockedUsersList"> 
                        {blockedUsers.map((users, i) => <SmallUserPreview user={users} isBlockedUserProfile={true} handleClick={() => unBlockUser(users)} key={i} />)}
                    </div>
                </div>

                <br/>

                {/* blocked tags section*/}
                <div className="blockedTags">
                    <p><b className="blockedTagsHeader">Blocked Tags</b></p>
                    <div className="blockedTagsDisplay">
                        <b className="settingsInstructionText">Enter a tag to block</b>
                        <div className="addBlockedTagsField">
                            { (<ComboBoxSearchBar className="addBlockedTagsField" isTag={true} tags={tagsToBlock} users={[]} setSelection={handleAddBlockedTag}/>) }
                        </div>
                        <br/>
                        <div className="actualBlockedTags">
                            {blockedTagsList.map((selectTag, i) => <TagButton tag={selectTag} tags={tagsToBlock} filterTags={blockedTagsList} setTags={setTagsToBlock} setFilterTags={addBlockedTagToList} key={i} />)}
                        </div>
                    </div>
                </div>

                {/* signout button*/}
                <div className="signOutButton">
                    <a href="/sign-in"><br/><br/> 
                        <Button className='submitButton' type='submit' variant='outline-info'  onClick={() => props.setSignedIn(false)}>Sign Out</Button>   
                        {/* TODO: handle credentials stuff*/}
                    </a>
                </div>
                
            </div>
       
       	:
            <></>
    )

}


//expects the current user object


export default AppSettings
