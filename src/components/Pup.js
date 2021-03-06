import React, { useEffect, useState, useReducer } from "react";
import '../App.css';

import { ipcRenderer } from "electron";
import TableLinks from "./TableLinks"
import Paginationdb from "./Paginationdb";
import { Spinner, Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';

const initalState = {
  compte: 0,
  link: "",
  workbook: [],
  loading: false,
  stoping: false,
  loadingExcel: false,
  availablePays: false,
  availablePool: false,
  currentPage: 1,
  postsPerPage: 7,
  tableRightTop: [],
  tableRightBottom: [],
  tableCenterBottom: [],
  tableCenterTop: [],
  range: '',
  spreadsheet_id: "",
  sheetId: 0,
  modal: false,
}
function getHorses(state, action) {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value

      }
    }
    case 'stopScraping': {
      return {
        ...state,
        loading: false,
        stoping: false
      }
    }
    case 'startExcel': {
      return {
        ...state,
        loadingExcel: true
      }
    }
    case 'notValid': {
      return {
        ...state,
        link: ""
      }
    }

    case 'stopExcel': {
      return {
        ...state,
        loadingExcel: false
      }
    }
    case 'startSheet': {
      return {
        ...state,
        loading: true,

      }
    }
    case 'stopSheet': {
      return {
        ...state,
        loading: false,

      }
    }
    case 'startScraping': {
      return {
        ...state,
        loading: true,
        stoping: true
      }
    }
    case 'workbookAdd': {
      return {
        ...state,
        workbook: action.payload.result,
        sheetId: action.payload.sheets[0].id,
        range: action.payload.sheets[0].range,
        spreadsheet_id: action.payload.sheets[0].spreadsheet_id
      }
    }
    case 'noPays_NoPool': {
      return {
        ...state,
        loading: false,
        availablePays: true,
        availablePool: true
      }
    }
    case 'numberOfRepitition': {
      return {
        ...state,
        compte: action.payload
      }
    }
    case 'paginatedb': {
      console.log(action);

      return {
        ...state,
        currentPage: action.payload
      }
    }
    case 'Pool_noPays': {
      return {
        ...state,
        loading: false,
        availablePool: true,
        tableRightBottom: action.payload
      }
    }
    case 'modal': {
      return {
        ...state,
        modal: action.payload
      }
    }
    case 'Pool_Pays': {



      return {
        ...state,
        loading: false,
        tableRightBottom: action.payload.resultHorses[1],
        tableRightTop: action.payload.resultHorses[0]

      }
    }

    default:
      break;
  }


}

const Pup = () => {

  const [state, dispatch] = useReducer(getHorses, initalState)
  const {
    modal, sheetId, range, spreadsheet_id, workbook, compte, link, loading, stoping, currentPage, loadingExcel,
    postsPerPage, availablePays, availablePool, tableRightTop, tableRightBottom, tableCenterBottom, tableCenterTop, } = state

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const toggle = () => dispatch({ type: 'modal', payload: !modal });
  function handleClick(e) {
    e.preventDefault();
    ipcRenderer.send('openFile', e.target.href);

  }
  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
  }
  const addWorkBook = () => {
    if (!validURL(link)) {
      alert("Not a valid url");

    } else {
      ipcRenderer.send('addWorkBook', link);
    };


  }
  const changeOdds = () => {
    toggle()
    ipcRenderer.send("changeSheetOdds", { sheetId, range, spreadsheet_id });
  }
  const sendHorses = () => {

    if (!validURL(link.trim())) {
      dispatch({ type: "notValid" });
      alert("Not a valid url");

    }

    else {
      dispatch({ type: "startExcel" });
      ipcRenderer.send("horses", {
        link,

      });
    }
  };
  const sendGoogle = () => {
    if (!validURL(link.trim())) {
      alert("Not a valid url");

    }

    else {
      dispatch({ type: "startSheet" })
      ipcRenderer.send("GoogleRealTime", {
        link,
      });
    }
  };
  const stopSheet = () => {
    ipcRenderer.send("stopSheet");
    dispatch({ type: "stopSheet" });
  }

  useEffect(() => {
    ipcRenderer.send("mainWindowLoaded");
    ipcRenderer.on('workBook', (e, data) => {
      dispatch({ type: "workbookAdd", payload: data })
    });

    ipcRenderer.on("resultSentTvg", (e, data) => {
      dispatch({ type: "workbookAdd", payload: data })

    });
  }, []);

  const mystyle = {
    width: "130px",
    fontSize: "15px",
    padding: '5px'
  };
  const myNames = {
    fontSize: "80%",
    border: "none",
    borderBottom: "3px solid rgb(212, 212, 212)",
    color: "gris"

  };
  const myUrl = {
    fontSize: "10px",


  };
  const paginatedb = (pageNumber) => {
    dispatch({ type: "paginatedb", payload: pageNumber })

  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = workbook.slice(indexOfFirstPost, indexOfLastPost);

  return (

    <div className="  container">

      {loading && <Button color="danger" onClick={stopSheet} >Stop</Button>}


      <div className="d-flex justify-content-center  align-items-center  m-3">
        <div className="input-group-append">
          <button
            style={mystyle}
            className="btn btn-outline-dark btn-block form-control"
            onClick={sendGoogle}
          >
            {loading && <Spinner color="success" size="sm" />}     GoogleSheets
          </button>


        </div>
        <form
          className="form-inline"
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <input
            style={{ width: "500px" }}
            className="form-control"
            value={link}
            pattern="https?://.+"
            type="url"
            onChange={e => dispatch({ type: 'field', field: "link", value: e.target.value })}
          ></input>
        </form>

        <div className="input-group-append">
          <button
            style={mystyle}
            className="btn btn-outline-dark btn-block form-control"
            onClick={sendHorses}
          >
            {loadingExcel && <Spinner color="success" size="sm" />}     Genrate Excel
          </button>
        </div>
        <div>
          <Button color="success" onClick={toggle}>Range</Button>
          <Modal isOpen={modal} toggle={toggle} >
            <ModalHeader toggle={toggle}>Modal title</ModalHeader>
            <ModalBody>
              <Form >
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="exampleRange" className="mr-sm-2">Range</Label>
                  <Input type="text" name="range" value={range} id="exampleRange" placeholder=""
                    onChange={e => dispatch({ type: 'field', field: "range", value: e.target.value })}

                  />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                  <Label for="exampleSsheetId" className="mr-sm-2">spreadsheet_id</Label>
                  <Input type="text" name="spreadsheet_id" value={spreadsheet_id} id="exampleSsheetId" placeholder=""
                    onChange={e => dispatch({ type: 'field', field: "spreadsheet_id", value: e.target.value })}

                  />
                </FormGroup>

              </Form>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={changeOdds}>Save</Button>{' '}
              <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>

      <TableLinks workbook={currentPost} />
      <div className="fixed-bottom d-flex justify-content-center align-items-center">

        <Paginationdb
          postsPerPage={postsPerPage}
          totalPosts={workbook.length}
          paginatedb={paginatedb}
          loading={loading}
        ></Paginationdb>
      </div>
    </div>

  );
};

export default Pup;
