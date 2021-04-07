import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './SignInForm.css'

// Component for sign in form
// Does not expect any argument for props
// Example:
// <SignInForm />
const SignInForm = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const error = false

    function handleSubmit(event) {
        event.preventDefault()
    }

    /* function validateForm() {
    return username.length > 0 && password.length > 0;
  } */

    return (
        <div className="signIn">
            <Form className="inputs" onSubmit={handleSubmit}>
                <Form.Group className={error ? 'text-muted' : 'hidden'}>
                    <Form.Text>
                        Sign in failed. Username or password is incorrect.
                    </Form.Text>
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
                    type="submit"
                    variant="info"
                    block /* disabled={!validateForm()} */
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
}

export default SignInForm
