import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Select from "./Select";
import Upload from "./Upload";
import Status from "./Status";
import Payment from "./Payment";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/select" component={Select} />
        <Route path="/upload" component={Upload} />
        <Route path="/status" component={Status} />
        <Route path="/payment" component={Payment} />
      </Switch>
    </Router>
  );
}

export default App;
