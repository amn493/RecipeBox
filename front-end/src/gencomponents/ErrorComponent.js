import './ErrorComponent.css'

import { EmojiFrown } from 'react-bootstrap-icons'

// props.error is a string that CAN be passed in to customize the error message
const ErrorComponent = (props) => {
    return (
        <div className="errorComponentContainer">
            <EmojiFrown className="errorComponentIcon" />

            <p className="errorComponentString">
                {
                    // use default error message if none is given
                    `${
                        props.error ||
                        'Looks like something went wrong! This page may be broken, or it may not exist.'
                    } `
                }
                <a className="errorComponentLink" href={props.url || '/'}>
                    {props.link || 'Return to homepage'}
                </a>
            </p>
        </div>
    )
}

export default ErrorComponent
