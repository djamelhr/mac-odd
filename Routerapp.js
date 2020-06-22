import React, { Fragment } from "react";
import {
  BrowserRouter,
  Switch,
  Route,
  Router,
  HashRouter,
} from "react-router-dom";
import App from "./src/components/App";
import Posts from "./src/components/Posts";
import Pup from "./src/components/Pup";
import Nav from "./src/components/Nav";

const Routerapp = () => (
  <HashRouter>
    <Nav />
    <div>
      {" "}
      <Route path="/" exact component={App}></Route>
      <Route path="/pup" exact component={Pup}></Route>
    </div>
  </HashRouter>
);

export default Routerapp;
