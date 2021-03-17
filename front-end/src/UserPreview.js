import './UserPreview.css'
import AvatarEditor from "react-avatar-editor"

const UserPreview = (props) => {

  return (
    /*preview links to the user profile*/   
    <a className="user-preview-profile-link" href="/user">

    { /* css flex container */ }
      <div className="user-preview-container">
    
    { /* flex item: AvatarEditor module to display profile photo */ }
        <div className="user-preview-img user-preview-item">
          <AvatarEditor
            className="user-preview-avatar"
            image={props.user.userImageUrl}
            width={50}
            height={50}
            border={10}
            color={[255, 255, 255, 0.6]} // RGBA
            scale={1}
            rotate={0}
          />
        </div>
    {/* flex item : name and username */}
        <div className="user-preview-personal-data user-preview-item">
          <p className="user-preview-full-name">{`${props.user.firstName} ${props.user.lastName}`}</p>
          <p>{`@${props.user.username}`}</p>
        </div>


    {/* flex item : number of followers and recipes */}
        <div className="user-preview-numerical-data user-preview-item">
          <p>{`${props.user.followers.length} followers`}</p>
          <p>{`${props.user.recipes.length} recipes`}</p>
        </div>
      </div>
    </a>
  )
}

export default UserPreview
