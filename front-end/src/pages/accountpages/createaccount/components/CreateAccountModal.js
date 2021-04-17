import Modal from 'react-bootstrap/Modal'
import CreateAccountPage from './CreateAccountPage'

import './CreateAccountModal.css'

const CreateAccountModal = (props) => {
    const handleClose = () => props.setShow(false)

    return (
        <>
            <Modal centered show={props.show} onHide={handleClose}>
                <Modal.Body className="createAccountModal">
                    <CreateAccountPage />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateAccountModal
