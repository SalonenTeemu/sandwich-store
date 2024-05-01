import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserByUsername,
  editUser,
} from "../redux/actionCreators/userActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const UserEditor = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const [auth, setAuth] = useState(false);
  const authUser = useSelector((state) => state.auth);
  const authRole = authUser.role;
  const authUsername = authUser.username;

  const user = useSelector((state) =>
    state.users.find((user) => user.username === username)
  );

  useEffect(() => {
    if (authRole === "admin" || authUsername === username) {
      setAuth(true);
    }
  }, [authRole, authUsername, username]);

  useEffect(() => {
    if (user && auth) {
      setRole(user.role);
      setEmail(user.email);
    } else {
      dispatch(getUserByUsername(username));
    }
  }, [username, user, auth, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (changePassword) {
      dispatch(
        editUser({
          password: password,
          email: email,
          role: role,
          username: user.username,
        })
      );
    } else {
      dispatch(
        editUser({
          email: email,
          role: role,
          username: user.username,
        })
      );
    }
    navigate(`/users/${username}`);
  };

  if (!auth) {
    return <Forbidden />;
  }

  if (!user) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1 text-lg">
            Username: {user.username}
          </label>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block font-semibold mb-1 text-lg">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="changePassword"
            className="block font-semibold mb-1 text-lg"
          >
            Change Password:
          </label>
          <input
            type="checkbox"
            id="changePassword"
            checked={changePassword}
            onChange={() => setChangePassword(!changePassword)}
            className="mr-2"
          />
          <label htmlFor="changePassword" className="mr-4">
            {changePassword ? "Yes" : "No"}
          </label>
        </div>
        {changePassword && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-semibold mb-1 text-lg"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute top-0 right-0 mr-3 mt-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="role" className="block font-semibold mb-1 text-lg">
            Role: {role === "customer" && user.role}
          </label>
          {role === "admin" && (
            <select
              id="role"
              value={role}
              onClick={(e) => setRole(e.target.value)}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
        >
          Update User
        </button>
      </form>
      <div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate(`/users/${username}`)}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
