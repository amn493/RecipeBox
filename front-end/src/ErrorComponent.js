import './ErrorComponent.css'

import { EmojiFrown } from 'react-bootstrap-icons'

// props.error is a string that CAN be passed in to customize the error message
const ErrorComponent = (props) => {
    // Declare error message for component if none is given
    const errorString = props.error || 'Sorry, something went wrong!'

    return (
        <div className="errorComponentContainer">
            <EmojiFrown className="errorComponentIcon" />

            <p className="errorComponentString">{errorString}</p>
        </div>
    )
}

export default ErrorComponent
