import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { useMediaQuery } from 'react-responsive'

import './NavbarAndMenu.css'

const NavbarAndMenu = (props) => {
    // sign out user when sign out button is clicked
    const signOutUser = () => {
        axios
            .post(`https://${process.env.REACT_APP_ORIGIN}/signout`)
            .then(() => {
                localStorage.removeItem('token')
                window.location = '/sign-in'
            })
    }

    // ref for component
    const [ref] = useState(React.createRef())

    // handle click when menu is expanded
    const handleDocumentClick = useCallback(
        (e) =>
            ((e, ref) => {
                // close menu when click is outside of menu
                if (e.target !== ref && !ref.contains(e.target)) {
                    setMenuExpanded(false)
                }
            })(e, ref.current),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )

    // state var for whether or not menu is expanded
    const [menuExpanded, setMenuExpanded] = useState(false)

    // toggle expanded on click of hamburger button
    const handleToggle = (expanded) => {
        setMenuExpanded(expanded)
    }

    // add/remove click event listener when expanded is toggled
    useEffect(() => {
        if (menuExpanded) {
            document.addEventListener('click', handleDocumentClick, true)
        } else {
            document.removeEventListener('click', handleDocumentClick, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menuExpanded])

    // remove click event listener when component unmounts
    useEffect(() => {
        return () => {
            document.removeEventListener('click', handleDocumentClick, true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // keep track of whether or not menu is collapsed
    const isCollapsed = useMediaQuery({ query: '(max-width: 991px)' })

    return (
        <nav className="fixed-top navbar-expand-lg rbxNavStyles" ref={ref}>
            <div className="container-fluid">
                <div className="recipeboxNavDropdown">
                    <Navbar
                        collapseOnSelect
                        expand="lg"
                        variant="dark"
                        onToggle={handleToggle}
                        expanded={menuExpanded}
                    >
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Brand className="rbxLogo mr-auto" href="/">
                            RecipeBox
                        </Navbar.Brand>
                        <Navbar.Collapse
                            className="navCollapseElement"
                            id="responsive-navbar-nav"
                        >
                            {props.signedIn ? (
                                // signed-in menu
                                <>
                                    <Nav
                                        className={`mr-auto ${
                                            isCollapsed ? '' : 'ml-3'
                                        }`}
                                    >
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
                                    </Nav>
                                    <Nav className="ml-auto">
                                        <NavDropdown.Item
                                            className="rbxSpaceAdjustment"
                                            onClick={signOutUser}
                                        >
                                            Sign Out
                                        </NavDropdown.Item>
                                    </Nav>
                                </>
                            ) : (
                                // not signed-in menu
                                <>
                                    <Nav
                                        className={`mr-auto ${
                                            isCollapsed ? '' : 'ml-3'
                                        }`}
                                    >
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
                                    <Nav className="ml-auto">
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
                                    </Nav>
                                </>
                            )}
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </div>
        </nav>
    )
}

export default NavbarAndMenu
