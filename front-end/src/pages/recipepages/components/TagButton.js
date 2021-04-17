import Button from 'react-bootstrap/Button';

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
            <Button variant="secondary" size="sm" className="tagButton mr-1 mt-1" onClick={handleClick}>{'#' + props.tag}</Button>
        :
            <></> 
    )
}


export default TagButton