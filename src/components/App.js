import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import moment from "moment";
import Posts from "./Posts";
import Nav from "./Nav";

import Pagination from "./Pagination";
const App = () => {
  const [matchDay, setMatchDay] = useState("");
  const [matchs, setMatchs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [noMatchs, setNoMatchs] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const sendPup = () => {
    if (matchDay === "") {
      alert("pls type a date");
    } else {
      setLoading(true);
      setCurrentPage(1);
      setNoMatchs(false);
      let link = moment(matchDay).format("YYYYMMDD");
      ipcRenderer.send("pup", link);
    }
  };
  useEffect(() => {
    ipcRenderer.on("allMatchs", (e, data) => {
      if (data.length == 0) {
        setNoMatchs(true);
      }
      setMatchs(data);
      setLoading(false);
    });
  }, [matchs]);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPost = matchs.slice(indexOfFirstPost, indexOfLastPost);
  return (
    <div className="app">
      <div className="container">
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
              onChange={(e) => setMatchDay(e.target.value)}
            ></input>
          </form>

          <div className="input-group-append">
            <button className="btn btn-outline-dark" onClick={sendPup}>
              {" "}
              Start
            </button>
          </div>
        </div>

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
    </div>
  );
};

export default App;
