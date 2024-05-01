import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getOrderById } from "../redux/actionCreators/orderActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const Order = () => {
  const { orderId } = useParams();
  const order = useSelector((state) =>
    state.orders.find((order) => order.id === parseInt(orderId))
  );
  const authUser = useSelector((state) => state.auth);
  const authUsername = authUser.username;
  const authRole = authUser.role;
  const [auth, setAuth] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authRole !== "guest") {
      dispatch(getOrderById(orderId));
    }
  },[authRole]);

  useEffect(() => {}, [order]);

  useEffect(() => {
    if (order && (authRole === "admin" || authUsername === order.customer)) {
      setAuth(true);
    }
  }, [authRole, authUsername, order]);

  if (!auth) {
    return <Forbidden />;
  }

  if (!order) {
    return (
      <div className="mb-4">
        <div className="text-red-500">Order Not Found</div>
        <div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/orders")}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Order ID: {order.id}
        </label>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Customer: {order.customer}
        </label>
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1 text-lg">
          Status: {order.status}
        </label>
      </div>
      <div className="mb-4">
        <Link
          to={`/sandwiches/${order.sandwichId}`}
          className="text-blue-500 hover:underline"
        >
          Inspect the sandwich of the order
        </Link>
      </div>
      <div>
        <button
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => navigate("/orders")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
