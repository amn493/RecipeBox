import React from 'react'
import { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import UserIcon from './usericon.png'
import RecipeIcon from './recipeicon.png'
import './KeywordSearchBar.css'

//Component for a keyword search bar 
//functional for searching recipe names and users

//PROPS:
//Expects a boolean isRecipe, which, if true, yeilds a search for recipes, and if false, yeilds a search for users
//and 2 state-related variables: filter and setFilter (filter will be set to the value of the text field upon search)

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



    const [value, setValue] = useState(props.filter)


    // update text field as user types into it
    const handleChange = (event) => {
        setValue(event.target.value)
    }

    // set the state variable in props.filter to the value of the text field upon submit
    const handleSubmit = () => {
        props.setFilter(value)
    }

    
    return (
        <div className="searchBar">
            <InputGroup className="inputGroup">
                <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1"><img src={searchIcon} className="searchIcon" alt=""/></InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                    placeholder={placeholder}
                    onChange={handleChange}
                    value={value}
                />
                <Button variant="secondary" type="submit" className="searchButton " onClick={handleSubmit}>Search</Button>
            </InputGroup>
        </div>
    )
}

export default KeywordSearchBar;
