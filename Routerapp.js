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
import Tvg from "./src/components/Tvg";
import Massey from "./src/components/Massey";
import Nav from "./src/components/Nav";


const Routerapp = () => (
  <HashRouter>
    <Nav />
    <div>
      <Route exact={true}
        path='/'
        render={(props) =>
          <App {...props} />
        }></Route>
      <Route path="/pup" component={Pup}></Route>
      <Route path="/massey" component={Massey}></Route>
      <Route path="/tvg" component={Tvg}></Route>
    </div>


  </HashRouter>
);

export default Routerapp;
