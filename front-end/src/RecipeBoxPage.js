import KeywordSearchBar from './KeywordSearchBar'
import './RecipeBoxPage.css'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { SortUp, SortDown } from 'react-bootstrap-icons'

import ComboBoxSearchBar from './ComboBoxSearchBar'
import RecipeList from './RecipeList'
import TagButton from './TagButton.js'
import ErrorComponent from './ErrorComponent.js'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const RecipeBoxPage = (props) => {
    const [reqError, setReqError] = useState(false)

    // TODO: Back-end task -- Fill rbxEntries. Also need to adjust below so the array contains both "recipe" and "likes"
    const rbxEntries = [
        {
            imagePath: 'https://picsum.photos/300',
            slug: 'foobar-guacamole',
            name: 'Guacamole',
            user: {
                username: 'foobar',
                slug: 'foobar'
            },
            likes: 36,
            createdAt: 1615864425952,
            caption: "Because who doesn't love guac?",
            tags: ['mexican', 'spicy', 'dip'],
            id: 2
        },
        {
            imagePath: 'https://picsum.photos/300',
            slug: 'foobar-guacamole',
            name: 'GuacaMOLE',
            user: {
                username: 'foobar',
                slug: 'foobar'
            },
            likes: 20,
            createdAt: 1615264429952,
            caption: "Because who doesn't love GUACAMOLE!?",
            tags: ['mexican', 'spicy', 'dip'],
            id: 3
        }
    ]

    /* Generate state variables */
    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    // Adjust dropdown and ordering
    const [sortByString, setSortByString] = useState('Sort by Date Posted')
    const [ascendingOrder, setAscendingOrder] = useState(false)

    /* Pull in recipes from route handler */
    const likedRecipes = props.user.liked

    useEffect(() => {
        axios(
            `http://localhost:4000/filteredrecipes?keyword=${filterKeyword}${
                filterTags.length > 0
                    ? filterTags.reduce(
                          (acc, tag) => `${acc}&tags=${tag}`,
                          `&tags=`
                      )
                    : `&tags=`
            }${
                likedRecipes.length > 0
                    ? likedRecipes.reduce(
                          (acc, likedRec) => `${acc}&liked=${likedRec}`,
                          `&liked=`
                      )
                    : `&liked=`
            }`
        )
            .then((response) => {
                setRecBoxRecipes(response.data)
            })
            .catch((err) => {
                // TODO: Print an error to the user, but for now mockaroo is likely
                console.log(err)
                setReqError(true)
                setRecBoxRecipes(rbxEntries)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /* Change dropdown menu according to click */
    const onDatePosted = (sortingString) => {
        setSortByString(`Sort by ${sortingString}`)
    }

    /* Sorting! */
    const sortRecBoxRecipes = () => {
        const resultingRecipes = recBoxRecipes

        // Sort by date posted -- TODO is to test! Mockaroo doesn't give us the greatest of dates
        if (sortByString === 'Sort by Date Posted') {
            resultingRecipes.sort((a, b) => {
                if (ascendingOrder) return a.createdAt > b.createdAt ? 1 : -1
                return a.createdAt < b.createdAt ? 1 : -1
            })
        }

        // Sort by like count
        if (sortByString === 'Sort by Like Count') {
            resultingRecipes.sort((a, b) => {
                if (ascendingOrder) return a.likes > b.likes ? 1 : -1
                return a.likes < b.likes ? 1 : -1
            })
        }
    }

    /* Tags -- See BrowseRecipesPage.js */
    // request all tags on initial render
    const [tags, setTags] = useState([])
    const [filterKeyword, setFilterKeyword] = useState('')
    const [filterTags, setFilterTags] = useState([])

    useEffect(() => {
        // fetch all tags
        axios('http://localhost:4000/tags')
            .then((response) => {
                setTags(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)

                // make some backup fake data
                const backupData = [
                    {
                        tag: 'vegan',
                        count: 10,
                        id: 1
                    },
                    {
                        tag: 'appetizer',
                        count: 34,
                        id: 2
                    },
                    {
                        tag: 'mexican',
                        count: 22,
                        id: 3
                    }
                ]

                setTags(backupData.map((tag) => tag.tag))
            })
    }, [])

    const [tagSelection, setTagSelection] = useState('')

    useEffect(() => {
        if (tagSelection !== '') {
            // append selected tag to filter tags array
            setFilterTags(filterTags.concat([tagSelection]))

            // remove selected tag from tags array
            const tagIndex = tags.indexOf(tagSelection)
            setTags(tags.slice(0, tagIndex).concat(tags.slice(tagIndex + 1)))
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagSelection])

    return !reqError ? (
        <div>
            {/* Sort and filter */}
            <div className="recipeBoxFilters">
                <div className="sortDropdown">
                    <ButtonGroup className="sortButtonGroup">
                        <Dropdown
                            as={ButtonGroup}
                            className="sortDropdownButton"
                        >
                            <Dropdown.Toggle
                                split
                                variant="info"
                                id="dropdown-basic"
                            >
                                {sortByString}{' '}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item
                                    onClick={() => onDatePosted('Date Posted')}
                                >
                                    Date Posted
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => onDatePosted('Like Count')}
                                >
                                    Like Count
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button
                            variant="outline-info"
                            onClick={() => {
                                ascendingOrder === true
                                    ? setAscendingOrder(false)
                                    : setAscendingOrder(true)
                            }}
                        >
                            {ascendingOrder === true ? (
                                <SortUp />
                            ) : (
                                <SortDown />
                            )}
                        </Button>
                    </ButtonGroup>
                </div>

                <div className="recipeNameSearchbar">
                    <KeywordSearchBar
                        isRecipe
                        isRecipeBox
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <ComboBoxSearchBar
                    isTag
                    tags={tags}
                    setSelection={setTagSelection}
                />
                <div className="tagButtonsSection">
                    {filterTags.map((tag, i) => (
                        <TagButton
                            tag={tag}
                            filterTags={filterTags}
                            setFilterTags={setFilterTags}
                            tags={tags}
                            setTags={setTags}
                            key={i}
                        />
                    ))}
                </div>
            </div>

            {/* Generate the list of recipes */}
            <br />

            {sortRecBoxRecipes()}
            <RecipeList
                size="small"
                recipes={recBoxRecipes}
                user={props.user}
            />
        </div>
    ) : (
        <ErrorComponent />
    )
}

export default RecipeBoxPage
