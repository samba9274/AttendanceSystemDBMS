import { Redirect } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onLogin = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/teacher/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacher: {
          username: username,
          password: password,
        },
      }),
    })
      .then((res) => res.json())
      .then((jwt) => localStorage.setItem("jwt", jwt.jwt))
      .then(() => document.location.reload());
  };
  return localStorage.getItem("jwt") ? (
    <Redirect to="/lectures" />
  ) : (
    <div className="row">
      <div className="col"></div>
      <div className="col shadow rounded p-4 m-5">
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="username"
              name="username"
              className="form-control"
              id="username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button onClick={onLogin} className="btn btn-primary">
            Login
          </button>
          <div className="form-text text-danger">{}</div>
        </form>
      </div>
      <div className="col"></div>
    </div>
  );
}
