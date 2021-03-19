import './Navbar.css'
import NavbarRightSignedOut from './NavbarRightSignedout.js'
import HamburgerSignedIn from './HamburgerSignedIn'
import HamburgerNotSignedIn from './HamburgerNotSignedIn'

// props.signedIn -- Whether or user is signed in or not in ordet to display the proper hamburger menu and signin/signout options
const Navbar = (props) => {

    // Determine what shows up for navbar sign in/create account buttons
    let navbarRightOptions = <NavbarRightSignedOut /> // TODO: Setup a state variable cross-page?
    let hamburgerMenu = <HamburgerNotSignedIn />
    if(props.signedIn === "true") {
        navbarRightOptions = ""
        hamburgerMenu = <HamburgerSignedIn />
    }
    
    return (
        <nav className="navbar navbar-expand-lg">
            <div className="container-fluid">

                {/* Navbar header of logo and hamburger menu*/}
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        {hamburgerMenu}
                        <h1 className="rbx-logo-title">Recipe Box</h1>
                        
                    </ul>
                </div>

                {/* Navbar header items depending on whatever a user is signed in or not */}
                {navbarRightOptions}

            </div>

        </nav>
    )
}

export default Navbar