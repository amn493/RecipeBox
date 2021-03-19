import './HamburgerSignedIn.css'
// NavDropdown imports
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Navbar'
import { BsList } from 'react-icons/bs'

let navDropdownTitleIcon = <BsList />

const HamburgerSignedIn = (props) => {

    // TODO: Check to make sure that just '/page' is good for the routing
    return (
        <div className="recipebox-nav-dropdown">
            <NavDropdown title="Menu" id="basic-nav-dropdown" className="rbx-navdropdown">
                <NavDropdown.Item href="/new-recipe">New Recipe</NavDropdown.Item>
                <NavDropdown.Item href="/feed">Feed</NavDropdown.Item>
                <NavDropdown.Item href="/my-recipe-box">My RecipeBox</NavDropdown.Item>
                {/* Is this the proper way to navigate... or should we pass in the slug as a propr? Is there a specific way?*/}
                <NavDropdown.Item href="/user-:slug">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="/browse-recipes">Browse Recipes</NavDropdown.Item>
                <NavDropdown.Item href="/browse-users">Browse Uers</NavDropdown.Item>
                <NavDropdown.Item href="/settings">Settings</NavDropdown.Item>
                <NavDropdown.Divider />
                {/* What's the best way to make this functional? */}
                <NavDropdown.Item href="">Sign Out</NavDropdown.Item>
            </NavDropdown>
        </div>
    )

}

export default HamburgerSignedIn