import './Number.css'

const Number = (props) => {
    const formatNumber = (number) => {
        // under one thousand
        if (number < 1000) {
            return `${number}`
        }
        // thousands
        else if (number < 1000000) {
            const rounded = `${number / 1000}`
            return `${
                rounded.indexOf('.') !== -1
                    ? rounded.slice(0, rounded.indexOf('.') + 2)
                    : rounded
            }K`
        }
        // millions
        else if (number < 1000000000) {
            const rounded = `${number / 1000000}`
            return `${
                rounded.indexOf('.') !== -1
                    ? rounded.slice(0, rounded.indexOf('.') + 2)
                    : rounded
            }M`
        }
        // billions
        else if (number < 1000000000000) {
            const rounded = `${number / 1000000000}`
            return `${
                rounded.indexOf('.') !== -1
                    ? rounded.slice(0, rounded.indexOf('.') + 2)
                    : rounded
            }B`
        }
        // probably won't ever have numbers this large
        else {
            return `${number}`
        }
    }

    return <>{formatNumber(props.number)}</>
}

export default Number
