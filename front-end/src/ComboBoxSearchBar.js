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
                <InputGroup.Prepend><InputGroup.Text id="basic-addon1"> {/* same bootstrap element used for keyword search icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hash" viewBox="0 0 16 16">
                    <path d="M8.39 12.648a1.32 1.32 0 0 0-.015.18c0 .305.21.508.5.508.266 0 .492-.172.555-.477l.554-2.703h1.204c.421 0 .617-.234.617-.547 0-.312-.188-.53-.617-.53h-.985l.516-2.524h1.265c.43 0 .618-.227.618-.547 0-.313-.188-.524-.618-.524h-1.046l.476-2.304a1.06 1.06 0 0 0 .016-.164.51.51 0 0 0-.516-.516.54.54 0 0 0-.539.43l-.523 2.554H7.617l.477-2.304c.008-.04.015-.118.015-.164a.512.512 0 0 0-.523-.516.539.539 0 0 0-.531.43L6.53 5.484H5.414c-.43 0-.617.22-.617.532 0 .312.187.539.617.539h.906l-.515 2.523H4.609c-.421 0-.609.219-.609.531 0 .313.188.547.61.547h.976l-.516 2.492c-.008.04-.015.125-.015.18 0 .305.21.508.5.508.265 0 .492-.172.554-.477l.555-2.703h2.242l-.515 2.492zm-1-6.109h2.266l-.515 2.563H6.859l.532-2.563z"/>
                </svg>               
                </InputGroup.Text></InputGroup.Prepend>
            
            :
    
                <InputGroup.Prepend><InputGroup.Text id="basic-addon1">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-at" viewBox="0 0 16 16">
                    <path d="M13.106 7.222c0-2.967-2.249-5.032-5.482-5.032-3.35 0-5.646 2.318-5.646 5.702 0 3.493 2.235 5.708 5.762 5.708.862 0 1.689-.123 2.304-.335v-.862c-.43.199-1.354.328-2.29.328-2.926 0-4.813-1.88-4.813-4.798 0-2.844 1.921-4.881 4.594-4.881 2.735 0 4.608 1.688 4.608 4.156 0 1.682-.554 2.769-1.416 2.769-.492 0-.772-.28-.772-.76V5.206H8.923v.834h-.11c-.266-.595-.881-.964-1.6-.964-1.4 0-2.378 1.162-2.378 2.823 0 1.737.957 2.906 2.379 2.906.8 0 1.415-.39 1.709-1.087h.11c.081.67.703 1.148 1.503 1.148 1.572 0 2.57-1.415 2.57-3.643zm-7.177.704c0-1.197.54-1.907 1.456-1.907.93 0 1.524.738 1.524 1.907S8.308 9.84 7.371 9.84c-.895 0-1.442-.725-1.442-1.914z"/>
                </svg>        
                </InputGroup.Text></InputGroup.Prepend>
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
        <div className="comboBox">
            {adjacentIcon()}
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