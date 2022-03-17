import './EditProfilePage.css'
import { useEffect, useState } from 'react'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import bsCustomFileInput from 'bs-custom-file-input'
import InputGroup from 'react-bootstrap/InputGroup'
import { At } from 'react-bootstrap-icons'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

import ImageCropModal from '../../../../gencomponents/ImageCropModal.js'

// TODO: Validate inputs

const EditProfilePage = (props) => {
    // State variables for each respective text field
    const [firstNameVal, setFirstNameVal] = useState('')
    const [lastNameVal, setLastNameVal] = useState('')
    const [userNameVal, setUserNameVal] = useState('')
    const [bioVal, setBioVal] = useState('')
    const [profilePic, setProfilePic] = useState('')

    const [usernameTakenMessage, setUsernameTakenMessage] = useState('')

    // State variable for image upload
    const [imageFile, setImageFile] = useState()

    // State for when form is submitted successfully
    const [submitted, setSubmitted] = useState(false)

    const [userLoaded, setUserLoaded] = useState(false)

    // state variable for showing image crop modal
    const [showModal, setShowModal] = useState(false)
    // state variable for setting user profile picture <img> src to send to cropperjs in modal
    const [userImgSrc, setUserImgSrc] = useState('')

    // wait for user to be fetched from server to load page
    useEffect(() => {
        if (props.user.username) {
            setFirstNameVal(props.user.firstName)
            setLastNameVal(props.user.lastName)
            setUserNameVal(props.user.username)
            setBioVal(props.user.bio)
            setProfilePic(props.user.imagePath)
            setUserLoaded(true)
        }
    }, [props.user])

    // Make post request on form submission
    const handleSubmit = (event) => {
        event.preventDefault()
        axios(
            `http://${process.env.REACT_APP_ORIGIN}/usernametaken?username=${userNameVal}`
        )
            .then((response) => {
                if (!response.data || userNameVal === props.user.username) {
                    const headers = {
                        'Content-Type': 'multipart/form-data'
                    }

                    const updatedUserInfo = new FormData()
                    updatedUserInfo.append(
                        'username',
                        userNameVal !== props.user.username ? userNameVal : ''
                    )
                    updatedUserInfo.append(
                        'firstName',
                        firstNameVal !== props.user.firstName
                            ? firstNameVal
                            : ''
                    )
                    updatedUserInfo.append(
                        'lastName',
                        lastNameVal !== props.user.lastName ? lastNameVal : '\n'
                    )
                    updatedUserInfo.append(
                        'bio',
                        bioVal !== props.user.bio ? bioVal : '\n'
                    )

                    updatedUserInfo.append('id', props.user._id)
                    updatedUserInfo.append('profilepicture', imageFile)
                    updatedUserInfo.append('oldImage', props.user.imagePath)

                    axios
                        .post(
                            `http://${process.env.REACT_APP_ORIGIN}/updateuserinfo`,
                            updatedUserInfo,
                            {
                                headers
                            }
                        )
                        .then((response) => {
                            props.setUser(response.data)
                            setSubmitted(true)
                        })
                } else {
                    setUsernameTakenMessage('Username is already taken')
                }
            })
            .catch((err) => console.error(err))
    }

    // function to allow user to re-upload/re-crop a photo
    // that they just cleared/uploaded
    const clearUpload = (event) => {
        event.target.value = ''
    }
    // Upload image file
    const fileUploaded = (event) => {
        const userImgForCropperJS = document.getElementById(
            'userimgforcropperjs'
        )
        const file = event.target.files[0]

        const reader = new FileReader()

        reader.addEventListener(
            'load',
            function () {
                // convert image file to base64 string for cropperJS <img> src
                setUserImgSrc(reader.result)
                setShowModal(true)
            },
            false
        )

        if (file) {
            reader.readAsDataURL(file)
            userImgForCropperJS.style.display = 'none'
        } else {
            setShowModal(false)
        }
    }

    useEffect(() => {
        if (imageFile) {
            // show new cropped profile pic once selected
            setProfilePic(URL.createObjectURL(imageFile))
        }
    }, [imageFile])

    // Ensure username field is not blank
    const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
    const [emptyUsernameMessage, setEmptyUsernameMessage] = useState('')
    const [isFirstNameEmpty, setIsFirstNameEmpty] = useState(false)
    const [emptyFirstNameMessage, setEmptyFirstNameMessage] = useState('')

    useEffect(() => {
        if (userLoaded) {
            setIsUsernameEmpty(!userNameVal)
            setIsFirstNameEmpty(!firstNameVal)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstNameVal, userNameVal])

    useEffect(() => {
        if (isUsernameEmpty === true)
            setEmptyUsernameMessage('Username required')
        if (isFirstNameEmpty === true)
            setEmptyFirstNameMessage('First name required')

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUsernameEmpty, isFirstNameEmpty])

    return !submitted ? (
        userLoaded ? (
            <>
                <div className="editProfilePageBody">
                    <Form
                        className="editProfilePageForm"
                        onSubmit={handleSubmit}
                    >
                        <Form.Group>
                            <div className="centerPhoto">
                                <img
                                    className="profilePic"
                                    src={profilePic}
                                    alt="Current Profile Avatar"
                                ></img>
                                <br />
                                <Form.File
                                    id="custom-file"
                                    className="uploadPhotoButton"
                                    label="Change Photo"
                                    onChange={fileUploaded}
                                    onClick={clearUpload}
                                    custom
                                />
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstNameVal}
                                onChange={(event) => {
                                    setFirstNameVal(event.target.value)
                                    setEmptyFirstNameMessage('')
                                }}
                            />
                            <Form.Text id="errorMessage" muted>
                                {emptyFirstNameMessage}
                            </Form.Text>

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
                                    onChange={(event) => {
                                        setUserNameVal(event.target.value)
                                        setUsernameTakenMessage('')
                                        setEmptyUsernameMessage('')
                                    }}
                                />
                            </InputGroup>
                            <Form.Text id="errorMessage" muted>
                                {usernameTakenMessage}
                                {emptyUsernameMessage}
                            </Form.Text>
                            <br />

                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={bioVal}
                                onChange={(event) =>
                                    setBioVal(event.target.value)
                                }
                            />
                            <br />

                            {/*to send to cropper modal*/}
                            <img id="userimgforcropperjs" alt="" />

                            <ImageCropModal
                                bsCustomFileInput={bsCustomFileInput}
                                setImgForUpload={setImageFile}
                                imgsrc={userImgSrc}
                                show={showModal}
                                setShow={setShowModal}
                            />

                            <Button
                                className="submitButton"
                                variant="info"
                                type="submit"
                                disabled={isUsernameEmpty || isFirstNameEmpty}
                            >
                                Save Changes
                            </Button>
                        </Form.Group>
                    </Form>
                </div>
            </>
        ) : (
            <></>
        )
    ) : (
        <Redirect to={`/user-${props.user.slug}`} />
    )
}

export default EditProfilePage
