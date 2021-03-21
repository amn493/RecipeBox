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
  var error = false
  var errorMessages = []

  function handleSubmit(event) {
    event.preventDefault()
  }

  const nameRegex = /^[a-z ,.'-]+$/i;
  const usernameRegex = /^[a-z._-]+$/i;
  const emailRegex = /^\S+@\S+\.\S+$/;

  function validateForm() {
    // Validate first and last name
    if (!nameRegex.test(firstName)) {
        error = true
        errorMessages.push('First name is empty or contains invalid characters.')
    }
    if (!nameRegex.test(lastName)) {
        error = true
        errorMessages.push('Last name is empty or contains invalid characters.')
    }
    
    // Validate username
    if (!usernameRegex.test(username)) {
        error = true
        errorMessages.push('Username is empty or contains invalid characters')
    }

    // Validate password
    if (password.length === 0) {
        error = true
        errorMessages.push('Password cannot be empty.')
    }
    if (password.length < 8) {
        error = true
        errorMessages.push('Password must be at least 8 characters.')
    }
    if (!(password === ReEnterPassword)) {
        error = true
        errorMessages.push('Passwords do not match.')
    }

    // Validate email
    if (!emailRegex.test(email)) {
        error = true
        errorMessages.push('Please enter a valid email.')
    }
    return !error
  }

  return (
    <div className='createAccount'>
      <p className={error ? 'errorMessage' : 'hidden'}>
          { errorMessages.map((message, errorIndex) => (
          <p key={errorIndex}>{message}</p>)) }
      </p>
      <Form onSubmit={handleSubmit}>
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
            type='reEnterPassword'
            placeholder='Re-enter Password'
            value={ReEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
          />
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
        <Button className='submit' type='submit' variant='outline-dark' disabled={!validateForm()}>
          Sign In
        </Button>
      </Form>
      <div className='redirectCreateAccount'>
        Already have an account?
      </div>
      <a className='signInLink' href='/sign-in'>Sign in</a>
    </div>
  )
}

export default CreateAccountPage