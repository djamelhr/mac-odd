import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { ipcRenderer } from "electron";


const TableMassey = ({ games }) => {

    const mystyle = {
        fontSize: "11px",

    };
    if (games.length <= 0) { return " " } else {
        return (<Table striped bordered hover>
            <thead>
                <tr className="text-center">
                    <th>League</th>
                    <th>Date</th>
                    <th>Team 1</th>
                    <th>Team 2</th>
                    <th>Standing</th>
                    <th>SCR</th>
                    <th>Pred</th>
                    <th>Pwin</th>
                    <th>Margine</th>
                    <th>Total</th>


                    {/* <th>Date</th>
                    <th>#</th> */}
                </tr>
            </thead>
            <tbody >
                {games.map((game, i) => {
                    return (
                        <tr key={i}>
                            <td scope="row" >{game[0]} </td>
                            {/* <th > <a className="text-dark" href={workb.link} onClick={handleClick}>{workb.name}</a>  </th> */}
                            <td style={mystyle} > {game[1]}</td>
                            <td style={mystyle} >{game[2]}</td>
                            <td style={mystyle} >{game[4]}</td>
                            <td style={mystyle} >{game[3]}</td>
                            <td style={mystyle} >{game[5]}</td>
                            <td style={mystyle} >{game[6]}</td>
                            <td style={mystyle} >{game[7]}</td>
                            <td style={mystyle} >{game[8]}</td>
                            <td style={mystyle} >{game[9]}</td>



                            {/* <td>
                                <button onClick={() => removeItem(workb.id, workb.link)} type="button" className="close text-dark" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button></td> */}
                        </tr>
                    )

                })}


            </tbody>
        </Table >)
    }


}

export default TableMassey;