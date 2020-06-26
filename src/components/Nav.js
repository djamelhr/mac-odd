import React, { useState } from "react";
import { Router, Link, BrowserRouter, HashRouter } from "react-router-dom";

const Nav = (props) => {
  return (
    <div>
      <ul>
        <HashRouter>
          <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-nav">
              <Link className="nav-item nav-link" tag="a" to="/">
                Soccer Odds
              </Link>

              <Link className="nav-item nav-link" tag="a" to="/pup/">
                Horses Odds
              </Link>
            </div>
          </nav>
        </HashRouter>
      </ul>
    </div>
  );
};

export default Nav;
