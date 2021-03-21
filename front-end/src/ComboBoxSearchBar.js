import { useState, useMemo } from 'react'
import {matchSorter} from 'match-sorter'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
import "@reach/combobox/styles.css";
import './ComboBoxSearchBar.css'

//Component for a ComboBox search bar (A search bar with 3 columns for autofill suggestions that update as a user types)
//functional for searching recipe tags and users

//Expects a list of all tags available in database (tags), a list of all users available in the database (users), and 
//a boolean isTag, which, if true, prompts a user for tags, and if false, prompts a search for users

let listForSearch = [] //users or tags
let placeholder = "" //"@..." or "#..."

const ComboBoxSearchBar = (props) => {

    if(props.isTag === true) { // if isTag is true, this component is being used to search for tags
        listForSearch = props.tags
        placeholder="#..."
    } else{
        listForSearch = props.users
        placeholder="@..."
    }

    return(
        <div className="comboBox">
            <ComboBoxSearchResults setSelection={props.setSelection} />
        </div>
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
        <Combobox onSelect={handleSelect}>
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