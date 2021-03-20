import { useEffect, useState } from 'react'
import axios from 'axios'

import KeywordSearchBar from './KeywordSearchBar.js'
import ComboBoxSearchBar from './ComboBoxSearchBar.js'

import './BrowseRecipesPage.css'
import LargeRecipePreview from './LargeRecipePreview.js'


const BrowseRecipesPage = (props) => {



    // request all tags on initial render
    const [tags, setTags] = useState([])

    useEffect(() => {
        // fetch all tags
        axios('https://my.api.mockaroo.com/tag.json?key=f6a27260')
        .then((response) => {
            
            setTags(response.data.map(tag => tag.tag))
        })
        .catch((err) => {
            console.error(err)

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

            setTags(backupData.map(tag => tag.tag))
        })
    }, [])



    

    // request all recipes on initial render
    const [allRecipes, setAllRecipes] = useState([])

    // array of recipes to be displayed
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        // fetch all recipes
        axios('https://my.api.mockaroo.com/recipe.json?key=f6a27260')
        .then((response) => {
            setAllRecipes(response.data)
            setRecipes(response.data)
        })
        .catch((err) => {
            console.error(err)

            // make some backup fake data
            const backupData = [
                {
                    user: {
                      id: 1,
                      username: 'foobar',
                      slug: 'foobar'
                    },
                    name: 'Guacamole',
                    imagePath: 'logo192.png',
                    tags: ['mexican', 'vegan'],
                    caption: "my secret recipe:)",
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
                    imagePath: 'logo192.png',
                    tags: ['mexican', 'appetizer'],
                    caption: "my secret recipe:)",
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
                    imagePath: 'logo192.png',
                    tags: ['vegan'],
                    caption: "my secret recipe:)",
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

            setAllRecipes(backupData)
            setRecipes(backupData)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const [filterKeyword, setFilterKeyword] = useState('')
    const [filterTags, setFilterTags] = useState([])
    const [tagSelection, setTagSelection] = useState('')


    useEffect(() => {
        // append selected tag to filter tags array
        setFilterTags(filterTags.concat([tagSelection]))

        // remove selected tag from tags array
        const tagIndex = tags.indexOf(tagSelection)
        setTags(tags.slice(0, tagIndex).concat(tags.slice(tagIndex + 1)))


    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tagSelection])


    
    // filter recipes based on keyword and tags entered by user
    useEffect(() => {

        // set recipes array to only include recipes whose name contain the filter keyword and whose tags include all of the filter tags
        setRecipes(allRecipes.filter(recipe => ((filterKeyword !== '') ? recipe.name.toLowerCase().includes(filterKeyword.toLowerCase()) : true) && ((filterTags.length === 0 || (filterTags.length === 1 && filterTags[0] === '')) ? true : filterTags.reduce((acc, filterTag) => acc && ((filterTag !== '') ? recipe.tags.includes(filterTag) : true), true))))

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword, filterTags]) // update recipes whenever new keyword is entered or new tag is selected / removed





    return (
        <div className="browseRecipesPage">
            <div className="recipeNameSearchbar">
                <KeywordSearchBar isRecipe={true} filter={filterKeyword} setFilter={setFilterKeyword}/>
            </div>
            <ComboBoxSearchBar isTag={true} tags={tags} setSelection={setTagSelection} />
            <div className="tagButtonsSection">
                {filterTags.map((tag, i) => <TagButton tag={tag} filterTags={filterTags} setFilterTags={setFilterTags} tags={tags} setTags={setTags} key={i} />)}
            </div>
            <div className="recipesSection">
            {recipes.sort((a, b) => b.likes - a.likes).map((recipe, i) => <LargeRecipePreview recipe={recipe} user={props.user} key={i} />)}
            </div>
        </div>
    )
}





const TagButton = (props) => {

    const handleClick = () => {

        // remove tag from filter tags array
        const tagIndex = props.filterTags.indexOf(props.tag)
        props.setFilterTags(props.filterTags.slice(0, tagIndex).concat(props.filterTags.slice(tagIndex + 1)))

        // add tag to tags array
        props.setTags(props.tags.concat([props.tag]))
    }

    return (
        (props.tag !== '') ?
            <button className="tagButton" type="button" onClick={handleClick}>{'#' + props.tag}</button>
        :
            <></> 
    )
}


export default BrowseRecipesPage