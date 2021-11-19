import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Lecture from "./Lecture";
import Lectures from "./Lectures";
import Login from "./Login";
import SecuredRoute from "./SecuredRoute";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import Nav from "./Nav";
export default function App() {
  return (
    <Router>
      <div className="container">
        {localStorage.getItem("jwt") && <Nav />}
        <Switch>
          <Route path="/" exact component={Login} />
          <SecuredRoute path="/lectures" exact component={Lectures} />
          <SecuredRoute path="/lectures/:id" component={Lecture} />
        </Switch>
      </div>
    </Router>
  );
}
