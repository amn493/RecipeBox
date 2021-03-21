import './EditProfilePage.css'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// TODO: Validate inputs

const EditProfilePage = (props) => {
    return (
        <>
            <div className="centerPhoto">
                <img src={props.user.imagePath} alt="Current Profile Picture"></img>
                <br />
                <a href ="/">Change Photo</a>
            </div>

            <div className="editProfilePageBody">

                <Form className="editProfilePageForm">

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" value={props.user.firstName} />
                        <br />
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" value={props.user.lastName} />
                        <br/>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={"@" + props.user.username} />
                        <br />
                        <Form.Label>Bio</Form.Label>
                        <Form.Control as="textarea" rows={4} value={props.user.bio} />
                        <br />

                    </Form.Group>
                    <Button className ="submitButton" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default EditProfilePage