import React, { useState, useEffect, useContext, useReducer } from "react";
import { ipcRenderer } from "electron";
import AutoComplete from './AutoComplete';
import { ReactSearchAutocomplete } from "react-search-autocomplete";


const initalState = {
    matchDay: '',
    matchs: [],
    items: [
        {
            id: 0,
            name: "ukraine-premier",
        },
        {
            id: 1,
            name: "germany-bundesliga-1"
        },
        {
            id: 2,
            name: "espain-la-liga"
        },
        {
            id: 3,
            name: "italy-serie-a"
        },
        {
            id: 4,
            name: "mls"
        },
    ],
    loading: false,
    currentPage: 1,
    postsPerPage: 10,
    noMatchs: false
}
function getMatchs(state, action) {
    switch (action.type) {
        case 'startScrapin': {
            return {
                ...state,
                loading: true,
                currentPage: 1,
                noMatchs: false

            }
        }
        case 'field': {
            return {
                ...state,
                [action.field]: action.value

            }
        }
        case 'noMacthAvialable': {
            return {
                ...state,
                noMatchs: true

            }
        }
        case 'newMatchs': {
            console.log(action);

            return {
                ...state,
                loading: false,
                matchs: action.payload
            }
        }
        case 'paginate': {
            console.log(action);

            return {
                ...state,
                currentPage: action.payload
            }
        }
            break;

        default:
            break;
    }

}
const Massey = () => {



    const [state, dispatch] = useReducer(getMatchs, initalState)
    let { items, matchDay, matchs, loading, currentPage, postsPerPage, noMatchs } = state
    const onSubmit = (e) => {
        console.log("submit");
        e.preventDefault();

    };

    const handleOnSearch = (string, cached) => {
        // onSearch returns the string searched and if
        // the values are cached. If the values are cached
        // "cached" contains the cached values, if not, returns false
        console.log("fer", string, cached);
    }

    const handleOnSelect = item => {
        // the item selected
        console.log("couco+u", item.name);
        matchDay = item.name;
    }

    const handleOnFocus = () => {
        console.log("Focused");
    }
    const sendPup = () => {
        console.log("hello", matchDay);
        dispatch({ type: 'startScrapin' })
        ipcRenderer.send("masseya", matchDay);

    };

    return (


        <div className="container">
            <div className="d-flex justify-content-center align-items-center  input-group  m-3">
                <form
                    onSubmit={(e) => {
                        onSubmit(e);
                    }}
                >
                    <div style={{ width: 400 }}>
                        <ReactSearchAutocomplete
                            items={items}
                            onSearch={handleOnSearch}
                            onSelect={handleOnSelect}
                            onFocus={handleOnFocus}
                            onChange={e => dispatch({ type: 'field', field: "matchDay", value: e.target.value })}
                            autoFocus
                        />
                    </div>
                    {/* <input
                        className="form-control"
                        value={matchDay}
                        type=""
                        onChange={e => dispatch({ type: 'field', field: "matchDay", value: e.target.value })}
                    ></input> */}
                </form>

                <div className="input-group-append">
                    <button className="btn btn-outline-dark" onClick={sendPup}>
                        {" "}
              Start
            </button>
                </div>


            </div>
        </div>
    )
}

export default Massey;