import { PlusSquareFill } from 'react-bootstrap-icons'
import './ProfileHeader.css'

//Component for profile headers (my profile and other user profile)
//Expects user (a user object) and recipeCount (the number of recipes the user has posted) as props

const ProfileHeader = (props) => {
    return (
        <div className="profileHeader">
            <table className="profileTopTable">
                <tbody>
                    <tr>
                        <td className="profilePictureCell">
                            <img
                                className="profilePicture"
                                src={props.user.imagePath}
                                alt="user profile"
                            />
                        </td>
                        <td className="userFullNameAndUserHandle">
                            <b className="userFirstAndLastName">
                                {props.user.firstName +
                                    ' ' +
                                    props.user.lastName}
                            </b>
                            <br />
                            {'@' + props.user.username}
                        </td>
                        {props.isMyProfile ? (
                            <td className="plusButtonCell">
                                <a className="text-info" href="/new-recipe">
                                    <i>
                                        <PlusSquareFill size={31} />
                                    </i>
                                </a>
                            </td>
                        ) : (
                            <></>
                        )}
                    </tr>
                </tbody>
            </table>

            <table className="profileStatsSection">
                <tbody>
                    <tr>
                        <td className="profileStat">
                            <b className="profileStatNumber">
                                {props.recipeCount}
                            </b>
                            <br />
                            <small className="profileStatText">
                                {props.recipeCount !== 1 ? 'Recipes' : 'Recipe'}
                            </small>
                        </td>
                        <td className="profileStat">
                            <a
                                className="profileStatLink"
                                href={`/user-${props.user.slug}/followers`}
                            >
                                <b className="profileStatNumber">
                                    {props.user.followers.length}
                                </b>
                                <br />
                                <small className="profileStatText">
                                    {props.user.followers.length !== 1
                                        ? 'Followers'
                                        : 'Follower'}
                                </small>
                            </a>
                        </td>
                        <td className="profileStat">
                            <a
                                className="profileStatLink"
                                href={`/user-${props.user.slug}/following`}
                            >
                                <b className="profileStatNumber">
                                    {props.user.following.length}
                                </b>
                                <br />
                                <small className="profileStatText">
                                    {'Following'}
                                </small>
                            </a>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p className="userBio">{props.user.bio}</p>
        </div>
    )
}

export default ProfileHeader
