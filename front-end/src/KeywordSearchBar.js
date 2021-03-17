import React from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import UserIcon from './usericon.png'
import RecipeIcon from './recipeicon.png'
import './KeywordSearchBar.css'

//Component for a keyword search bar 
//functional for searching recipe names and users

//Expects a boolean isRecipe, which, if true, yeilds a search for recipes, and if false, yeilds a search for users

const KeywordSearchBar = (props) => {

    let searchIcon = "" //small royalty-free recipe/user profile icons displayed next to search bar
    let placeholder = ""

    if (props.isRecipe === true){
        searchIcon = RecipeIcon
        placeholder = "Search recipes by keyword"
    } else{
        searchIcon = UserIcon
        placeholder = "John Smith / @username"
    }
    
    return (
        <div className="searchBar">
            <InputGroup className="inputGroup">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1"><img src={searchIcon} className="searchIcon" alt=""/></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder={placeholder}
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                />
                <Button variant="primary" type="submit" className="searchButton">Search</Button>
            </InputGroup>
        </div>
    )
}

export default KeywordSearchBar;