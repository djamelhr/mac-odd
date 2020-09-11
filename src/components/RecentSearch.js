import React, { useState, useEffect } from 'react';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import { ipcRenderer } from "electron";


const RecentSearch = ({ recentSearch }) => {
    console.log(recentSearch);
    const mystyle = {
        fontSize: "14px",

    };
    return (
        <ListGroup>
            <ListGroupItem className="text-center justify-content-between">Recent Search</ListGroupItem>

            {recentSearch.map(league => {
                return (
                    <ListGroupItem style={mystyle} key={league.id} className="justify-content-between">{league.name} </ListGroupItem>

                )
            })}

        </ListGroup>
    );

}

export default RecentSearch;