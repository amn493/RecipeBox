import { useEffect, useState } from 'react'
import { Plus, Hash, Dot } from 'react-bootstrap-icons'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'

import './NewRecipePage.css'

// component for recipe page
// expects user (a user object for the signed-in user) as props
const NewRecipePage = (props) => {

    // state variables for text field values
    const [nameValue, setNameValue] = useState('')
    const [captionValue, setCaptionValue] = useState('')
    const [tagValue, setTagValue] = useState('')
    const [tags, setTags] = useState([])

    // prevent form from submitting request
    const handleSubmit = (event) => {
        event.preventDefault()
    }

    // add tag button pressed
    const addTag = () => {
        if(tagValue !== '') {
            // add tag to tags array and clear tag field
            setTags(tags.concat([tagValue]))
            setTagValue('')
        }
    }

    // tag clicked
    const removeTag = (i) => {
        // remove the tag from tags array
        setTags(tags.slice(0, i).concat(tags.slice(i + 1)))
    }

    // display file name on upload
    useEffect(() => {bsCustomFileInput.init()}, [])


    return (
        <div className="newRecipePage">

            <Form onSubmit={handleSubmit}>

                <Form.Group controlId="formRecipeName">
                    <Form.Control className="textField" type="text" name="recipeName" placeholder="Recipe name" value={nameValue} onChange={(event) => setNameValue(event.target.value)} />
                </Form.Group>
                
                <Form.Group controlId="formCaption">
                    <Form.Control className="textField" type="text" name="caption" placeholder="Caption" value={captionValue} onChange={(event) => setCaptionValue(event.target.value)} />
                </Form.Group>

                <Form.Group controlId="formTags">
                    <InputGroup className="tagField">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="hashIcon"><i><Hash /></i></InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl placeholder="tag" value={tagValue} onChange={(event) => setTagValue(event.target.value)} />
                        <InputGroup.Append>
                            <Button variant="outline-info" onClick={addTag}>Add Tag</Button>
                        </InputGroup.Append>
                    </InputGroup>

                    {tags.map((tag, i) => <Button className="mt-1 mr-1" variant="secondary" size="sm" onClick={() => removeTag(i)}>{'#' + tags[i]}</Button>)}
                </Form.Group>
                

                <Form.Group controlId="formIngredientsSection">
                    <Form.Label className="newRecipeSubheading">Ingredients</Form.Label>
                    <AdditionalFields className="ingredientFields" placeholderText="Enter ingredient" />
                </Form.Group>

                <Form.Group controlId="formInstructionsSection">
                    <Form.Label className="newRecipeSubheading">Instructions</Form.Label>
                    <AdditionalFields className="instructionFields" placeholderText="Enter instruction" />
                </Form.Group>

                <Form.Group controlId="formRecipeImage">
                    <Form.File id="custom-file" label="Upload recipe image" custom />
                </Form.Group>

                <Button block variant="info" className="submitButton" type="submit" onSubmit={handleSubmit}>Post Recipe</Button>
            </Form>
        </div>
    )
}


// component for field with add field button that adds additional fields
// expects placeholderText (a string to be used as the placeholder for all text fields) as props
const AdditionalFields = (props) => {

    // state variables for number of fields and field values
    const [fieldCount, setFieldCount] = useState(1)
    const [values, setValues] = useState([''])

    // array for text field jsx elements
    const textFields = []


    // add another text field when add button is clicked
    const addField = () => {

        console.log(values.length)
        console.log(JSON.stringify(values))
        if(values[values.length - 1] !== '') {
            setFieldCount(fieldCount + 1)
            setValues(values.concat(['']))
        }
    }
    
    // update appropriate text field as user types into it
    const handleChange = (event, i) => {
        const temp = values.slice()
        temp[i] = event.target.value
        setValues(temp)
    }


    for(let i = 0; i < fieldCount; i++) {
        textFields.push(
            <InputGroup className="subsectionField mt-1" key={i}>
                <InputGroup.Prepend>
                    <InputGroup.Text id="subsectionFieldIcon" key={i}>{(props.placeholderText === 'Enter ingredient') ? <i><Dot /></i> : `${i + 1}.`}</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" name="recipeName" placeholder={props.placeholderText} value={values[i]} onChange={(event) => handleChange(event, i)} />
            </InputGroup>
        )
    }

    return (
        <>
            {textFields}
            <Button className="mt-1" variant="outline-info" size="sm" onClick={addField}><i><Plus className="addFieldButton" /></i></Button>
        </>
    )
}



export default NewRecipePage