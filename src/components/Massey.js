import React, { useState, useEffect, useContext, useReducer } from "react";
import { ipcRenderer } from "electron";
import AutoComplete from './AutoComplete';
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import TableMassey from "./TableMassey";
import RecentSearch from "./RecentSearch"


const initalState = {
    matchDay: '',
    games: [],
    items: [

    ],
    recentSearch: [],
    searchCheck: {
        "string": "",
        "cached": true
    },
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
        case 'search': {
            return {
                ...state,
                searchCheck: {
                    "string": action.payload.string,
                    "cached": action.payload.cached
                }

            }
        }
        case 'noMacthAvialable': {
            return {
                ...state,
                noMatchs: true

            }
        }
        case 'leaguesGames': {
            return {
                ...state,
                games: action.payload.leagueTable,

            }
        }
        case 'leagues': {
            return {
                ...state,
                items: action.payload

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
        case 'res': {

            return {
                ...state,
                recentSearch: action.payload
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
    let { items, matchDay, games, loading, currentPage, postsPerPage, noMatchs, searchCheck, recentSearch } = state
    const onSubmit = (e) => {
        console.log(e);
        e.preventDefault();

    };

    const handleOnSearch = (string, cached) => {
        // onSearch returns the string searched and if
        // the values are cached. If the values are cached
        // "cached" contains the cached values, if not, returns false
        dispatch({ type: 'search', payload: { string, cached } })
        console.log("search", string, cached);
        //   return { string, cached }
        // matchDay = string
    }
    console.log(searchCheck);
    const handleOnSelect = item => {
        // the item selected
        dispatch({ type: 'search', payload: { "string": item.name, "cached": true } })

        console.log("select apré", matchDay);
        console.log("itemselect", item.name);
        matchDay = item.name;
    }

    const handleOnFocus = () => {
        console.log("Focused");
    }

    useEffect(() => {
        ipcRenderer.send("mainWindowLoaded");

        ipcRenderer.on("leaguesGames", (e, data) => {
            console.log(data);
            dispatch({
                type: "leaguesGames", payload: {
                    "leagueTable": data.leagueTable,
                }
            })
            dispatch({ type: 'search', payload: { "string": "", "cached": true } })

        });
        ipcRenderer.on("resultSent", (e, data) => {
            dispatch({ type: "res", payload: data.recentSearch })

        });
    }, []);
    ipcRenderer.on("resultSent", (e, data) => {
        dispatch({ type: "leagues", payload: data.leagues })

    });

    const sendPup = () => {
        console.log("sendPup", searchCheck.string);
        dispatch({ type: 'startScrapin' })
        ipcRenderer.send("masseya", searchCheck.string);
        //  dispatch({ type: 'search', payload: { "string": "", "cached": true } })

    };
    const addItem = (e) => {
        e.preventDefault();
        ipcRenderer.send("addItem", searchCheck.string);
        dispatch({ type: 'search', payload: { "string": "", "cached": true } })

    }
    console.log(recentSearch);
    const mystyle = {
        position: "relative",
        top: "150px"
    };
    const myabsolute = {
        position: "absolute",
        top: "80px",
        right: "0",

    };
    return (

        <div >
            <div className="container-fluid  "  >
                <div className="row "   >

                    <div style={{ zIndex: 2, position: "absolute", top: "50px" }} className="d-flex justify-content-center align-items-center  input-group  mb-3">
                        {!searchCheck.cached ? <div className="input-group-append">
                            <button type="submit" className="btn btn-outline-dark" onClick={addItem}>
                                {" "}
              Add
            </button>
                        </div> : ""}

                        <form className="m-3"
                            onSubmit={(e) => {
                                onSubmit(e);
                            }}
                        >
                            <div style={{ width: 400 }}>
                                <div >
                                    <ReactSearchAutocomplete
                                        items={items}

                                        onSearch={handleOnSearch}
                                        onSelect={handleOnSelect}
                                        onFocus={handleOnFocus}
                                        // onChange={e => dispatch({ type: 'field', field: "matchDay", value: e.target.value })}
                                        autoFocus
                                    />
                                </div>

                            </div>
                            {/* <input
                        className="form-control"
                        value={matchDay}
                        type=""
                        onChange={e => dispatch({ type: 'field', field: "matchDay", value: e.target.value })}
                    ></input> */}

                        </form>

                        <div className="input-group-append">
                            <button type="submit" className="btn btn-outline-dark" onClick={sendPup}>
                                {" "}
              Start
            </button>
                        </div>

                    </div>


                </div>


            </div>
            <div className="container-fluid" >
                <div className="row mt-5" >
                    <div className="col col-10">
                        <TableMassey games={games} />

                    </div>
                    <div className="col col-2">
                        <RecentSearch recentSearch={recentSearch} />
                    </div>
                </div>


            </div>
        </div>

    )
}

export default Massey;