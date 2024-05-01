import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getOrders } from "../redux/actionCreators/orderActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders);
  const authRole = useSelector((state) => state.auth).role;
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (authRole === "customer" || authRole === "admin") {
      setAuth(true);
    }
  }, [authRole]);

  useEffect(() => {
    if (auth && (!orders || orders.length === 0)) {
      dispatch(getOrders());
    }
  }, [auth, dispatch]);

  useEffect(() => {}, [orders]);

  const renderOrders = () => {
    if (!auth) {
      return <Forbidden />;
    }
    if (orders.length === 0) {
      return <div className="text-gray-500">No Orders Found</div>;
    } else {
      return (
        <div>
          <h2 className="text-2xl font-semibold mb-4">List of Orders</h2>
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 bg-white shadow rounded-lg">
                <div>
                  <label className="block font-semibold mb-1 text-lg">
                    Order ID: {order.id}
                  </label>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-lg">
                    Status: {order.status}
                  </label>
                </div>
                <Link
                  to={`/orders/${order.id}`}
                  className="text-blue-500 hover:underline"
                >
                  Inspect Order
                </Link>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return <div className="mt-4">{renderOrders()}</div>;
};
