import React from 'react';

import { ReactSearchAutocomplete } from "react-search-autocomplete";

function AutoComplete() {

    const items = [
        {
            id: 0,
            name: "Cobol",
        },
        {
            id: 1,
            name: "JavaScript"
        },
        {
            id: 2,
            name: "Basic"
        },
        {
            id: 3,
            name: "PHP"
        },
        {
            id: 4,
            name: "Java"
        },
    ]

    const handleOnSearch = (string, cached) => {
        // onSearch returns the string searched and if
        // the values are cached. If the values are cached
        // "cached" contains the cached values, if not, returns false
        console.log(string, cached);
    }

    const handleOnSelect = item => {
        // the item selected
        console.log(item);
    }

    const handleOnFocus = () => {
        console.log("Focused");
    }

    return (
        <div className="App">
            <header className="App-header">
                <div style={{ width: 400 }}>
                    <ReactSearchAutocomplete
                        items={items}
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        onFocus={handleOnFocus}
                        autoFocus
                    />
                </div>
            </header>
        </div>
    );
}

export default AutoComplete;