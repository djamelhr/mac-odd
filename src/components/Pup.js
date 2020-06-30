import React, { useEffect, useState,useReducer } from "react";
import { ipcRenderer } from "electron";
import HoresTables from "./HoresTables";
import HoresTablesBottom from "./HoresTablesBottom";

const initalState = {
  compte:0,
  link :"",
  loading :false ,
  stoping :false ,
  availablePays : false ,
  availablePool :false,
  tableRightTop :[],
  tableRightBottom:[],
  tableCenterBottom:[],
  tableCenterTop:[],
}
function getHorses(state,action){
   switch (action.type) {
    case 'field':{
      return{
        ...state,
        [action.field]: action.value
  
      }
    }
    case 'stopScraping':{
      return{
        ...state,
       loading : false ,
       stoping :false 
      }
    }
    case 'startScraping':{
      return{
        ...state,
       loading : true ,
       stoping : true
      }
    }

    case 'noPays_NoPool':{
      return{
        ...state,
       loading : false ,
       availablePays:true,
       availablePool:true
      }
    }
    case 'numberOfRepitition':{
      return{
        ...state,
        compte:action.payload
      }
    }
    case 'Pool_noPays':{
      return{
        ...state,
       loading : false ,
       availablePool:true,
       tableRightBottom :action.payload
      }
    }
    case 'Pool_Pays':{
      console.log(action.payload);
      
      return{
        ...state,
       loading : false ,
       tableRightBottom :action.payload.resultHorses[1],
       tableRightTop : action.payload.resultHorses[0]

      }
    }
   
     default:
       break;
   }


}

const Pup = () => {

  const [state , dispatch]= useReducer(getHorses,initalState)
  const {
    compte, link, loading,stoping,availablePays,availablePool,tableRightTop,tableRightBottom,tableCenterBottom,tableCenterTop,} = state
  
  const onSubmit = (e) => {
    e.preventDefault();
  };
  const sendHorses = () => {
    let datahorses = {
      link,
      j: 0,
    };
    if (link === "") {
      alert("empty");
      return;
    }
    if (stoping) {
      ipcRenderer.send(
        "horses",
        (datahorses = {
          link: null,
          j: -1,
        })
      );
      dispatch( {type : "stopScraping"} )
    } else {
      dispatch( {type : "startScraping"} )
      
      ipcRenderer.send("horses", datahorses);
    }
  };
  useEffect(() => {
    let isSubscribed = true;
    ipcRenderer.on("index",(e,i)=>{
      if(isSubscribed){
        dispatch( {type : "numberOfRepitition",payload:i} )
      }
      
    })
    ipcRenderer.on("horses", (e, data) => {
      console.log(data);
      console.log(data.resultHorses.length);
      if(isSubscribed){
        if (data.resultHorses.length == 0) {
          dispatch( {type : "noPays_NoPool"} ) //no one exist
          } else if (data.resultHorses.length == 1) {
            
    
            dispatch( {type : "Pool_noPays",payload:data.resultHorses[0]} )
    
             //this case table bottom exist and top no
          } else {
    
            dispatch( {type : "Pool_Pays",payload:data} )
        
          } 
      }
     
    });
    return () => isSubscribed = false;
  }, [tableRightTop]);

  console.log(tableRightTop);

  return (
    <div className="container">
      <div className="d-flex justify-content-center  align-items-center  m-3">
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
            type="text"
            onChange={e =>dispatch({type : 'field',field :"link",value:e.target.value})}
          ></input>
        </form>

        <div className="input-group-append">
          <button
          style={{ width: "100px" }}
            className="btn btn-outline-dark btn-block form-control"
            onClick={sendHorses}
          >
            {stoping ? `Stop ${compte}`  : "Start"}
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 m-2">
          <HoresTables
            tableRightTop={tableRightTop}
            loading={loading}
            availablePays={availablePays}
          />
        </div>

        <div className="col-md-8">
          <HoresTablesBottom
            tableRightBottom={tableRightBottom}
            loading={loading}
            availablePays={availablePool}
          />
        </div>
      </div>
    </div>
  );
};

export default Pup;
