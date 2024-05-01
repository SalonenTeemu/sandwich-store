import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getSandwiches,
  deleteSandwich,
} from "../redux/actionCreators/sandwichActions.js";

export const Sandwiches = () => {
  const dispatch = useDispatch();
  const sandwiches = useSelector((state) => state.sandwiches);
  const authRole = useSelector((state) => state.auth).role;

  useEffect(() => {
    dispatch(getSandwiches());
  }, []);

  useEffect(() => {}, [sandwiches]);

  const handleDelete = (sandwichId) => () => {
    dispatch(deleteSandwich(sandwichId));
  };

  const renderSandwiches = () => {
    if (sandwiches.length === 0) {
      return <div className="text-gray-500">No Sandwiches Found</div>;
    } else {
      return (
        <div className="grid gap-4">
          {sandwiches.map((sandwich) => (
            <div key={sandwich.id} className="p-4 bg-white shadow rounded-lg">
              <div>
                <label className="block font-semibold mb-1 text-lg">
                  Sandwich ID: {sandwich.id}
                </label>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-lg">
                  Name: {sandwich.name}
                </label>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <Link
                    to={`/sandwiches/${sandwich.id}`}
                    className="text-blue-500 hover:underline mr-4"
                  >
                    Inspect Sandwich
                  </Link>
                </div>
                {authRole === "admin" && (
                  <div>
                    <Link
                      to={`/sandwiches/${sandwich.id}/edit`}
                      className="text-orange-500 hover:underline mr-4"
                    >
                      Edit Sandwich
                    </Link>
                    <button
                      onClick={handleDelete(sandwich.id)}
                      className="text-red-500 hover:underline hover:text-red-700 focus:outline-none"
                    >
                      Delete Sandwich
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">List of Sandwiches</h2>
      {authRole === "admin" && (
        <Link
          to="/sandwiches/add"
          className="text-blue-500 hover:underline mb-4"
        >
          Add a New Sandwich
        </Link>
      )}
      <div className="mt-4">{renderSandwiches()}</div>
    </div>
  );
};
