import Modal from 'react-bootstrap/Modal'
import CreateAccountPage from '../pages/accountpages/createaccount/CreateAccountPage.js'

import './CreateAccountModal.css'

const CreateAccountModal = (props) => {
    const handleClose = () => props.setShow(false)

    return (
        <>
            <Modal centered show={props.show} onHide={handleClose}>
                <Modal.Body className="createAccountModal">
                    <CreateAccountPage
                        user={props.user}
                        setSignedIn={props.setSignedIn}
                    />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateAccountModal
