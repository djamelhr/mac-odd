import React, { useState, useEffect, useContext, useReducer } from "react";
import '../App.css';
import { ipcRenderer } from "electron";
import moment from "moment";
import Posts from "./Posts";
import Pagination from "./Pagination";
import RecentDate from "./RecentDate";



const initalState = {
  matchDay: '',
  matchs: [],
  recentDate: [],
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
    case 'resDate': {
      return {
        ...state,
        recentDate: action.payload
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




const App = () => {

  const [state, dispatch] = useReducer(getMatchs, initalState)
  const { matchDay, matchs, loading, currentPage, postsPerPage, noMatchs, recentDate } = state


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
  useEffect(() => {
    ipcRenderer.send("mainWindowLoaded");
    ipcRenderer.on("allMatchs", (e, data) => {
      if (data.length == 0) {
        dispatch({ type: 'noMacthAvialable' });
      }

      dispatch({ type: "newMatchs", payload: data })

    });
    ipcRenderer.on("resultSent", (e, data) => {
      console.log(data);
      dispatch({ type: "resDate", payload: data.recentDate })

    });
  }, [matchs, loading]);
  console.log(recentDate);
  const paginate = (pageNumber) => {
    dispatch({ type: "paginate", payload: pageNumber })

  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = matchs.slice(indexOfFirstPost, indexOfLastPost);
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
            <button className="btn btn-outline-dark" onClick={sendPup}>
              {" "}
              Start
            </button>
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
