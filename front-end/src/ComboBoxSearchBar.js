import { useState, useMemo } from 'react'
import {matchSorter} from 'match-sorter'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import { InputGroup } from 'react-bootstrap'
import "@reach/combobox/styles.css";
import './ComboBoxSearchBar.css'
import { At, Hash } from 'react-bootstrap-icons'

//Component for a ComboBox search bar (A search bar with 3 columns for autofill suggestions that update as a user types)
//functional for searching recipe tags and users

//Expects a list of all tags available in database (tags), a list of all users available in the database (users), and 
//a boolean isTag, which, if true, prompts a user for tags, and if false, prompts a search for users

let listForSearch = [] //users or tags
let placeholder = "" 

const ComboBoxSearchBar = (props) => {
    const adjacentIcon = () =>{
        return(
            props.isTag === true ?
                <InputGroup.Prepend>
                    <InputGroup.Text id="searchHashIcon"><i><Hash /></i></InputGroup.Text>
                </InputGroup.Prepend>
            
            :
    
                <InputGroup.Prepend>
                    <InputGroup.Text id="searchAtIcon"><i><At /></i></InputGroup.Text>
                </InputGroup.Prepend>
        )
    }

    if(props.isTag === true) { // if isTag is true, this component is being used to search for tags
        listForSearch = props.tags
        placeholder='e.g: "dairy"'
    } else{
        listForSearch = props.users
        placeholder="John Smith / username"
    }

    return(
        <table className="comboBox">
            <tr>
                <td className="iconCell comboCell">
                    <InputGroup className="icon">
                        {adjacentIcon()}
                    </InputGroup>
                </td>
                <td className="comboCell">
                    <ComboBoxSearchResults setSelection={props.setSelection} />
                </td>
            </tr>
        </table>
    )

}


const ComboBoxSearchResults = (props) => {

    const [term, setTerm] = useState('');
    const results = useMatch(term);
    const handleChange = (event) => setTerm(event.target.value);


    const handleSelect = (item) => {
        //update the state variable with the selected value
        props.setSelection(item)

        //reset the text field
        setTerm('')
    }


    return (
        <Combobox className="comboSearchBar" onSelect={handleSelect}>
            <ComboboxInput className="comboBoxInput" placeholder={placeholder} value={term}
                onChange={handleChange} 
            />
            {results && (
            <ComboboxPopover className="shadow-popup">
                {results.length > 0 ? (
                <ComboboxList className="comboBoxList">
                    {results.slice(0, 3).map((result, index) => (
                    <ComboboxOption
                        key={index}
                        value={`${result}`}
                    />
                  ))}
                </ComboboxList>
                ) : (
                <span>
                    No results found
                </span>
                )}
            </ComboboxPopover>
            )}
        </Combobox>
    )
}

const useMatch= (term) => {
    return useMemo(
        () => term.trim() === ""
            ? null
            : matchSorter(listForSearch, term, {
            keys: [(item) => `${item}`],
            }),
        [term]
    )
}

export default ComboBoxSearchBar;