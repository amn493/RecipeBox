import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './SignInForm.css';

// Component for sign in form
// Does not expect any argument for props
// Example: 
// <SignInForm />
const SignInForm = (props) =>  {
  const [username, setusername] = useState('');
  const [password, setPassword] = useState('');

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <div className='signIn'>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='username' controlId='username'>
          <Form.Control
            size='lg'
            type='username'
            placeholder='Username'
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='password' controlId='password'>
          <Form.Control
            size='lg'
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className='submit' type='submit' variant='outline-dark' disabled={!validateForm()}>
          Sign In
        </Button>
      </Form>
      <div className='redirectSignIn'>
        Don't have an account? <a className='createAccountLink' href='/createaccount'>Create Account</a>
      </div>
    </div>
  );
}

export default SignInForm