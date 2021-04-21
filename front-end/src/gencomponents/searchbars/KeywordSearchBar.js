import React from 'react'
import { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormControl } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import './KeywordSearchBar.css'
import { BookmarkHeart } from 'react-bootstrap-icons'

//Component for a keyword search bar
//functional for searching recipe names and users

//PROPS:
//Expects a boolean isRecipe, which, if true, yeilds a search for recipes, and if false, yeilds a search for users
//and 2 state-related variables: filter and setFilter (filter will be set to the value of the text field upon search)

const KeywordSearchBar = (props) => {
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
                    {!props.isRecipeBox ? (
                        <InputGroup.Text id="basic-addon1">
                            <img
                                src={
                                    props.isRecipe
                                        ? '../icons/recipeicon.png'
                                        : '../icons/usericon.png'
                                }
                                className="searchIcon"
                                alt=""
                            />
                        </InputGroup.Text>
                    ) : (
                        <InputGroup.Text id="basic-addon1">
                            <i>
                                <BookmarkHeart />
                            </i>
                        </InputGroup.Text>
                    )}
                </InputGroup.Prepend>
                <FormControl
                    placeholder={
                        props.isRecipe
                            ? 'Search recipes by keyword'
                            : 'Name or username'
                    }
                    onChange={handleChange}
                    value={value}
                />
                <InputGroup.Append>
                    <Button
                        variant="info"
                        type="submit"
                        className="searchButton "
                        onClick={handleSubmit}
                    >
                        Search
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    )
}

export default KeywordSearchBar
