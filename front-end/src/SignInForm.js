import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './SignInForm.css';

// Component for sign in form
// Does not expect any argument for props
// Example: 
// <SignInForm />
const SignInForm = (props) =>  {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const error = false;

  function handleSubmit(event) {
    event.preventDefault();
  }

  /*function validateForm() {
    return username.length > 0 && password.length > 0;
  }*/

  return (
    <div className='signIn'>
      <p className={error ? 'errorMessage' : 'hidden'}>Sign in failed. Username or password is incorrect.</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className='username' controlId='username'>
          <Form.Control
            size='lg'
            type='username'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <Button className='submitButton' type='submit' variant='info' block /*disabled={!validateForm()}*/>
          Sign In
        </Button>
      </Form>
      <div className='redirectSignIn'>
        Don't have an account?
      </div>
      <a className='createAccountLink' href='/create-account'>Create Account</a>
    </div>
  );
}

export default SignInForm