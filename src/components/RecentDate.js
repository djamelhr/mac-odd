import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { ipcRenderer } from "electron";


const RecentDate = ({ recentDate }) => {
    console.log(recentDate);
    const mystyle = {
        fontSize: "11px",

    };
    return (
        <ListGroup>
            <ListGroupItem className="text-center justify-content-between">Recent Search</ListGroupItem>

            {recentDate.map(datematch => {
                return (
                    <ListGroupItem key={datematch.id} className="justify-content-between text-center">{datematch.date} </ListGroupItem>

                )
            })}

        </ListGroup>
    );

}

export default RecentDate;