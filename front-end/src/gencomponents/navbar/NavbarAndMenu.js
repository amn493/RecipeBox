import axios from 'axios'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

import './NavbarAndMenu.css'

const NavbarAndMenu = (props) => {
    // sign out user when sign out button is clicked
    const signOutUser = () => {
        axios
            .post(`http://${process.env.REACT_APP_ORIGIN}:4000/signout`)
            .then(() => localStorage.removeItem('token'))
    }

    return (
        <nav className="fixed-top navbar-expand-lg rbxNavStyles">
            <div className="container-fluid">
                <div className="recipeboxNavDropdown">
                    <Navbar collapseOnSelect expand="lg" variant="dark">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Brand
                            className="rbxLogo {rbxLogoPadding}"
                            href="/"
                        >
                            RecipeBox
                        </Navbar.Brand>
                        <Navbar.Collapse
                            className="navCollapseElement"
                            id="responsive-navbar-nav"
                        >
                            {props.signedIn ? (
                                // signed-in menu
                                <Nav className="mr-auto">
                                    <NavDropdown.Divider />

                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/new-recipe"
                                    >
                                        New Recipe
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/feed"
                                    >
                                        Feed
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/my-recipe-box"
                                    >
                                        My Recipe Box
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href={'/user-' + props.user.slug}
                                    >
                                        My Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/browse-recipes"
                                    >
                                        Browse Recipes
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/browse-users"
                                    >
                                        Browse Users
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/settings"
                                    >
                                        Settings
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/sign-in"
                                        onClick={signOutUser}
                                    >
                                        Sign Out
                                    </NavDropdown.Item>
                                </Nav>
                            ) : (
                                // not signed-in menu
                                <Nav className="mr-auto">
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/sign-in"
                                    >
                                        Sign-In
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/create-account"
                                    >
                                        Create Account
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/browse-recipes"
                                    >
                                        Browse Recipes
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        className="rbxSpaceAdjustment"
                                        href="/browse-users"
                                    >
                                        Browse Users
                                    </NavDropdown.Item>
                                </Nav>
                            )}
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </nav>
    )
}

export default NavbarAndMenu
