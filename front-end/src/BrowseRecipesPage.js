import { useEffect, useState } from 'react'
import axios from 'axios'

import LargeRecipePreview from './LargeRecipePreview.js'
import KeywordSearchBar from './KeywordSearchBar.js'
import ComboBoxSearchBar from './ComboBoxSearchBar.js'
import TagButton from './TagButton.js'

import './BrowseRecipesPage.css'
import ErrorComponent from './ErrorComponent.js'

const BrowseRecipesPage = (props) => {
    const [reqError, setReqError] = useState(false)

    const [filterKeyword, setFilterKeyword] = useState('')
    const [filterTags, setFilterTags] = useState([])

    // request all tags on initial render
    const [tags, setTags] = useState([])

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

    // array of recipes to be displayed
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        if (filterKeyword !== undefined && filterTags !== undefined) {
            // fetch all recipes
            axios(
                `http://localhost:4000/filteredrecipes?keyword=${filterKeyword}${
                    filterTags.length > 0
                        ? filterTags.reduce(
                              (acc, tag) => `${acc}&tags=${tag}`,
                              `&tags=`
                          )
                        : `&tags=`
                }`
            )
                .then((response) => {
                    setRecipes(response.data)
                })
                .catch((err) => {
                    console.error(err)
                    setReqError(true)

                    // make some backup fake data
                    const backupData = [
                        {
                            user: {
                                id: 1,
                                username: 'foobar',
                                slug: 'foobar'
                            },
                            name: 'Guacamole',
                            imagePath: 'https://picsum.photos/300',
                            tags: ['mexican', 'vegan'],
                            caption: 'my secret recipe:)',
                            ingredients: [
                                '3 avocados',
                                '1 tomato',
                                '1/2 yellow onion',
                                '2 jalapeños',
                                '1/4 bunch cilantro',
                                '1 lime',
                                'salt',
                                'pepper'
                            ],
                            instructions: [
                                'Mash the avocados',
                                'Dice the tomato, onion, and jalapeños',
                                'Chop the cilantro',
                                'Put everything in a bowl',
                                'Squeeze in the lime',
                                'Add salt and pepper to taste',
                                'Mix'
                            ],
                            likes: 36,
                            createdAt: 1615864425952,
                            slug: 'foobar-guacamole',
                            id: 1
                        },
                        {
                            user: {
                                id: 1,
                                username: 'foobar',
                                slug: 'foobar'
                            },
                            name: 'Tacos',
                            imagePath: 'https://picsum.photos/300',
                            tags: ['mexican', 'appetizer'],
                            caption: 'my secret recipe:)',
                            ingredients: [
                                '3 avocados',
                                '1 tomato',
                                '1/2 yellow onion',
                                '2 jalapeños',
                                '1/4 bunch cilantro',
                                '1 lime',
                                'salt',
                                'pepper'
                            ],
                            instructions: [
                                'Mash the avocados',
                                'Dice the tomato, onion, and jalapeños',
                                'Chop the cilantro',
                                'Put everything in a bowl',
                                'Squeeze in the lime',
                                'Add salt and pepper to taste',
                                'Mix'
                            ],
                            likes: 12,
                            createdAt: 1615864425952,
                            slug: 'foobar-tacos',
                            id: 2
                        },
                        {
                            user: {
                                id: 1,
                                username: 'foobar',
                                slug: 'foobar'
                            },
                            name: 'Tofu',
                            imagePath: 'https://picsum.photos/300',
                            tags: ['vegan'],
                            caption: 'my secret recipe:)',
                            ingredients: [
                                '3 avocados',
                                '1 tomato',
                                '1/2 yellow onion',
                                '2 jalapeños',
                                '1/4 bunch cilantro',
                                '1 lime',
                                'salt',
                                'pepper'
                            ],
                            instructions: [
                                'Mash the avocados',
                                'Dice the tomato, onion, and jalapeños',
                                'Chop the cilantro',
                                'Put everything in a bowl',
                                'Squeeze in the lime',
                                'Add salt and pepper to taste',
                                'Mix'
                            ],
                            likes: 30,
                            createdAt: 1615864425952,
                            slug: 'foobar-tofu',
                            id: 3
                        }
                    ]
                    setRecipes(backupData)
                })
        }
    }, [filterKeyword, filterTags])

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
        <div className="browseRecipesPage">
            <div className="recipeNameSearchbar">
                <KeywordSearchBar
                    isRecipe
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
            <div className="recipesSection">
                {recipes
                    .sort((a, b) => b.likes - a.likes)
                    .map((recipe, i) => (
                        <LargeRecipePreview
                            recipe={recipe}
                            user={props.user}
                            key={i}
                        />
                    ))}
            </div>
        </div>
    ) : (
        <ErrorComponent />
    )
}

export default BrowseRecipesPage
