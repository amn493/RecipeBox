import './ErrorComponent.css'

import { EmojiFrown } from 'react-bootstrap-icons'

// props.error is a string that CAN be passed in to customize the error message
const ErrorComponent = (props) => {
    // Declare error message for component if none is given
    let errorString =
        props.error ||
        'Looks like something went wrong! This page may be broken, or it may have been removed. '

    return (
        <div className="errorComponentContainer">
            <EmojiFrown className="errorComponentIcon" />

            <p className="errorComponentString">
                {errorString}
                <a className="errorComponentLink" href="/feed">
                    Return to feed page
                </a>
                .
            </p>
        </div>
    )
}

export default ErrorComponent
