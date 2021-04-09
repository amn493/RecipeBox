import './HamburgerSignedIn.css'
// NavDropdown imports
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import axios from 'axios'

const HamburgerSignedIn = (props) => {

    // sign out user when sign out button is clicked
    const signOutUser = () => {
        axios.post('http://localhost:4000/signout')
            .then(() => localStorage.removeItem('token'))
    }

    return (
        <div className="recipeboxNavDropdown">
            <Navbar collapseOnSelect expand="lg" variant="dark">
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Brand className="rbxLogo {rbxLogoPadding}" href="/">RecipeBox</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown.Divider />
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/new-recipe">New Recipe</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/feed">Feed</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/my-recipe-box">My Recipe Box</NavDropdown.Item>
                        {/* Is this the proper way to navigate... or should we pass in the slug as a propr? Is there a specific way?*/}
                        <NavDropdown.Item className="rbxSpaceAdjustment" href={"/user-"+props.user.slug}>My Profile</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/browse-recipes">Browse Recipes</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/browse-users">Browse Users</NavDropdown.Item>
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/settings">Settings</NavDropdown.Item>
                        <NavDropdown.Divider />
                        {/* What's the best way to make this functional? */}
                        <NavDropdown.Item className="rbxSpaceAdjustment" href="/sign-in" onClick={signOutUser}>Sign Out</NavDropdown.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )

}

export default HamburgerSignedIn