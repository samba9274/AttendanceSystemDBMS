import { decode } from "jsonwebtoken";
import { Link } from "react-router-dom";

export default function Nav() {
  const logout = () => {
    localStorage.removeItem("jwt");
    document.location.reload();
  };
  return (
    <nav className="p-3">
      <span className="fs-5 text-capitalize">
        Hello, {decode(localStorage.getItem("jwt").substring(7)).name}
      </span>
      <span
        onClick={logout}
        role="button"
        className="float-end text-primary text-decoration-none"
      >
        Logout
      </span>
      <Link to="/lectures" className="float-end text-decoration-none me-5">
        Home
      </Link>
    </nav>
  );
}
