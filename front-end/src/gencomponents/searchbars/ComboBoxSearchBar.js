import { useState, useMemo } from 'react'
import { matchSorter } from 'match-sorter'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption
} from '@reach/combobox'
import { InputGroup } from 'react-bootstrap'
import '@reach/combobox/styles.css'
import './ComboBoxSearchBar.css'
import { At, Hash } from 'react-bootstrap-icons'

//Component for a ComboBox search bar (A search bar with 3 columns for autofill suggestions that update as a user types)
//functional for searching recipe tags and users

//Expects a list of all tags available in database (tags), a list of all users available in the database (users), and
//a boolean isTag, which, if true, prompts a user for tags, and if false, prompts a search for users

const ComboBoxSearchBar = (props) => {
    return (
        <table className="comboBox">
            <tbody>
                <tr>
                    <td className="iconCell comboCell">
                        <InputGroup className="icon">
                            {props.isTag === true ? (
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="searchHashIcon">
                                        <i>
                                            <Hash />
                                        </i>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            ) : (
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="searchAtIcon">
                                        <i>
                                            <At />
                                        </i>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                            )}
                        </InputGroup>
                    </td>
                    <td className="comboCell">
                        <ComboBoxSearchResults
                            setSelection={props.setSelection}
                            listForSearch={
                                props.isTag ? props.tags : props.users
                            }
                            placeholder={props.isTag ? 'tag' : 'username'}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}

const ComboBoxSearchResults = (props) => {
    const useMatch = (term) => {
        return useMemo(
            () =>
                term.trim() === ''
                    ? null
                    : matchSorter(props.listForSearch, term, {
                          keys: [(item) => `${item}`]
                      }),
            [term]
        )
    }

    const [term, setTerm] = useState('')
    const results = useMatch(term)
    const handleChange = (event) => {
        setTerm(event.target.value)
    }

    const handleSelect = (item) => {
        //update the state variable with the selected value
        props.setSelection(item)

        //reset the text field
        setTerm('')
    }

    return (
        <Combobox className="comboSearchBar" onSelect={handleSelect}>
            <ComboboxInput
                className="comboBoxInput"
                placeholder={props.placeholder}
                value={term}
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
                        <span>No results found</span>
                    )}
                </ComboboxPopover>
            )}
        </Combobox>
    )
}

export default ComboBoxSearchBar
