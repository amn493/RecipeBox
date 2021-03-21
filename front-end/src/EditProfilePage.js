import './EditProfilePage.css'

import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

// TODO: Validate inputs

const EditProfilePage = (props) => {
    return (
        <>
            <div className="editProfilePageBody">
                <img src={props.user.imagePath} alt="Current Profile Picture"></img>
                <br />
                <a href ="/">Change Photo</a>

                <Form className="editProfilePageForm">

                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder={props.user.firstName} />
                        <br />
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder={props.user.lastName} />
                        <br/>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder={"@" + props.user.username} />
                        <br />
                        <Form.Control as="textarea" rows={4} placeholder={props.user.bio} />
                        <br />

                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </>
    )
}

export default EditProfilePage