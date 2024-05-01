import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/actionCreators/authActions.js";

const allLinks = {
  admin: ["Orders", "Users"],
  customer: ["Orders", "Users"],
  guest: ["Login", "Register"],
};

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const username = useSelector((state) => state.auth).username;
  const role = useSelector((state) => state.auth).role;
  const [links, setLinks] = useState([]);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const displayText = username ? "Logged in: " + username : "";

  const createLinks = (list) => {
    return list.map((val) => {
      const lowerVal = val.toLowerCase();
      if (val === "Users" && role === "customer") {
        return (
          <Link
            to={`/users/${username}`}
            key={`${lowerVal}-link`}
            className="text-white hover:text-gray-300"
          >
            User info
          </Link>
        );
      } else {
        return (
          <Link
            to={`/${lowerVal}`}
            key={`${lowerVal}-link`}
            className="text-white hover:text-gray-300"
          >
            {val}
          </Link>
        );
      }
    });
  };

  useEffect(() => {
    const roleLinks = allLinks[role] || allLinks["guest"];
    setLoggedIn(role && (role === "customer" || role === "admin"));
    setLinks(createLinks(roleLinks));
  }, [role]);

  const logOutClick = (e) => {
    e.preventDefault();
    navigate("/");
    dispatch(logOut());
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center text-white">
          <div
            onClick={() => navigate("/")}
            className="text-white font-bold text-xl cursor-pointer hover:text-gray-300 mr-10"
          >
            Sandwich Store
          </div>
          {displayText && <span className="font-semibold">{displayText}</span>}
        </div>
        <div className="flex space-x-4">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/sandwiches" className="text-white hover:text-gray-300">
            Sandwiches
          </Link>
          {links}
          {isLoggedIn && (
            <Link
              className="text-white hover:text-gray-300"
              onClick={logOutClick}
            >
              Logout
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
