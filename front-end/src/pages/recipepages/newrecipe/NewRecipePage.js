import { useEffect, useState } from 'react'
import { Plus, Hash, Dot } from 'react-bootstrap-icons'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import './NewRecipePage.css'
import ImageCropModal from '../../../gencomponents/ImageCropModal.js'

// component for recipe page
// expects user (a user object for the signed-in user) as props
const NewRecipePage = (props) => {
    // state variables for text field values
    const [nameValue, setNameValue] = useState('')
    const [captionValue, setCaptionValue] = useState('')
    const [tagValue, setTagValue] = useState('')
    const [tags, setTags] = useState([])
    const [ingredientValues, setIngredientValues] = useState([''])
    const [instructionValues, setInstructionValues] = useState([''])
    const [imageFiles, setImageFiles] = useState([])
    const [croppedImage, setCroppedImage] = useState()

    // state variables for disabling post recipe button
    const [emptyField, setEmptyField] = useState(true)
    const [uploadedImage, setUploadedImage] = useState(false)
    const [filledIngredientField, setFilledIngredientField] = useState(false)
    const [filledInstructionField, setFilledInstructionField] = useState(false)

    // state for when form is submitted successfully
    const [submitted, setSubmitted] = useState(false)

    // state variable for showing image crop modal
    const [showModal, setShowModal] = useState(false)
    // state variable for setting recipe <img> src to send to cropperjs in modal
    const [recipeImgSrc, setRecipeImgSrc] = useState('')

    // make post request on form submission
    const handleSubmit = (event) => {
        event.preventDefault()

        const headers = {
            'Content-Type': 'multipart/form-data'
        }

        const newRecipe = new FormData()
        newRecipe.append('userID', props.user._id)
        newRecipe.append('name', nameValue)
        for (let i = 0; i < imageFiles.length; i++) {
            newRecipe.append('recipeimage', imageFiles[i])
        }
        newRecipe.append('tags', JSON.stringify(tags))
        newRecipe.append('caption', captionValue)
        newRecipe.append('ingredients', JSON.stringify(ingredientValues))
        newRecipe.append('instructions', JSON.stringify(instructionValues))

        axios
            .post(
                `http://${process.env.REACT_APP_ORIGIN}:4000/newrecipe`,
                newRecipe,
                {
                    headers
                }
            )
            .then((response) => setSubmitted(true))
    }

    // add tag button pressed
    const addTag = () => {
        // remove everything aside from letters and numbers and make the tag lowercase
        const newTag = Array.from(tagValue)
            .filter(
                (char) =>
                    (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 90) ||
                    (char.charCodeAt(0) >= 97 && char.charCodeAt(0) <= 122) ||
                    (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57)
            )
            .join('')
            .toLowerCase()
        if (newTag !== '' && !tags.includes(newTag)) {
            // add tag to tags array and clear tag field
            setTags(tags.concat([newTag]))
        }
        setTagValue('')
    }

    // tag clicked
    const removeTag = (i) => {
        // remove the tag from tags array
        setTags(tags.slice(0, i).concat(tags.slice(i + 1)))
    }

    // REMOVED FOR CROPPING?
    useEffect(() => {
        bsCustomFileInput.init()
    }, [])
    // END OF WHAT WAS REMOVED FOR CROPPING

    // check for empty fields
    useEffect(() => {
        setEmptyField(
            !filledIngredientField ||
                !filledInstructionField ||
                nameValue === '' ||
                !uploadedImage
        )
    }, [
        filledIngredientField,
        filledInstructionField,
        nameValue,
        uploadedImage
    ])

    const [imageToCrop, setImageToCrop] = useState()

    // function to allow user to re-upload/re-crop a photo
    // that they just cleared/uploaded
    const clearUpload = (event) => {
        event.target.value = ''
    }

    const [imageIndex, setImageIndex] = useState(-1)

    useEffect(() => {
        if (showModal === false) {
            setImageIndex(imageIndex + 1)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showModal])

    const [uploadedFiles, setUploadedFiles] = useState([])

    useEffect(() => {
        if (uploadedFiles.length > 0) {
            if (imageIndex === uploadedFiles.length) {
                setUploadedFiles([])
                setImageIndex(0)
            } else if (imageIndex >= 0) {
                const file = uploadedFiles[imageIndex]

                const reader = new FileReader()

                // Clear image sources to support multiple images
                setRecipeImgSrc()
                reader.addEventListener(
                    'load',
                    function () {
                        // convert image file to base64 string for cropperJS <img> src
                        setRecipeImgSrc(reader.result)
                    },
                    false
                )

                if (file) {
                    reader.readAsDataURL(file)
                    //recipeimgForCropperJS.style.display = 'none'
                } else {
                    setShowModal(false)
                }
            }
        }
    }, [uploadedFiles, imageIndex])

    useEffect(() => {
        if (recipeImgSrc) {
            setShowModal(true)
        }
    }, [recipeImgSrc])

    const fileUploaded = (event) => {
        setUploadedImage(event.target.value !== '')

        /* Begin Cropping */
        const recipeimgForCropperJS = document.querySelectorAll('img')
        setUploadedFiles(event.target.files)

        /* End of Cropping */
    }

    useEffect(() => {
        if (croppedImage) {
            setImageFiles(imageFiles.concat([croppedImage]))
            setCroppedImage()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [croppedImage])

    return !submitted ? (
        <div className="newRecipePage">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formRecipeName">
                    <Form.Control
                        className="textField"
                        type="text"
                        name="recipeName"
                        placeholder="Recipe name"
                        value={nameValue}
                        onChange={(event) => setNameValue(event.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="formCaption">
                    <Form.Control
                        className="textField"
                        type="text"
                        name="caption"
                        placeholder="Caption"
                        value={captionValue}
                        onChange={(event) =>
                            setCaptionValue(event.target.value)
                        }
                    />
                </Form.Group>
                <Form.Group controlId="formTags">
                    <InputGroup className="tagField">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="hashIcon">
                                <i>
                                    <Hash />
                                </i>
                            </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            placeholder="tag"
                            value={tagValue}
                            onChange={(event) =>
                                setTagValue(event.target.value)
                            }
                        />
                        <InputGroup.Append>
                            <Button
                                variant="outline-info"
                                onClick={addTag}
                                disabled={tagValue === ''}
                            >
                                Add Tag
                            </Button>
                        </InputGroup.Append>
                    </InputGroup>

                    {tags.map((tag, i) => (
                        <Button
                            className="mt-1 mr-1"
                            variant="secondary"
                            size="sm"
                            onClick={() => removeTag(i)}
                            key={i}
                        >
                            {'#' + tags[i]}
                        </Button>
                    ))}
                </Form.Group>
                <Form.Group controlId="formIngredientsSection">
                    <Form.Label className="newRecipeSubheading">
                        Ingredients
                    </Form.Label>
                    <AdditionalFields
                        className="ingredientFields"
                        placeholderText="Enter ingredient"
                        setFilledField={setFilledIngredientField}
                        values={ingredientValues}
                        setValues={setIngredientValues}
                    />
                </Form.Group>
                <Form.Group controlId="formInstructionsSection">
                    <Form.Label className="newRecipeSubheading">
                        Instructions
                    </Form.Label>
                    <AdditionalFields
                        className="instructionFields"
                        placeholderText="Enter instruction"
                        setFilledField={setFilledInstructionField}
                        values={instructionValues}
                        setValues={setInstructionValues}
                    />
                </Form.Group>
                <Form.Group controlId="formRecipeImage">
                    <Form.File
                        id="custom-file"
                        label="Upload recipe image (max. 5)"
                        multiple
                        onChange={fileUploaded}
                        onClick={clearUpload}
                        custom
                    />
                </Form.Group>
                <Button
                    block
                    variant="info"
                    className="submitButton"
                    type="submit"
                    onSubmit={handleSubmit}
                    disabled={emptyField}
                >
                    Post Recipe
                </Button>
                <img id="img" alt="" />
                {/* Crop Modal */}
                {recipeImgSrc ? (
                    <ImageCropModal
                        bsCustomFileInput={bsCustomFileInput}
                        setImgForUpload={setCroppedImage}
                        setUploadedImage={setUploadedImage}
                        imgsrc={recipeImgSrc}
                        show={showModal}
                        setShow={setShowModal}
                    />
                ) : (
                    <></>
                )}
            </Form>
        </div>
    ) : (
        <Redirect to={`/user-${props.user.slug}`} />
    )
}

// component for field with add field button that adds additional fields
// expects placeholderText (a string to be used as the placeholder for all text fields) as props
const AdditionalFields = (props) => {
    // state variables for number of fields and field values
    const [fieldCount, setFieldCount] = useState(1)

    // array for text field jsx elements
    const textFields = []

    useEffect(() => {
        props.setFilledField(
            props.values.reduce((acc, val) => val !== '' || acc, false)
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.values])

    // add another text field when add button is clicked
    const addField = () => {
        if (props.values[props.values.length - 1] !== '') {
            setFieldCount(fieldCount + 1)
            props.setValues(props.values.concat(['']))
        }
    }

    // update appropriate text field as user types into it
    const handleChange = (event, i) => {
        const temp = props.values.slice()
        temp[i] = event.target.value
        props.setValues(temp)
    }

    for (let i = 0; i < fieldCount; i++) {
        textFields.push(
            <InputGroup className="subsectionField mt-1" key={i}>
                <InputGroup.Prepend>
                    <InputGroup.Text className="subsectionFieldIcon" key={i}>
                        {props.placeholderText === 'Enter ingredient' ? (
                            <i>
                                <Dot />
                            </i>
                        ) : (
                            i + 1
                        )}
                    </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                    type="text"
                    name="recipeName"
                    placeholder={props.placeholderText}
                    value={props.values[i]}
                    onChange={(event) => handleChange(event, i)}
                />
            </InputGroup>
        )
    }

    return (
        <>
            {textFields}
            <Button
                className="mt-1"
                variant="outline-info"
                size="sm"
                onClick={addField}
                disabled={
                    props.values[fieldCount - 1] === '' || fieldCount === 30
                }
            >
                <i>
                    <Plus className="addFieldButton" />
                </i>
            </Button>
        </>
    )
}

export default NewRecipePage
