import React, { useState } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

import './CreateAccountPage.css'

// Create Account Page
// Does not expect any argument for props
// Example:
// <CreateAccount />
const CreateAccountPage = (props) => {
    const [email, setEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [ReEnterPassword, setReEnterPassword] = useState('')

    const [initialEmail, setInitialEmail] = useState(true)
    const [initialFirstName, setInitialFirstName] = useState(true)
    const [initialLastName, setInitialLastName] = useState(true)
    const [initialUsername, setInitialUsername] = useState(true)
    const [initialPassword, setInitialPassword] = useState(true)
    const [initialReEnterPassword, setInitialReEnterPassword] = useState(true)

    const [usernameTakenMessage, setUsernameTakenMessage] = useState('')

    const [createAccountCompleted, setCreateAccountCompleted] = useState(false)

    // check if any of the fields are empty
    const emptyFieldOrInvalid = () => {
        return (
            email === '' ||
            firstName === '' ||
            lastName === '' ||
            username === '' ||
            password === '' ||
            ReEnterPassword === '' ||
            validateEmail() ||
            validateFirstName() ||
            validateLastName() ||
            validateUsername() ||
            validatePassword() ||
            validateReEnterPassword()
        )
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        axios
            .post(`https://${process.env.REACT_APP_ORIGIN}/createaccount`, {
                username: username,
                password: password,
                email: email,
                firstName: firstName,
                lastName: lastName
            })
            .then((response) => {
                localStorage.setItem('token', response.data.token)
                setCreateAccountCompleted(true)
            })
            .catch((err) => {
                setUsernameTakenMessage('Username is already taken')
            })
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    const nameRegex = /^[a-z ,.'-]+$/i
    const usernameRegex = /^[a-z._0-9-]+$/i
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/

    function validateEmail() {
        if (email.length === 0) {
            return 'Email cannot be empty'
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email'
        }
        return false
    }

    function validateFirstName() {
        if (firstName.length === 0) {
            return 'First name cannot be empty'
        }
        if (!nameRegex.test(firstName)) {
            return 'First name contains invalid characters'
        }
        return false
    }

    function validateLastName() {
        if (lastName.length === 0) {
            return 'Last name cannot be empty'
        }
        if (!nameRegex.test(lastName)) {
            return 'Last name contains invalid characters'
        }
        return false
    }

    function validateUsername() {
        if (username.length === 0) {
            return 'Username cannot be empty'
        }
        if (!usernameRegex.test(username)) {
            return 'Username contains invalid characters'
        }
        if (usernameTakenMessage !== '') {
            return usernameTakenMessage
        }
        return false
    }

    function validatePassword() {
        if (password.length === 0) {
            return 'Password cannot be empty'
        }
        if (!passwordRegex.test(password)) {
            return (
                'Password must contain at least 8 characters, 1 uppercase letter, ' +
                '1 lowercase letter, and 1 number'
            )
        }
        return false
    }

    function validateReEnterPassword() {
        if (ReEnterPassword.length === 0) {
            return 'Must re-enter password'
        }
        if (!(password === ReEnterPassword)) {
            return 'Passwords do not match'
        }
        return false
    }

    if (!createAccountCompleted) {
        return (
            <div className="createAccount">
                <Form>
                    <Form.Group className="formInput" controlId="email">
                        <Form.Control
                            required
                            aria-label="Email"
                            size="md"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setInitialEmail(false)
                            }}
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialEmail ? validateEmail() : ''}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="formInput" controlId="firstName">
                        <Form.Control
                            required
                            aria-label="First Name"
                            size="md"
                            type="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => {
                                setFirstName(e.target.value)
                                setInitialFirstName(false)
                            }}
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialFirstName ? validateFirstName() : ''}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="formInput" controlId="lastName">
                        <Form.Control
                            required
                            aria-label="Last Name"
                            size="md"
                            type="lastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => {
                                setLastName(e.target.value)
                                setInitialLastName(false)
                            }}
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialLastName ? validateLastName() : ''}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="formInput" controlId="username">
                        <Form.Control
                            required
                            aria-label="Username"
                            size="md"
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value)
                                setInitialUsername(false)
                                setUsernameTakenMessage('')
                            }}
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialUsername ? validateUsername() : ''}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="formInput" controlId="password">
                        <Form.Control
                            required
                            aria-label="Password"
                            size="md"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                                setInitialPassword(false)
                            }}
                            aria-describedby="passwordHelp"
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialPassword ? validatePassword() : ''}
                        </Form.Text>
                    </Form.Group>
                    <Form.Group
                        className="formInput"
                        controlId="reEnterPassword"
                    >
                        <Form.Control
                            required
                            aria-label="Re-enter Password"
                            size="md"
                            type="password"
                            placeholder="Re-enter Password"
                            value={ReEnterPassword}
                            onChange={(e) => {
                                setReEnterPassword(e.target.value)
                                setInitialReEnterPassword(false)
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    handleSubmit(event)
                                }
                            }}
                        />
                        <Form.Text id="errorMessage" muted>
                            {!initialReEnterPassword
                                ? validateReEnterPassword()
                                : ''}
                        </Form.Text>
                    </Form.Group>
                    <Button
                        className="submitButton"
                        variant="info"
                        onClick={handleSubmit}
                        block
                        disabled={emptyFieldOrInvalid()}
                    >
                        Create Account
                    </Button>
                </Form>
                <div className="redirectCreateAccount">
                    Already have an account?
                </div>
                <div className="signInDiv">
                    <a className="signInLink text-info" href="/sign-in">
                        Sign in
                    </a>
                </div>
            </div>
        )
    } else {
        props.setSignedIn(true)
        return <Redirect to="/edit-profile" />
    }
}

export default CreateAccountPage
