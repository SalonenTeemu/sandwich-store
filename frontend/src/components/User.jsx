import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getUserByUsername,
  deleteUser,
} from "../redux/actionCreators/userActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const User = () => {
  const { username } = useParams();
  const user = useSelector((state) =>
    state.users.find((user) => user.username === username)
  );
  const [auth, setAuth] = useState(false);

  const authUser = useSelector((state) => state.auth);
  const authUsername = authUser.username;
  const role = authUser.role;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authUser.username === username || role === "admin") {
      setAuth(true);
    }
  }, [auth, authUser, role, username]);

  useEffect(() => {
    if (!user && auth) {
      setAuth(true);
      dispatch(getUserByUsername(username));
    }
  }, [auth, username, user, dispatch]);

  useEffect(() => {}, [user]);

  if (!auth) {
    return <Forbidden />;
  }
  if (!user) {
    return (
      <div className="mb-4">
        <div className="text-red-500">User Not Found</div>
        <div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              if (user.role === "admin") {
                navigate("/users");
              } else if (user.role === "customer") {
                navigate("/");
              }
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => () => {
    dispatch(deleteUser(user.username, authUsername));
    if (user.username === authUsername) {
      navigate("/")
    }
    else {
      navigate("/users");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">User Details</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Username: {user.username}
        </label>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-lg">
          Email: {user.email}
        </label>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-lg">
          Role: {user.role}
        </label>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <Link
          to={`/users/${user.username}/edit`}
          className="text-orange-500 hover:underline"
        >
          Edit User
        </Link>
        <button
          onClick={handleDelete(user.username)}
          className="text-red-500 hover:underline hover:text-red-700 focus:outline-none"
        >
          Delete User
        </button>
      </div>
      <div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            if (user.role === "admin") {
              navigate("/users");
            } else {
              navigate("/");
            }
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
