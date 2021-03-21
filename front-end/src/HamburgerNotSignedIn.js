import './HamburgerNotSignedIn.css'
import NavbarRightSignedOut from './NavbarRightSignedout'

import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

// Component for not signed-in hamburger menu
// Does not expect any argument for props
const HamburgerNotSignedIn = (props) => {
    return (
        <div className="recipeboxNavDropdown">
            <Navbar collapseOnSelect expand="lg">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Brand href="/">Recipe Box</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown.Item href="/sign-in">Sign-In</NavDropdown.Item>
                        <NavDropdown.Item href="/create-account">Create Account</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="/browse-recipes">Browse Recipes</NavDropdown.Item>
                        <NavDropdown.Item href="/browse-users">Browse Users</NavDropdown.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default HamburgerNotSignedIn