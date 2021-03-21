import { useEffect, useState } from 'react'
import axios from 'axios'
import './AppSettings.css'
import ComboBoxSearchBar from './ComboBoxSearchBar.js'

//expects:
//current user
const AppSettings = (props) => {

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

            setTagsToBlock((backupData.map((tag)=>"#" + tag.tag)))
            setLoadedTagsToBlock(true)
        })
    }, [props.user.username])


    const [blockedTagAddition, addBlockedTag] = useState(false) //value changed when 'add blocked tags' button is pressed, in turn triggering combo-box appearance
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

        loadedTagsToBlock?
            
            <div className="appSettings">

                {/* Email Notifications toggle switch*/}
                <div className="emailNotifSettings">
                    <div className='emailSwitch'id={1}>
                        <p className="emailNotifLabel">Email Notifications</p>
                        <div className="emailSwitchMaster">
                        <div className='custom-control custom-switch'id={1}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches1'
                                checked={emailNotifs ? 'checked' : ''}
                                onClick={() => setEmailNotifs(!emailNotifs)}
                            />
                            <label className='custom-control-label' id={1} htmlFor='customSwitches1'>
                            </label>
                            </div>
                        </div>
                    </div>
                
                    {/* New Likes toggle switch*/}
                    <div className='notifsSwitchSubEmails'id={2}>
                        <p className="emailNotifLabel">New Likes</p>
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={2}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches2'
                                checked={emailNotifs && likesNotifs ? 'checked' : ''}
                                onClick={() => setLikesNotifs(!likesNotifs)}
                            />
                            <label className='custom-control-label' id={2} htmlFor='customSwitches2'>
                            </label>
                            </div>
                        </div>
                    </div>

                    {/* New Comments toggle switch*/}
                    <div className='notifsSwitchSubEmails'id={3}>
                        <p className="emailNotifLabel">New Comments</p>
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={3}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches3'
                                checked={emailNotifs && commentsNotifs ? 'checked' : ''}
                                onClick={() => setCommentsNotifs(!commentsNotifs)}
                            />
                            <label className='custom-control-label' id={3} htmlFor='customSwitches3'>
                            </label>
                            </div>
                        </div>
                    </div>

                    {/* New Followers toggle switch*/}
                    <div className='notifsSwitchSubEmails'id={4}>
                        <p className="emailNotifLabel">New Followers</p>
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={4}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches4'
                                checked={emailNotifs && followersNotifs ? 'checked' : ''}
                                onClick={() => setFollowersNotifs(!followersNotifs)}
                            />
                            <label className='custom-control-label' id={4} htmlFor='customSwitches4'>
                            </label>
                            </div>
                        </div>
                    </div>

                    {/* New Posts toggle switch*/}
                    <div className='notifsSwitchSubEmails'id={5}>
                        <p className="emailNotifLabel">New Posts from Following</p>
                        <div className="indentedButton">
                        <div className='custom-control custom-switch' id={5}>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id='customSwitches5'
                                checked={emailNotifs && postsNotifs ? 'checked' : ''}
                                onClick={() => setPostsNotifs(!postsNotifs)}
                            />
                            <label className='custom-control-label' id={5} htmlFor='customSwitches5'>
                            </label>
                            </div>
                        </div>
                    </div>
                </div><br/><br/>

                {/* go to blocked users page*/}
                <div className="blockedUsers">
                    <a href="/settings/blocked-users">
                        <button className="blockedUsersButton">Blocked Accounts</button>
                    </a>
                </div><br/><br/>

                {/* blocked tags section*/}
                <div className="blockedTags">
                    <button className="blockedTagsHeader">Blocked Tags</button><br></br>
                    <textarea className="blockedTagsForm" rows="5" cols="80" value={"#" + blockedTagsList.join(" #") }></textarea><br/>
                    <button className="addBlockedTags" onClick={() => addBlockedTag(true)}> Add Blocked Tag</button><br/>
                    <div className="addBlockedTagsField">
                        { blockedTagAddition && (<ComboBoxSearchBar className="addBlockedTagsField" isTag={true} tags={tagsToBlock} users={[]} setSelection={handleAddBlockedTag}/>) }
                    </div>
                </div>

                {/* signout button*/}
                <div className="signOutButton">
                    <a href="/sign-in"><br/><br/> 
                        <button>Sign Out</button>   
                        {/* TODO: handle credentials stuff*/}
                    </a>
                </div>
                
            </div>
       
       :
            <></> 
    )
}

export default AppSettings