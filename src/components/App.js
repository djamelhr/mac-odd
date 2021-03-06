import React, { useState, useEffect, useContext, useReducer } from "react";
import '../App.css';
import { ipcRenderer } from "electron";
import moment from "moment";
import Posts from "./Posts";
import Pagination from "./Pagination";
import RecentDate from "./RecentDate";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Form, FormGroup } from 'reactstrap';



const initalState = {
  matchDay: '',
  matchs: [],
  recentDate: [],
  loading: false,
  currentPage: 1,
  postsPerPage: 10,
  noMatchs: false,
  range: '',
  spreadsheet_id: "",
  sheetId: 0,
  modal: false,
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
    // case 'resSheets': {
    //   return {
    //     ...state,
    //     sheetId: action.payload.id,
    //     range: action.payload.range,
    //     spreadsheet_id: action.payload.spreadsheet_id

    //   }
    // }

    case 'noMacthAvialable': {
      return {
        ...state,
        noMatchs: true

      }
    }
    case 'newMatchs': {
      return {
        ...state,
        loading: false,
        matchs: action.payload
      }
    }
    case 'resDate': {
      return {
        ...state,
        recentDate: action.payload.recentDate,
        sheetId: action.payload.sheets[2].id,
        range: action.payload.sheets[2].range,
        spreadsheet_id: action.payload.sheets[2].spreadsheet_id
      }
    }
    case 'paginate': {
      return {
        ...state,
        currentPage: action.payload
      }
    }
    case 'modal': {
      return {
        ...state,
        modal: action.payload
      }
    }



    default:
      break;
  }

}




const App = () => {

  const [state, dispatch] = useReducer(getMatchs, initalState)
  const { modal, sheetId, range, spreadsheet_id, matchDay, matchs, loading, currentPage, postsPerPage, noMatchs, recentDate } = state


  const toggle = () => dispatch({ type: 'modal', payload: !modal });

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const sendPup = () => {
    if (matchDay === "") {
      alert("pls type a date");
    } else {
      dispatch({ type: 'startScrapin' })
      let link = moment(matchDay).format("YYYYMMDD");
      ipcRenderer.send("pup", { link, matchDay });
    }
  };
  const changeOdds = () => {
    toggle()
    ipcRenderer.send("changeSheetOdds", { sheetId, range, spreadsheet_id });
  }



  useEffect(() => {
    ipcRenderer.send("mainWindowLoaded");
    ipcRenderer.on("allMatchs", (e, data) => {
      if (data.length == 0) {
        dispatch({ type: 'noMacthAvialable' });
      }
      dispatch({ type: "newMatchs", payload: data });
    });
    ipcRenderer.on("resultSentOdds", (e, data) => {
      console.log(data);
      dispatch({ type: "resDate", payload: data });
      // dispatch({ type: "resSheets", payload: data });
    });
  }, []);
  const paginate = (pageNumber) => {
    dispatch({ type: "paginate", payload: pageNumber })
  };


  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = matchs.slice(indexOfFirstPost, indexOfLastPost);
  console.log(matchs);
  return (
    <div>
      <div className="container-fluid">

        <div className="d-flex justify-content-center align-items-center  input-group  m-3">
          <form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
            <input
              className="form-control"
              value={matchDay}
              type="date"
              onChange={e => dispatch({ type: 'field', field: "matchDay", value: e.target.value })}
            ></input>
          </form>

          <div className="input-group-append">
            <button className="btn  btn-dark " onClick={sendPup}>
              {" "}
              Start
            </button>
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
        </div>
        <div className="row">
          <div className="col-10">
            <Posts matchs={currentPost} loading={loading} noMatchs={noMatchs} />
            <div className="fixed-bottom d-flex justify-content-center align-items-center">
              {" "}
              <Pagination
                postsPerPage={postsPerPage}
                totalPosts={matchs.length}
                paginate={paginate}
                loading={loading}
              ></Pagination>
            </div>
          </div>
          <div className="col-2">
            <RecentDate recentDate={recentDate} />
          </div>

        </div>


      </div>
    </div>
  );
};

export default App;
