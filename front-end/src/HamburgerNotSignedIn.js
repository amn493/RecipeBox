import React from 'react'
import { slide as Menu } from 'react-burger-menu'
import './HamburgerNotSignedIn.css'

const HamburgerNotSignedIn = (props) => {
    return (
        <div>
        <Menu>
            <a className='menu-item' href='/signin'>Sign In</a>
            <a className='menu-item' href='/createaccount'>Create Account</a>
            <a className='menu-item' href='/browserecipes'>Browse Recipes</a>
            <a className='menu-item' href='/browseusers'>Browse Users</a>
        </Menu>
        </div>
    )
}

export default HamburgerNotSignedIn