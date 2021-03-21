import KeywordSearchBar from './KeywordSearchBar'
import './RecipeBoxPage.css'
import RecipeList from './RecipeList'

import { useEffect, useState } from 'react'
import axios from 'axios'
import ComboBoxSearchBar from './ComboBoxSearchBar'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const RecipeBoxPage = (props) => {

    // TODO: Back-end task -- Fill rbxEntries. Also need to adjust below so the array contains both "recipe" and "likes"
    let rbxEntries = [
        {
            imagePath:'https://picsum.photos/300',
            slug:'foobar-guacamole',
            name:'Guacamole',
            user:{
            username:'foobar',
            slug:'foobar'
                },
            likes:36,
            createdAt:1615864425952,
            caption:'Because who doesn\'t love guac?',
            tags:[
            'mexican',
            'spicy',
            'dip'
            ],
            id:2
        },
        {
            imagePath:'https://picsum.photos/300',
            slug:'foobar-guacamole',
            name:'Guacamole',
            user:{
            username:'foobar',
            slug:'foobar'
                },
            likes:36,
            createdAt:1615864425952,
            caption:'Because who doesn\'t love guac?',
            tags:[
            'mexican',
            'spicy',
            'dip'
            ],
            id:3
        }
    ]

    /* Generate state variables */
    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    // Sorting -- Expects to be a constantly edited string
    const [sortBy, setSortBy] = useState('')
    // Filtering -- Expects to be an array of tags
    const [filterTags, setFilterTags] = useState([])

    // TODO: Change string on button
    const [sortByString, setSortByString] = useState('Sort by...')

    /* Pull in recipes from mockaroo */
    useEffect(() => {
        axios('https://my.api.mockaroo.com/recipe.json?key=f6a27260').then((response) => {
            setRecBoxRecipes(response.data)
        }).catch((err) =>{
            // TODO: Print an error to the user, but for now mockaroo is likely
            console.log(err)
            setRecBoxRecipes(rbxEntries)
        })
    })

    return (
        <div className="container">
            {/* Title */}
            <h2 className="pageTitle">My Recipe Box</h2>

            {/* Sort and filter */}
            <div className="recipeBoxFilters">
                <div className="sortDropdown">
                <Dropdown as={ButtonGroup}>
                    <Button variant="success">{sortByString}</Button>

                    <Dropdown.Toggle split variant="success" id="dropdown-split-basic" />

                    <Dropdown.Menu>
                        <Dropdown.Item>Most Recently Saved</Dropdown.Item>
                        <Dropdown.Item>User</Dropdown.Item>
                        <Dropdown.Item>Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </div>

                <ComboBoxSearchBar isTag={true} tags={filterTags} setSelection={setFilterTags} />
            </div>
            {/* Generate the list of recipes */}
            <br/>
            <RecipeList size="small" recipes={recBoxRecipes} user={props.user} />
        </div>
    )
}

export default RecipeBoxPage