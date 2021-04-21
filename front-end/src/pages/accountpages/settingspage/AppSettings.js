import { useEffect, useState } from 'react'
import axios from 'axios'
import ComboBoxSearchBar from '../../../gencomponents/searchbars/ComboBoxSearchBar.js'
import TagButton from '../../../gencomponents/searchbars/TagButton.js'
import Button from 'react-bootstrap/Button'
import SmallUserPreview from '../../userpages/components/SmallUserPreview.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

import './AppSettings.css'

//expects:
//current user and signedIn state variable
const AppSettings = (props) => {
    const [reqError, setReqError] = useState(false)
    const [currentUser] = useState(props.user)
    const [blockedUsersOnRender] = useState(props.user.blockedUsers)
    const [loadedUsers, setLoadedUsers] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState([]) //user info for each user currently blocked
    const [usersToBlock, setUsersToBlock] = useState([]) //user info for currently blockable users

    const blockUser = (userNameToBlock) => {
        //function to add a blocked user
        axios
            .post('http://localhost:4000/blockuser', {
                addBlock: true,
                signedInUserID: currentUser._id,
                signedInblockedUsers: blockedUsers.map((user) => user._id),
                signedInUserFollowing: currentUser.following,
                signedInUserFollowers: currentUser.followers,
                blockedUserID: usersToBlock
                    .filter((user) => user.username === userNameToBlock)
                    .map((user) => user._id)[0],
                blockedUserFollowing: usersToBlock
                    .filter((user) => user.username === userNameToBlock)
                    .map((user) => user.following)[0],
                blockedUserFollowers: usersToBlock
                    .filter((user) => user.username === userNameToBlock)
                    .map((user) => user.followers)[0]
            })
            .then((response) => {
                setBlockedUsers(
                    blockedUsers.concat(
                        usersToBlock.filter(
                            (user) => user.username === userNameToBlock
                        )
                    )
                )
                props.setUser(response.data)
            })
    }

    const unBlockUser = (userToUnblock) => {
        //function to unblock a user
        if (blockedUsers.includes(userToUnblock) === true) {
            axios
                .post('http://localhost:4000/blockuser', {
                    addBlock: false,
                    signedInUserID: currentUser._id,
                    signedInblockedUsers: blockedUsers.map((user) => user._id),
                    signedInUserFollowing: currentUser.following,
                    signedInUserFollowers: currentUser.followers,
                    blockedUserID: userToUnblock._id,
                    blockedUserFollowing: userToUnblock.following,
                    blockedUserFollowers: userToUnblock.followers
                })
                .then((response) => {
                    let index = blockedUsers.indexOf(userToUnblock)
                    setBlockedUsers(
                        blockedUsers
                            .slice(0, index)
                            .concat(
                                blockedUsers.slice(
                                    index + 1,
                                    blockedUsers.length
                                )
                            )
                    )
                    usersToBlock.includes(userToUnblock)
                        ? setUsersToBlock(usersToBlock)
                        : setUsersToBlock(usersToBlock.concat(props))
                    props.setUser(response.data)
                })
        }
    }

    //retrieve blocked users using GET handler
    useEffect(() => {
        axios(`http://localhost:4000/users?userID=${currentUser._id}`)
            .then((response) => {
                setBlockedUsers(
                    response.data.filter((user) =>
                        blockedUsersOnRender.includes(user._id)
                    )
                )
                setUsersToBlock(
                    response.data.filter(
                        (user) =>
                            !blockedUsers.includes(user) &&
                            user._id !== currentUser._id
                    )
                )
                setLoadedUsers(true)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // request all tags that current user has the opportunity to block
    const [tagsToBlock, setTagsToBlock] = useState([])
    const [loadedTagsToBlock, setLoadedTagsToBlock] = useState(false)

    useEffect(() => {
        // fetch recipe tags
        axios(
            `http://localhost:4000/tags?blockedTags=${props.user.blockedTags.reduce(
                (acc, tag) => `&blockedTags=${tag}`,
                ''
            )}`
        )
            .then((response) => {
                setTagsToBlock(response.data)
                setLoadedTagsToBlock(true)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [blockedTagsList, addBlockedTagToList] = useState(
        props.user.blockedTags
    ) //list of current user's blocked tags

    const handleChangedNotifSwitch = () => {
        axios
            .post('http://localhost:4000/notificationsettings', {
                emailNotifications: emailNotifs,
                likes: likesNotifs,
                comments: commentsNotifs,
                follows: followersNotifs,
                userID: currentUser._id
            })
            .then((response) => {
                props.setUser(response.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const handleAddBlockedTag = (tagToBlock) => {
        if (blockedTagsList.includes(tagToBlock) === false) {
            axios
                .post('http://localhost:4000/blocktag', {
                    addBlock: true,
                    tagToBlockOrUnblock: tagToBlock,
                    signedInBlockedTags: blockedTagsList,
                    userID: currentUser._id
                })
                .then((response) => {
                    addBlockedTagToList(blockedTagsList.concat(tagToBlock)) //change (1) list of user's blocked tags
                    let index = tagsToBlock.indexOf(tagToBlock)
                    setTagsToBlock(
                        tagsToBlock
                            .slice(0, index)
                            .concat(
                                tagsToBlock.slice(index + 1, tagsToBlock.length)
                            )
                    )
                    props.setUser(response.data)
                }) //(2) list of tags that are available to user to block
        }
    }

    const handleRemoveBlockedTag = (tagToUnblock) => {
        axios
            .post('http://localhost:4000/blocktag', {
                addBlock: false,
                tagToBlockOrUnblock: tagToUnblock,
                signedInBlockedTags: blockedTagsList,
                userID: currentUser._id
            })
            .then((response) => {
                props.setUser(response.data)
            })
            .catch((err) => {
                console.error(err)
            })
    }

    const [emailNotifs, setEmailNotifs] = useState(
        props.user.notificationSettings.emailNotifications
    )
    const [likesNotifs, setLikesNotifs] = useState(
        props.user.notificationSettings.likes
    )
    const [commentsNotifs, setCommentsNotifs] = useState(
        props.user.notificationSettings.comments
    )
    const [followersNotifs, setFollowersNotifs] = useState(
        props.user.notificationSettings.follows
    )
    // const [postsNotifs, setPostsNotifs] = useState(props.user.notificationSettings.posts)

    //call function to make post request to /notification settings
    //when notification settings state variables are changed
    useEffect(() => {
        handleChangedNotifSwitch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailNotifs, likesNotifs, commentsNotifs, followersNotifs])

    // sign out user when sign out button is clicked
    const signOutUser = () => {
        axios
            .post('http://localhost:4000/signout')
            .then(() => localStorage.removeItem('token'))
    }

    return !reqError ? (
        loadedUsers && usersToBlock && loadedTagsToBlock ? (
            <div className="appSettings">
                {/* Email Notifications toggle switch*/}
                <div className="emailNotifSettings">
                    <table className="notifTable">
                        <tbody>
                            <tr className="emailSwitch" id={1}>
                                <td>
                                    <div className="emailNotifLabel">
                                        <b>Email Notifications</b>
                                    </div>
                                </td>
                                <td className="tableRight">
                                    <div className="emailSwitchMaster">
                                        <div
                                            className="custom-control custom-switch"
                                            id={1}
                                        >
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitches1"
                                                checked={emailNotifs}
                                                onClick={() => {
                                                    setEmailNotifs(!emailNotifs)
                                                }}
                                                onChange={(e) => {}}
                                            />
                                            <label
                                                className="custom-control-label"
                                                id={1}
                                                htmlFor="customSwitches1"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* simulating <hr> (horitzontal rule) for style*/}
                            <tr className="borderedtr">
                                <td className="borderedtd"></td>
                            </tr>

                            {/* New Likes toggle switch*/}
                            <tr className="notifsSwitchSubEmails">
                                <td>
                                    <div className="emailNotifLabel">
                                        New Likes
                                    </div>
                                </td>
                                <td className="tableRight">
                                    <div className="indentedButton">
                                        <div
                                            className="custom-control custom-switch"
                                            id={2}
                                        >
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitches2"
                                                checked={likesNotifs}
                                                disabled={!emailNotifs}
                                                onClick={() => {
                                                    setLikesNotifs(!likesNotifs)
                                                }}
                                                onChange={(e) => {}}
                                            />

                                            <label
                                                className="custom-control-label"
                                                id={2}
                                                htmlFor="customSwitches2"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* simulating <hr> (horitzontal rule) for style*/}
                            <tr className="borderedtr">
                                <td className="borderedtd"></td>
                            </tr>

                            {/* New Comments toggle switch*/}
                            <tr className="notifsSwitchSubEmails" id={3}>
                                <td>
                                    <div className="emailNotifLabel">
                                        New Comments
                                    </div>
                                </td>
                                <td className="tableRight">
                                    <div className="indentedButton">
                                        <div
                                            className="custom-control custom-switch"
                                            id={3}
                                        >
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitches3"
                                                checked={commentsNotifs}
                                                disabled={!emailNotifs}
                                                onClick={() => {
                                                    setCommentsNotifs(
                                                        !commentsNotifs
                                                    )
                                                }}
                                                onChange={(e) => {}}
                                            />
                                            <label
                                                className="custom-control-label"
                                                id={3}
                                                htmlFor="customSwitches3"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* simulating <hr> (horitzontal rule) for style*/}
                            <tr className="borderedtr">
                                <td className="borderedtd"></td>
                            </tr>

                            {/* New Followers toggle switch*/}
                            <tr className="notifsSwitchSubEmails" id={4}>
                                <td>
                                    <div className="emailNotifLabel">
                                        New Followers
                                    </div>
                                </td>
                                <td className="tableRight">
                                    <div className="indentedButton">
                                        <div
                                            className="custom-control custom-switch"
                                            id={4}
                                        >
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="customSwitches4"
                                                checked={followersNotifs}
                                                disabled={!emailNotifs}
                                                onClick={() => {
                                                    setFollowersNotifs(
                                                        !followersNotifs
                                                    )
                                                }}
                                                onChange={(e) => {}}
                                            />
                                            <label
                                                className="custom-control-label"
                                                id={4}
                                                htmlFor="customSwitches4"
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            {/* simulating <hr> (horitzontal rule) for style*/}
                            <tr className="borderedtr">
                                <td className="borderedtd"></td>
                            </tr>

                            {/* New Posts toggle switch*/}
                            {/* <tr className='notifsSwitchSubEmails' id={5}>
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
                                                    onChange={e => { }}
                                                />
                                                <label className='custom-control-label' id={5} htmlFor='customSwitches5' />
                                            </div>
                                        </div>
                                    </td>
                                </tr> */}

                            {/* simulating <hr> (horitzontal rule) for style*/}
                            {/* <tr className="borderedtr">
                                    <td className="borderedtd"></td>
                                </tr> */}
                        </tbody>
                    </table>
                </div>
                <br />
                <br />

                {/* blocked users section*/}
                <div className="blockedUsers">
                    <p>
                        <b>Blocked Users</b>
                    </p>
                    <b className="settingsInstructionText">
                        Enter a username to block
                    </b>
                    <div className="addBlockedUser">
                        {/* prompt user to block any user who is not currently in their blocklist */}
                        <ComboBoxSearchBar
                            className="addBlockedUsersField"
                            isTag={false}
                            tags={[]}
                            users={usersToBlock
                                .filter((user) => !blockedUsers.includes(user))
                                .map((user) => user.username)}
                            setSelection={blockUser}
                        />
                    </div>

                    {/* preview for each of current user's blocked users */}
                    <br />
                    <div className="blockedUsersList">
                        {blockedUsers.map((users, i) => (
                            <SmallUserPreview
                                user={users}
                                isBlockedUserProfile={true}
                                handleClick={() => unBlockUser(users)}
                                key={i}
                            />
                        ))}
                    </div>
                </div>

                <br />

                {/* blocked tags section*/}
                <div className="blockedTags">
                    <p>
                        <b className="blockedTagsHeader">Blocked Tags</b>
                    </p>
                    <div className="blockedTagsDisplay">
                        <b className="settingsInstructionText">
                            Enter a tag to block
                        </b>
                        <div className="addBlockedTagsField">
                            {
                                <ComboBoxSearchBar
                                    className="addBlockedTagsField"
                                    isTag={true}
                                    tags={tagsToBlock}
                                    users={[]}
                                    setSelection={handleAddBlockedTag}
                                />
                            }
                        </div>
                        <br />
                        <div className="actualBlockedTags">
                            {blockedTagsList.map((selectTag, i) => (
                                <div
                                    className="blockedTagButtonNest"
                                    key={i}
                                    onClick={() =>
                                        handleRemoveBlockedTag(selectTag)
                                    }
                                >
                                    {' '}
                                    {
                                        <TagButton
                                            tag={selectTag}
                                            tags={tagsToBlock}
                                            filterTags={blockedTagsList}
                                            setTags={setTagsToBlock}
                                            setFilterTags={addBlockedTagToList}
                                            key={i}
                                        />
                                    }{' '}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* signout button*/}
                <div className="signOutButton">
                    <a href="/sign-in">
                        <br />
                        <br />
                        <Button
                            className="submitButton"
                            type="submit"
                            variant="outline-info"
                            onClick={signOutUser}
                        >
                            Sign Out
                        </Button>
                        {/* TODO: handle credentials stuff*/}
                    </a>
                </div>
            </div>
        ) : (
            <></>
        )
    ) : (
        <ErrorComponent />
    )
}

//expects the current user object

export default AppSettings
