
import React, { useState, useEffect, useContext, useReducer } from "react";
import { ipcRenderer } from "electron";
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
const Tvg = () => {

    return (
        <div>djo</div>
    )


}

export default Tvg;