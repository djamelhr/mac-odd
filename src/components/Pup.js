import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import HoresTables from "./HoresTables";
import HoresTablesBottom from "./HoresTablesBottom";
const Pup = () => {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [stop, setStop] = useState(false);
  const [availablePays, setAvailablePays] = useState(false);
  const [availablePool, setAvailablePool] = useState(false);

  const [tableRightTop, setTableRightTop] = useState([]);
  const [tableRightBottom, settabTeRightBottom] = useState([]);
  const [tableCenterBottom, setTableCenterBottom] = useState([]);
  const [tableCenterTop, setTableCenterTop] = useState([]);

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
    }
    if (stop) {
      ipcRenderer.send(
        "horses",
        (datahorses = {
          link: null,
          j: -1,
        })
      );
      setStop(false);
    } else {
      setStop(true);
      // setTableRightTop([]);
      // settabTeRightBottom([]);
      // setTableCenterBottom([]);
      // setTableCenterTop([]);
      setLoading(true);
      ipcRenderer.send("horses", datahorses);
    }
  };
  useEffect(() => {
    ipcRenderer.on("horses", (e, data) => {
      console.log(data);
      console.log(data.resultHorses.length);
      if (data.resultHorses.length == 0) {
        setLoading(false);
        setAvailablePays(true); //no one exist
        setAvailablePool(true);
      } else if (data.resultHorses.length == 1) {
        setLoading(false);
        setAvailablePool(true);
        settabTeRightBottom(data.resultHorses[0]); //this case table bottom exist and top no
      } else {
        setLoading(false);
        settabTeRightBottom(data.resultHorses[1]); // two tbale exist
        setTableRightTop(data.resultHorses[0]);
        // }
      }
    });
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
            onChange={(e) => setLink(e.target.value)}
          ></input>
        </form>

        <div className="input-group-append">
          <button
            className="btn btn-outline-dark form-control"
            onClick={sendHorses}
          >
            {stop ? "Stop" : "Start"}
          </button>
        </div>
      </div>

      <HoresTables
        tableRightTop={tableRightTop}
        loading={loading}
        availablePays={availablePays}
      />
      <HoresTablesBottom
        tableRightBottom={tableRightBottom}
        loading={loading}
        availablePays={availablePool}
      />
    </div>
  );
};

export default Pup;
