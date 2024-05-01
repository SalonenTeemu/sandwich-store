import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getSandwichById,
  deleteSandwich,
} from "../redux/actionCreators/sandwichActions.js";
import { addOrder } from "../redux/actionCreators/orderActions.js";

export const Sandwich = () => {
  const { sandwichId } = useParams();
  const sandwich = useSelector((state) =>
    state.sandwiches.find((sandwich) => sandwich.id === parseInt(sandwichId))
  );
  const authRole = useSelector((state) => state.auth).role;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sandwich) {
      dispatch(getSandwichById(sandwichId));
    }
  }, []);

  useEffect(() => {}, [sandwich]);

  if (!sandwich) {
    return (
      <div className="mb-4">
        <div className="text-red-500">Sandwich Not Found</div>
        <div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/sandwiches")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleDelete = () => () => {
    dispatch(deleteSandwich(sandwich.id));
    navigate("/sandwiches");
  };

  const handleOrder = () => () => {
    dispatch(addOrder({ sandwichId: sandwich.id }));
    navigate("/orders");
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Sandwich Details</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Name: {sandwich.name}
        </label>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">Toppings:</label>
        <ul className="list-disc pl-4">
          {sandwich.toppings.map((topping) => (
            <li key={topping.id}>{topping.name}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Bread type:{" "}
          {sandwich.breadType.charAt(0).toUpperCase() +
            sandwich.breadType.slice(1)}
        </label>
      </div>
      {authRole === "admin" && (
        <div className="mb-4 flex justify-between items-center">
          <Link
            to={`/sandwiches/${sandwich.id}/edit`}
            className="text-orange-500 hover:underline"
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
      <div>
        {authRole !== "guest" && (
          <button
            onClick={handleOrder(sandwich.id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Order Sandwich
          </button>
        )}
      </div>
      <div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/sandwiches")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
