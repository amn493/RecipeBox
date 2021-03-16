import './Timestamp.css'

const Timestamp = (props) => {

    // function for computing time difference between createdAt and current time in the largest possible unit of time
    const getDate = (date1, date2) => {
        const milliseconds = date2 - date1
        const seconds = Math.floor(milliseconds / 1000)
        if(seconds < 60) return seconds + ((seconds === 1) ? ' second ago' : ' seconds ago')
        
        const minutes = Math.floor(seconds / 60)
        if(minutes < 60) return minutes + ((minutes === 1) ? ' minute ago' : ' minutes ago')
       
        const hours = Math.floor(minutes / 60)
        if(hours < 24) return hours + ((hours === 1) ? ' hour ago' : ' hours ago')
        
        const days = Math.floor(hours / 24)
        if(days < 7) return days + ((days === 1) ? ' day ago' : ' days ago')
        
        return new Date(date1).toString().split(' ').slice(1, 4).reduce((acc, value, i) => (i === 2) ? acc + ', ' + value : acc + ' ' + value, '')
    }

    return (
        <div className="timestamp">
            {getDate(props.createdAt, Date.now())}
        </div>
    )
}

export default Timestamp