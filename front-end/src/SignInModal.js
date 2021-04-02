import Modal from 'react-bootstrap/Modal'
import SignInForm from './SignInForm'

import './SignInModal.css'


const SignInModal = (props) => {
  
    const handleClose = () => props.setShow(false)
  
    return (
      <>
        <Modal centered show={props.show} onHide={handleClose}>
          <Modal.Body className="signInModal"><SignInForm /></Modal.Body>
        </Modal>
      </>
    )
}
  
export default SignInModal