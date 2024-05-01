import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUsers, deleteUser } from "../redux/actionCreators/userActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.users);
  const user = useSelector((state) => state.auth);
  const authUsername = user.username;
  const role = user.role;

  useEffect(() => {
    if (role === "admin" && (!users || users.length === 0)) {
      dispatch(getUsers());
    }
  }, []);

  useEffect(() => {}, [users]);

  const handleDelete = (username) => () => {
    dispatch(deleteUser(username, authUsername));
    if (username === authUsername) {
      navigate("/");
    } else {
      navigate("/users");
    }
  };

  const renderUsers = () => {
    if (role !== "admin") {
      return <Forbidden />;
    } else if (users.length === 0) {
      return <div className="text-gray-500">No Users Found</div>;
    } else {
      return (
        <div className="grid gap-4">
          <h2 className="text-2xl font-semibold mb-4">List of Users</h2>
          {users.map((user) => (
            <div key={user.id} className="p-4 bg-white shadow rounded-lg">
              <div>
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
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={`/users/${user.username}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Inspect User
                  </Link>
                </div>
                <div>
                  <Link
                    to={`/users/${user.username}/edit`}
                    className="text-orange-500 hover:underline mr-4"
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
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return <div className="mt-4">{renderUsers()}</div>;
};
