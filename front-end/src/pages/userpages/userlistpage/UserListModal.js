import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import { XCircleFill } from 'react-bootstrap-icons'

import UserList from './UserList.js'
import ErrorComponent from '../../../gencomponents/ErrorComponent.js'

import './UserListModal.css'

const UserListModal = (props) => {
    const [reqError, setReqError] = useState(false)

    const handleClose = () => {
        props.setShow(false)
        setReqError(false)
    }

    return (
        <Modal centered show={props.show} onHide={handleClose}>
            <Modal.Body className="userListModal">
                <button
                    className="closeModalButton text-info"
                    onClick={handleClose}
                >
                    <i>
                        <XCircleFill />
                    </i>
                </button>
                {!reqError ? (
                    <UserList
                        userBlocked={false}
                        pageType={'likers'}
                        dataFromSlug={props.comment}
                        setReqError={setReqError}
                    />
                ) : (
                    <ErrorComponent
                        error={'Looks like something went wrong!'}
                        link={' '}
                    />
                )}
            </Modal.Body>
        </Modal>
    )
}

export default UserListModal
