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
                <Navbar.Brand className="rbxLogo" href="/">RecipeBox</Navbar.Brand>
                <Navbar.Collapse className="navCollapseElement" id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown.Divider />
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/sign-in">Sign-In</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/create-account">Create Account</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/browse-recipes">Browse Recipes</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/browse-users">Browse Users</NavDropdown.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default HamburgerNotSignedIn