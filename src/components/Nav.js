import React, { useState } from "react";
import { Router, Link, BrowserRouter, HashRouter } from "react-router-dom";

const Nav = (props) => {
  return (
    <div>
      <ul>
        <HashRouter>
          <li>
            <Link to="/">dashbord</Link>
          </li>
          <li>
            <Link to="/pup/"> horses</Link>
          </li>
        </HashRouter>
      </ul>
    </div>
  );
};

export default Nav;
