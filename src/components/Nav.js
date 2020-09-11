import React, { useState } from "react";
import Landing from "./Landing"
import { Router, Link, BrowserRouter, HashRouter } from "react-router-dom";

const Nav = (props) => {
  return (
    <div style={{ body: "#DDDDDD" }}>

      <ul  >
        <HashRouter>
          <nav className="navbar navbar-expand-sm navbar-dark bg-secondary">
            <div className="navbar-nav">
              <Link className="nav-item nav-link" tag="a" to="/">
                Soccer
              </Link>

              <Link className="nav-item nav-link" tag="a" to="/pup/">
                Horses
              </Link>
              <Link className="nav-item nav-link" tag="a" to="/massey/">
                Massey
              </Link>

            </div>
          </nav>
        </HashRouter>
      </ul>


    </div>
  );
};

export default Nav;
