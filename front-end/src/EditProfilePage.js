import './EditProfilePage.css'
import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import InputGroup from 'react-bootstrap/InputGroup'
import { At } from 'react-bootstrap-icons'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

// TODO: Validate inputs

const EditProfilePage = (props) => {
    // State variables for each respective text field
    const [firstNameVal, setFirstNameVal] = useState(props.user.firstName)
    const [lastNameVal, setLastNameVal] = useState(props.user.lastName)
    const [userNameVal, setUserNameVal] = useState(props.user.username)
    const [bioVal, setBioVal] = useState(props.user.bio)

    // State variable for image upload
    const [imageFile, setImageFile] = useState()

    // State for when form is submitted successfully
    const [submitted, setSubmitted] = useState(false)

    // Make post request on form submission
    const handleSubmit = (event) => {
        event.preventDefault()

        const headers = {
            'Content-Type': 'multipart/form-data'
        }

        const updatedUserInfo = new FormData()
        updatedUserInfo.append('username', userNameVal)
        updatedUserInfo.append('firstName', firstNameVal)
        updatedUserInfo.append('lastName', lastNameVal)
        updatedUserInfo.append('bio', bioVal)
        updatedUserInfo.append('id', props.user.id)
        updatedUserInfo.append('profilepicture', imageFile)

        axios
            .post('http://localhost:4000/updateuserinfo', updatedUserInfo, {
                headers
            })
            .then((response) => setSubmitted(true))
    }

    // Display file name when uploaded [taken from NewRecipePage.js]
    useEffect(() => {
        bsCustomFileInput.init()
    }, [])

    // Upload image file
    const fileUploaded = (event) => {
        setImageFile(event.target.files[0])
    }

    // Ensure username field is not blank
    const [isAnyNameEmpty, setIsAnyNameEmpty] = useState(false)
    const [emptyNameError, setEmptyNameError] = useState({ value: '' })

    useEffect(() => {
        setIsAnyNameEmpty(!userNameVal || !firstNameVal)
    }, [firstNameVal, userNameVal])

    useEffect(() => {
        if (isAnyNameEmpty)
            setEmptyNameError({
                value: (
                    <>
                        <div className="errorCode">
                            Username and first name required!
                        </div>
                    </>
                )
            })
        else setEmptyNameError({ value: '' })
    }, [isAnyNameEmpty])

    return !submitted ? (
        <>
            <div className="editProfilePageBody">
                <Form className="editProfilePageForm" onSubmit={handleSubmit}>
                    <Form.Group>
                        <div className="centerPhoto">
                            <img
                                src={props.user.imagePath}
                                alt="Current Profile Avatar"
                            />
                            <br />
                            <Form.File
                                id="custom-file"
                                className="uploadPhotoButton"
                                label="Change Photo"
                                onChange={fileUploaded}
                                custom
                            />
                        </div>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstNameVal}
                            onChange={(event) =>
                                setFirstNameVal(event.target.value)
                            }
                        />

                        <br />
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastNameVal}
                            onChange={(event) =>
                                setLastNameVal(event.target.value)
                            }
                        />
                        <br />

                        <Form.Label>Username</Form.Label>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text id="atIcon">
                                    <i>
                                        <At />
                                    </i>
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                type="text"
                                value={userNameVal}
                                onChange={(event) =>
                                    setUserNameVal(event.target.value)
                                }
                            />
                        </InputGroup>
                        <br />

                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={bioVal}
                            onChange={(event) => setBioVal(event.target.value)}
                        />
                        <br />

                        {emptyNameError.value}
                        <Button
                            className="submitButton"
                            variant="info"
                            type="submit"
                            disabled={isAnyNameEmpty}
                        >
                            Save Changes
                        </Button>
                    </Form.Group>
                </Form>
            </div>
        </>
    ) : (
        <Redirect to={`/user-${props.user.slug}`} />
    )
}

export default EditProfilePage
