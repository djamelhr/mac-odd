
import React, { useState, useEffect, useContext, useReducer } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

import { ipcRenderer } from "electron";



const initalState = {
    sheets: [],
}
function getMatchs(state, action) {
    switch (action.type) {

        case 'field': {
            return {
                ...state,
                [action.field]: action.value

            }
        }
        case 'resSheets': {
            return {
                ...state,
                sheets: action.payload

            }
        }



        default:
            break;
    }

}
const Tvg = (props) => {
    const [state, dispatch] = useReducer(getMatchs, initalState)
    const { sheets } = state

    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);
    ipcRenderer.on("resultSent", (e, data) => {
        console.log(data);
        dispatch({ type: "resSheets", payload: data.sheets })

    });
    useEffect(() => {
        ipcRenderer.send("mainWindowLoaded");

    }, []);
    console.log(sheets);

    return (
        <div>djo</div>
    );



}




export default Tvg;