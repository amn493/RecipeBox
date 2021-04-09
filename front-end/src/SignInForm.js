import React, { useState } from 'react'
import axios from 'axios'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { Redirect } from 'react-router-dom'

import './SignInForm.css'

// Component for sign in form
// Does not expect any argument for props
// Example:
// <SignInForm />
const SignInForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [errorMessage, setErrorMessage] = useState('')

    const [signInCompleted, setSignInCompleted] = useState(false)

    const [error, setError] = useState(false)

    // check if either of the fields is empty
    const emptyField = () => {
        return username === '' || password === ''
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setError(false)
        setErrorMessage('')
        axios
            .post('http://localhost:4000/signin', {
                username: username,
                password: password
            })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token)
                    setSignInCompleted(true)
                }
            })
            .catch((err) => {
                setErrorMessage('Invalid username or password')
                setError(true)
            })
    }

    if (!signInCompleted) {
        return (
            <div className="signIn">
                <Form className="inputs">
                    <Form.Group className={error ? 'text-muted' : 'hidden'}>
                        <Form.Text>{errorMessage}</Form.Text>
                    </Form.Group>
                    <Form.Group className="username" controlId="username">
                        <Form.Control
                            size="md"
                            type="username"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="password" controlId="password">
                        <Form.Control
                            size="md"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button
                        className="submitButton"
                        onClick={handleSubmit}
                        variant="info"
                        block
                        disabled={emptyField()}
                    >
                        Sign In
                    </Button>
                </Form>
                <div className="redirectSignIn">Don't have an account?</div>
                <div className="createAccountDiv">
                    <a
                        className="createAccountLink text-info"
                        href="/create-account"
                    >
                        Create Account
                    </a>
                </div>
            </div>
        )
    } else {
        props.setSignedIn(true)
        return <Redirect to="/feed" />
    }
}

export default SignInForm
