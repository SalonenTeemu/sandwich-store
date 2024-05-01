import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { initAuth } from "./redux/actionCreators/authActions.js";
import { Home } from "./components/Home.jsx";
import { Navbar } from "./components/Navbar.jsx";
import { NotFound } from "./components/NotFound.jsx";
import { Notifications } from "./components/Notifications.jsx";
import { Orders } from "./components/Orders.jsx";
import { Order } from "./components/Order.jsx";
import { Sandwiches } from "./components/Sandwiches.jsx";
import { Sandwich } from "./components/Sandwich.jsx";
import { SandwichEditor } from "./components/SandwichEditor.jsx";
import { SandwichAdder } from "./components/SandwichAdder.jsx";
import { Users } from "./components/Users.jsx";
import { User } from "./components/User.jsx";
import { UserEditor } from "./components/UserEditor.jsx";
import { Register } from "./components/Register.jsx";
import { Login } from "./components/Login.jsx";

export function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <Notifications />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<Order />} />
        <Route path="/sandwiches" element={<Sandwiches />} />
        <Route path="/sandwiches/add" element={<SandwichAdder />} />
        <Route path="/sandwiches/:sandwichId" element={<Sandwich />} />
        <Route
          path="/sandwiches/:sandwichId/edit"
          element={<SandwichEditor />}
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:username" element={<User />} />
        <Route path="/users/:username/edit" element={<UserEditor />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
