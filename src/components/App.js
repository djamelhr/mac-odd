import React, { useState, useEffect, useContext, useReducer } from "react";
import { ipcRenderer } from "electron";
import moment from "moment";
import Posts from "./Posts";
import Nav from "./Nav";

import Pagination from "./Pagination";


const initalState = {
  matchDay :'',
  matchs:[],
  loading: false ,
  currentPage :1,
  postsPerPage : 10,
  noMatchs:false
}
function getMatchs(state,action){
switch (action.type) {
  case 'startScrapin':{
    return{
      ...state,
      loading:true,
      currentPage:1 ,
      noMatchs:false

    }
  }
  case 'field':{
    return{
      ...state,
      [action.field]: action.value

    }
  }
  case 'noMacthAvialable':{
    return{
     ...state,
     noMatchs:true
     
    }
  }
  case 'newMatchs':{
    console.log(action);

    return{
     ...state,
     loading:false,
     matchs :action.payload 
    }
  }
  case 'paginate':{
    console.log(action);
    
    return{
      ...state ,
      currentPage : action.payload
    }
  }
    break;

  default:
    break;
}

}




const App = () => {

   const [state , dispatch]= useReducer(getMatchs,initalState)
   const   {matchDay,matchs,loading,currentPage,postsPerPage,noMatchs} = state
  

  const onSubmit = (e) => {
    e.preventDefault();
  };
  const sendPup = () => {
    if (matchDay === "") {
      alert("pls type a date");
    } else {
      dispatch({type:'startScrapin'})
      let link = moment(matchDay).format("YYYYMMDD");
      ipcRenderer.send("pup", link);
    }
  };
  useEffect(() => {
    ipcRenderer.on("allMatchs", (e, data) => {
      if (data.length == 0) {
      dispatch({type:'noMacthAvialable'});  
      }
        
      dispatch( {type : "newMatchs",payload:data} )
      
    });
  }, [matchs,loading]);
  const paginate = (pageNumber) => {
    dispatch( {type : "paginate",payload:pageNumber} )

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
              onChange={e =>dispatch({type : 'field',field :"matchDay",value:e.target.value})}
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
