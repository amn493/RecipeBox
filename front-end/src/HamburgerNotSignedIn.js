import './HamburgerNotSignedIn.css'

import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Navbar'
import { BsList } from 'react-icons/bs'

let navDropdownTitleIcon = <BsList />

// Component for not signed-in hamburger menu
// Does not expect any argument for props
const HamburgerNotSignedIn = (props) => {
    return (
        <div className="recipebox-nav-dropdown">
            <NavDropdown title={navDropdownTitleIcon} id="basic-nav-dropdown" className="rbx-navdropdown">
                <NavDropdown.Item href="/sign-in">Sign-In</NavDropdown.Item>
                <NavDropdown.Item href="/create-account">Create Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/browse-recipes">Browse Recipes</NavDropdown.Item>
                <NavDropdown.Item href="/browse-users">Browse Uers</NavDropdown.Item>
            </NavDropdown>
        </div>
    )
}

export default HamburgerNotSignedIn