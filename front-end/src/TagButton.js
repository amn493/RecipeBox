import './TagButton.css'

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


export default TagButton