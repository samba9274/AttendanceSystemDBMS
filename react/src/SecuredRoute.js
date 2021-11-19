import React from "react";
import { Route, Redirect } from "react-router-dom";

const SecuredRoute = ({ component: Component, ...rest }) => {
  const currentUser = localStorage.getItem("jwt");
  return (
    <Route
      {...rest}
      render={(props) => {
        return currentUser ? <Component {...props} /> : <Redirect to="/" />;
      }}
    ></Route>
  );
};
export default SecuredRoute;
