import React, { useEffect, useState,useReducer } from "react";
import { ipcRenderer } from "electron";
import HoresTables from "./HoresTables";
import HoresTablesBottom from "./HoresTablesBottom";

const initalState = {
  compte:0,
  link :"",
  workbook:[],
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
    case 'workbookAdd':{
      return{
        ...state,
       workbook:action.payload
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
   workbook, compte, link, loading,stoping,availablePays,availablePool,tableRightTop,tableRightBottom,tableCenterBottom,tableCenterTop,} = state
  
  const onSubmit = (e) => {
    e.preventDefault();
  };
  
  function handleClick(e) {
    e.preventDefault();
    ipcRenderer.send('openFile',e.target.innerText);
  
  }
  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
  const addWorkBook = ()=>{ 
   if(!validURL(link)){
     alert("Not a valid url");
     
   }else{
    ipcRenderer.send('addWorkBook',link);
   } ;
    
    
  }

  const sendHorses = () => {
    if(!validURL(link)){
      alert("Not a valid url");
      
    }
     
   
    // if (stoping) {
    //   ipcRenderer.send(
    //     "horses",
    //     (datahorses = {
    //       link: null,
    //       j: -1,
    //     })
    //   );
    //   dispatch( {type : "stopScraping"} )
    // } 
    else {
      dispatch( {type : "startScraping"} )
      ipcRenderer.send("horses",  {
        link,
        j: 0,
      });
    }
  };
  useEffect(() => {

    ipcRenderer.on('workBook',(e,data)=>{
      console.log(data);
      
     dispatch({type:"workbookAdd" , payload:data}) 
      console.log(workbook + "hello");
      
    });
    let isSubscribed = true;
    // ipcRenderer.on("index",(e,i)=>{
    //   if(isSubscribed){
    //     dispatch( {type : "numberOfRepitition",payload:i} )
    //   }
      
    // });
 
    ipcRenderer.send("mainWindowLoaded")
  ipcRenderer.on("resultSent",(e, data) =>{
    dispatch({type:"workbookAdd" , payload:data}) 
    console.log(data);
    
  })
    // ipcRenderer.on("horses", (e, data) => {
    //   if(isSubscribed){
    //     if (data.resultHorses.length == 0) {
    //       dispatch( {type : "noPays_NoPool"} ) //no one exist
    //       } else if (data.resultHorses.length == 1) {
            
    
    //         dispatch( {type : "Pool_noPays",payload:data.resultHorses[0]} )
    
    //          //this case table bottom exist and top no
    //       } else {
    
    //         dispatch( {type : "Pool_Pays",payload:data} )
        
    //       } 
    //   }
     
    // });
    // ipcRenderer.on('stay',(e,data)=>{
     
    //   dispatch( {type : "numberOfRepitition",payload:data.i} )
      
    //   ipcRenderer.send("horses", {
    //     link:data.URL,
    //     j:data.i
    //   });
    // })
    return () => isSubscribed = false;
  }, []);

  
console.log(workbook);

  return (
    <div className="container">

      <button  onClick={addWorkBook} >Add Workbook</button> 
 
      
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
            pattern="https?://.+"
            type="url"
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
      <ul className="list-group">
        {workbook.map(workb=>(
          <li key={workb.id} className="list-group-item d-flex justify-content-between align-items-center">
          <a href={workbook} onClick={handleClick} >{workb.link} </a>
      <span className="badge badge-primary badge-pill">{workb.created_at} </span>
  </li>
         ) )}

</ul>
    </div>
  );
};

export default Pup;
