import './Navbar.css'
import NavbarRightSignedOut from './NavbarRightSignedout.js'

const Navbar = (props) => {

    // Determine what shows up for navbar sign in/create account buttons
    let navbarRightOptions = "" // TODO: Setup a state variable cross-page?
    if(props.signedIn == "true") {
        navbarRightOptions = <NavbarRightSignedOut />
    }
    
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">

                {/* Navbar header of logo and hamburger menu*/}
                <div className="navbar-header">
                    {/* TODO: Import hamburger menu component with onclick */}
                    <span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span>

                    <h1 className="rbx-logo-title">RecipeBox</h1>
                </div>

                {/* Navbar header items depending on whatever a user is signed in or not */}
                {navbarRightOptions}

            </div>

        </nav>
    )
}

export default Navbar