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
            name:'GuacaMOLE',
            user:{
            username:'foobar',
            slug:'foobar'
                },
            likes:20,
            createdAt:1615264429952,
            caption:'Because who doesn\'t love GUACAMOLE!?',
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

    // Adjust dropdown and ordering
    const [sortByString, setSortByString] = useState('Sort by Date Posted')
    const [ascendingOrder, setAscendingOrder] = useState('Ascending')

    // https://my.api.mockaroo.com/recipe.json?key=f6a27260
    /* Pull in recipes from mockaroo */
    useEffect(() => {
        axios('/0000').then((response) => {
            setRecBoxRecipes(response.data)
        }).catch((err) =>{
            // TODO: Print an error to the user, but for now mockaroo is likely
            console.log(err)
            setRecBoxRecipes(rbxEntries)
        })
    }, [])

    /* Change dropdown menu according to click */
    let onDatePosted = (sortingString) => {
        setSortByString('Sort by ' + sortingString)
    }

    /* Return a simple true/false for ascendingOrder */
    let isAscending = () => {
        let ascVal = ascendingOrder === 'Ascending' ? true : false
    }

    /* Sorting! */
    let sortRecBoxRecipes = () => {
        let resultingRecipes = recBoxRecipes

        // Sort by date posted -- TODO is to test! Mockaroo doesn't give us the greatest of dates
        if(sortByString === 'Sort by Date Posted') {
            resultingRecipes = resultingRecipes.sort((a,b) => {
                return a.createdAt > b.createdAt ? 1 : -1
            })
        }

        // Sort by date liked
        if(sortByString === 'Sort by Date Liked') {
            // TBD whenever we store that
        }

        // Sort by like count
        if(sortByString === 'Sort by Like Count') {
            resultingRecipes = resultingRecipes.sort((a,b) => {
                return a.likes > b.likes ? 1 : -1
            })
        }

    }

    return (
        <div className="container">
            {/* Title */}
            <h2 className="pageTitle">My Recipe Box</h2>

            {/* Sort and filter */}
            <div className="recipeBoxFilters">
                <div className="sortDropdown">
                    <Dropdown as={ButtonGroup}>
                        <Button variant="info">{sortByString}</Button>

                        <Dropdown.Toggle split variant="info" id="dropdown-split-basic" />
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => onDatePosted("Date Posted")}>Date Posted</Dropdown.Item>
                            <Dropdown.Item onClick={() => onDatePosted("Date Liked")}>Date Liked</Dropdown.Item>
                            <Dropdown.Item onClick={() => onDatePosted("Like Count")}>Like Count</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <div className="orderingButton">
                        <Button variant="secondary" onClick={() => {ascendingOrder === 'Ascending' ? setAscendingOrder('Descending') : setAscendingOrder('Ascending')}}>{ascendingOrder}</Button>
                    </div>
                </div>

                <ComboBoxSearchBar isTag={true} tags={filterTags} setSelection={setFilterTags} />
            </div>

            {/* Generate the list of recipes */}
            <br/>

            {sortRecBoxRecipes()}
            <RecipeList size="small" recipes={recBoxRecipes} user={props.user} />
        </div>
    )
}

export default RecipeBoxPage