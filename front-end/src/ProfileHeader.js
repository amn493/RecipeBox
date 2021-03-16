import React from 'react'
import './ProfileHeader.css'
import AvatarEditor from 'react-avatar-editor' // convenient avatar/profilepicture npm component

//Component for profile headers (my profile and other user profile)
//Expects a user (a user object) and isCurrentUser (a boolean determining whether this profile header belongs to the currently-browsing user, or another user)

const ProfileHeader = (props) => {
  
  let editProfileOption = "" // if not currently logged-in user, no option to edit profile
  if(props.isCurrentUser === true) { // TODO: Setup a state variable cross-page
    editProfileOption = <EditProfileButton />
  }

  return (
    <div className="profileHeader">
      {/*Profile Picture*/}
      <AvatarEditor classname="ProfilePhoto"
      image={props.user.userImageUrl}
      width={250}
      height={250}
      border={50}
      color={[255, 255, 255, 0.6]} // RGBA
      scale={1.2}
      rotate={0}
    />

      <div className="userFullNameAndUserHandle">
        <p className="userFirstAndLastName"><b>{props.user.firstname + ' ' + props.user.lastname}</b></p>
        <p className="userHandle">{'@' + props.user.username}</p>
      </div>

      <div className="recipesFollowersAndFollowing">
        <button className="recipesCount">{props.user.recipes.length}<br/>{'Recipes'}</button>
        <button className="followersButton">{props.user.followers.length}<br/>{'Followers'}</button>
        <button className="followingButton">{props.user.following.length}<br/>{'Following'}</button>
      </div>

      {/*Bio*/}
      <p className="userBio">{props.user.bio}</p>

      {/*Edit Profile Button*/}
      {editProfileOption}
    </div>
  ) 
}

const EditProfileButton = () => {
        return (
            <button className="editProfileButton">{'Edit Profile'}</button>
        )
}

export default ProfileHeader;
