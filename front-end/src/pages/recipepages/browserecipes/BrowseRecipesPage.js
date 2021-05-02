import { useEffect, useState } from 'react'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'

import LargeRecipePreview from '../components/LargeRecipePreview.js'
import SmallRecipePreview from '../components/SmallRecipePreview.js'
import KeywordSearchBar from '../../../gencomponents/searchbars/KeywordSearchBar.js'
import ComboBoxSearchBar from '../../../gencomponents/searchbars/ComboBoxSearchBar.js'
import TagButton from '../../../gencomponents/searchbars/TagButton.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

import './BrowseRecipesPage.css'

const BrowseRecipesPage = (props) => {
    const [reqError, setReqError] = useState(false)

    const [filterKeyword, setFilterKeyword] = useState('')
    const [filterTags, setFilterTags] = useState([])

    // request all tags on initial render
    const [tags, setTags] = useState([])

    useEffect(() => {
        // fetch all tags
        axios(
            `http://${
                process.env.REACT_APP_ORIGIN
            }:4000/tags?blockedTags=${props.user.blockedTags.reduce(
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

    // array of recipes to be displayed
    const [recipes, setRecipes] = useState([])

    useEffect(() => {
        if (filterKeyword === '' && filterTags.length === 0) {
            setRecipes([])
        } else {
            // fetch all recipes
            axios(
                `http://${
                    process.env.REACT_APP_ORIGIN
                }:4000/filteredrecipes?keyword=${filterKeyword}${
                    filterTags.length > 0
                        ? filterTags.reduce(
                              (acc, tag) => acc + `&tags=${tag}`,
                              `&tags=`
                          )
                        : `&tags=`
                }`
            )
                .then((response) => {
                    setRecipes(
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
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterKeyword, filterTags])

    // array of recommended recipes
    const [recommendedRecipes, setRecommendedRecipes] = useState([])

    useEffect(() => {
        axios(`http://${process.env.REACT_APP_ORIGIN}:4000/recommendedrecipes`)
            .then((response) =>
                setRecommendedRecipes(
                    response.data.filter(
                        (recipe) =>
                            !recipe.tags.some((tag) =>
                                props.user.blockedTags.includes(tag)
                            )
                    )
                )
            )
            .catch((err) => {
                console.error(err)
                setReqError(true)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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

    // max-width for mobile devices for responsive design
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' })

    return !reqError ? (
        <div className="browseRecipesPage">
            <div className="recipeNameSearchbar">
                <KeywordSearchBar
                    isRecipe={true}
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
            <div className="recipesSection">
                <p
                    className={
                        recipes.length === 0 &&
                        (filterKeyword !== '' || filterTags.length > 0)
                            ? 'noRecipesFoundMessage'
                            : 'hidden'
                    }
                >
                    No recipes found
                </p>
                <hr
                    className={
                        recipes.length === 0 &&
                        (filterKeyword !== '' || filterTags.length > 0)
                            ? 'noRecipesFoundMessagehr'
                            : 'hidden'
                    }
                />
                {recipes
                    .sort((a, b) => b.likes - a.likes)
                    .map((recipe, i) =>
                        isMobile ? (
                            <LargeRecipePreview
                                recipe={recipe}
                                user={props.user}
                                key={i}
                            />
                        ) : (
                            <SmallRecipePreview
                                recipe={recipe}
                                user={props.user}
                                key={i}
                            />
                        )
                    )}
            </div>
            <div
                className={
                    recipes.length === 0
                        ? 'recommendedRecipesSection'
                        : 'hidden'
                }
            >
                <b className="recommendedRecipesTitle">Recommended Recipes</b>
                {recommendedRecipes.map((recipe, i) =>
                    isMobile ? (
                        <LargeRecipePreview
                            recipe={recipe}
                            user={props.user}
                            key={i}
                        />
                    ) : (
                        <SmallRecipePreview
                            recipe={recipe}
                            user={props.user}
                            key={i}
                        />
                    )
                )}
            </div>
        </div>
    ) : (
        <ErrorComponent />
    )
}

export default BrowseRecipesPage
