import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import './CreateAccountPage.css'

// Create Account Page
// Does not expect any argument for props
// Example: 
// <CreateAccount />
const CreateAccountPage = (props) =>  {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [ReEnterPassword, setReEnterPassword] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  function handleSubmit(event) {
    event.preventDefault()
    setError(false)
    setErrorMessages([])
    validateForm()
  }

  function emptyField() {
    if (email.length === 0) {
      return true
    }
    if (firstName.length === 0) {
      return true
    }
    if (lastName.length === 0) {
      return true
    }
    if (username.length === 0) {
      return true
    }
    if (password.length === 0) {
      return true
    }
    if (ReEnterPassword.length === 0) {
      return true
    }
    return false
  }

  const emailRegex = /^\S+@\S+\.\S+$/
  const nameRegex = /^[a-z ,.'-]+$/i
  const usernameRegex = /^[a-z._-]+$/i
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/

  function validateForm() {
    // Validate email
    if (!emailRegex.test(email)) {
      setError = true
      setErrorMessages(errorMessages.concat(['Please enter a valid email.']))
    }
    
    // Validate first and last name
    if (!nameRegex.test(firstName)) {
        setError = true
        setErrorMessages(errorMessages.concat(['First name contains invalid characters.']))
    }
    if (!nameRegex.test(lastName)) {
      setError = true
      setErrorMessages(errorMessages.concat(['Last name contains invalid characters.']))
    }
    
    // Validate username
    if (!usernameRegex.test(username)) {
      setError = true
      setErrorMessages(errorMessages.concat(['Username contains invalid characters']))
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      setError = true
      setErrorMessages(errorMessages.concat(['Password must contain at least 8 characters, have 1 uppercase letter, ' + 
        '1 lowercase letter, and 1 number.']))
    }
    if (!(password === ReEnterPassword)) {
      setError = true
      setErrorMessages(errorMessages.concat(['Passwords do not match.']))
    }
  }

  return (
    <div className='createAccount'>
      <Form onSubmit={handleSubmit}>
      <Form.Group className={error ? 'text-muted' : 'hidden'}>
        <Form.Text>
            { errorMessages.map((message, errorIndex) => (
            <p key={errorIndex}>{message}</p>)) }
        </Form.Text>
      </Form.Group>
      <Form.Group className='formInput' controlId='email'>
          <Form.Control
            size='md'
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
      </Form.Group>
      <Form.Group className='formInput' controlId='firstName'>
          <Form.Control
            size='md'
            type='firstName'
            placeholder='First Name'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
      </Form.Group>
      <Form.Group className='formInput' controlId='lastName'>
          <Form.Control
            size='md'
            type='lastName'
            placeholder='Last Name'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='formInput' controlId='username'>
          <Form.Control
            size='md'
            type='username'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='formInput' controlId='password'>
          <Form.Control
            size='md'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='formInput' controlId='reEnterPassword'>
          <Form.Control
            size='md'
            type='password'
            placeholder='Re-enter Password'
            value={ReEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
          />
        </Form.Group>
        <Button className='submitButton' type='submit' variant='info' block disabled={emptyField}>
          Create Account
        </Button>
      </Form>
      <div className='redirectCreateAccount'>
        Already have an account?
      </div>
      <div className='signInDiv'>
        <a className='signInLink text-info' href='/sign-in'>Sign in</a>
      </div>
    </div>
  )
}

export default CreateAccountPage