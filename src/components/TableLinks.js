import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import { ipcRenderer } from "electron";


const TableLinks = ({ workbook }) => {

    function handleClick(e) {
        e.preventDefault();
        ipcRenderer.send('openFile', e.target.href);

    }
    const removeItem = (id, link) => {

        ipcRenderer.send('deleteFile', { id, link });
        console.log(id, link);

    }
    return (<Table striped bordered hover>
        <thead>
            <tr className="text-center">
                <th>Link</th>
                <th>File</th>
                <th>Date</th>
                <th>#</th>
            </tr>
        </thead>
        <tbody>
            {workbook.map(workb => {
                return (
                    <tr key={workb.id}>
                        <td scope="row" >{workb.url} </td>
                        <th > <a className="text-dark" href={workb.link} onClick={handleClick}>{workb.name}</a>  </th>
                        <td>{workb.created_at}</td>
                        <td>
                            <button onClick={() => removeItem(workb.id, workb.link)} type="button" className="close text-dark" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button></td>
                    </tr>
                )

            })}


        </tbody>
    </Table >)

}

export default TableLinks;