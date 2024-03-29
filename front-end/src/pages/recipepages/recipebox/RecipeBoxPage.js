import './RecipeBoxPage.css'
import RecipeList from '../components/RecipeList.js'

import { useEffect, useState } from 'react'
import axios from 'axios'
import ComboBoxSearchBar from '../../../gencomponents/searchbars/ComboBoxSearchBar.js'
import KeywordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar'
import Dropdown from 'react-bootstrap/Dropdown'
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import { SortUp } from 'react-bootstrap-icons'
import { SortDown } from 'react-bootstrap-icons'
import TagButton from '../../../gencomponents/searchbars/TagButton.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

// Pulls recipes from the database for the logged-in feed and generates a recipelist for qualifying recipes
// Qualifying recipes, e.g. latest recipes posted by those someone has followed
// props.user is the passed in user
const RecipeBoxPage = (props) => {
    const [reqError, setReqError] = useState(false)

    /* Generate state variables */
    // Recipe list to show -- Is later re-assigned if/when sorts are applied
    const [recBoxRecipes, setRecBoxRecipes] = useState([])

    // Adjust dropdown and ordering
    const [sortByString, setSortByString] = useState('Sort by Date Posted')
    const [ascendingOrder, setAscendingOrder] = useState(false)

    /* Pull in recipes from route handler */
    let likedRecipes = props.user.liked

    /* Change dropdown menu according to click */
    let onDatePosted = (sortingString) => {
        setSortByString('Sort by ' + sortingString)
    }

    /* Sorting! */
    let sortRecBoxRecipes = () => {
        let resultingRecipes = recBoxRecipes

        // Sort by date posted
        if (sortByString === 'Sort by Date Posted') {
            resultingRecipes.sort((a, b) => {
                if (ascendingOrder) return a.createdAt > b.createdAt ? 1 : -1
                else return a.createdAt < b.createdAt ? 1 : -1
            })
        }

        // Sort by like count
        if (sortByString === 'Sort by Like Count') {
            resultingRecipes.sort((a, b) => {
                if (ascendingOrder) return a.likes > b.likes ? 1 : -1
                else return a.likes < b.likes ? 1 : -1
            })
        }
    }

    /* Tags -- See BrowseRecipesPage.js */
    // request all tags on initial render
    const [tags, setTags] = useState([])
    const [filterKeyword, setFilterKeyword] = useState('')
    const [filterTags, setFilterTags] = useState([])

    // Filter images by tag in combobox search bar
    useEffect(() => {
        // fetch all tags
        axios(
            `https://${
                process.env.REACT_APP_ORIGIN
            }/tags?blockedTags=${props.user.blockedTags.reduce(
                (acc, tag) => acc + `&blockedTags=${tag}`,
                ''
            )}`
        )
            .then((response) => {
                setTags(response.data)
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Filter images by keyword in search bar
    useEffect(() => {
        // fetch all recipes
        axios(
            `https://${
                process.env.REACT_APP_ORIGIN
            }/filteredrecipes?userid=${
                props.user._id
            }&keyword=${filterKeyword}${
                filterTags.length > 0
                    ? filterTags.reduce(
                          (acc, tag) => acc + `&tags=${tag}`,
                          `&tags=`
                      )
                    : `&tags=`
            }${
                likedRecipes.length > 0
                    ? likedRecipes.reduce(
                          (acc, likedRec) => acc + `&liked=${likedRec}`,
                          `&liked=`
                      )
                    : `&liked=`
            }`
        )
            .then((response) => {
                setRecBoxRecipes(
                    response.data.filter(
                        (recipe) =>
                            !recipe.tags.some((tag) =>
                                props.user.blockedTags.includes(tag)
                            )
                    )
                )
            })
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword, filterTags])

    const [tagSelection, setTagSelection] = useState('')

    useEffect(() => {
        if (tagSelection !== '') {
            // append selected tag to filter tags array
            setFilterTags(filterTags.concat([tagSelection]))

            // remove selected tag from tags array
            const tagIndex = tags.indexOf(tagSelection)
            setTags(tags.slice(0, tagIndex).concat(tags.slice(tagIndex + 1)))
            setTagSelection('')
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
                        isRecipe={true}
                        isRecipeBox={true}
                        filter={filterKeyword}
                        setFilter={setFilterKeyword}
                    />
                </div>
                <ComboBoxSearchBar
                    isTag={true}
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
            <p
                className={
                    recBoxRecipes.length === 0 &&
                    (filterKeyword !== '' || filterTags.length > 0)
                        ? 'noRecsFound'
                        : 'hidden'
                }
            >
                No recipes found
            </p>
            <hr
                className={
                    recBoxRecipes.length === 0 &&
                    (filterKeyword !== '' || filterTags.length > 0)
                        ? 'noRecsFound'
                        : 'hidden'
                }
            />
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
