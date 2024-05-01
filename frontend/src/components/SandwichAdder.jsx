import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSandwich } from "../redux/actionCreators/sandwichActions.js";
import { getToppingsAndBreadTypes } from "../redux/actionCreators/utilActions.js";
import { Forbidden } from "./Forbidden.jsx";

export const SandwichAdder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const breadTypeOptions = useSelector((state) => state.utils.breadTypes);
  const toppingTypeOptions = useSelector((state) => state.utils.toppings);
  const authRole = useSelector((state) => state.auth).role;

  const [name, setName] = useState("");
  const [toppings, setToppings] = useState([]);
  const [breadType, setBreadType] = useState("oat");

  useEffect(() => {
    if (
      authRole === "admin" &&
      (!breadTypeOptions ||
        breadTypeOptions.length === 0 ||
        !toppingTypeOptions ||
        toppingTypeOptions.length === 0)
    ) {
      dispatch(getToppingsAndBreadTypes());
    }
  }, [authRole]);

  if (authRole !== "admin") {
    return <Forbidden />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map selected toppings to their corresponding IDs
    const selectedToppingsIds = toppings
      .map((toppingName) => {
        const selectedTopping = toppingTypeOptions.find(
          (topping) => topping.name === toppingName
        );
        return selectedTopping ? selectedTopping.id : null;
      })
      .filter((id) => id !== null);

    dispatch(
      addSandwich({
        name: name,
        toppings: selectedToppingsIds,
        breadType: breadType,
      })
    );
    navigate("/sandwiches");
  };

  if (!breadTypeOptions || !toppingTypeOptions) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Add a New Sandwich</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1 text-lg">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="toppings"
            className="block font-semibold mb-1 text-lg"
          >
            Toppings (choose many with Ctrl + click):
          </label>
          <select
            id="toppings"
            multiple
            size={toppingTypeOptions.length}
            value={toppings}
            onChange={(e) =>
              setToppings(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            style={{ overflow: "hidden" }}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          >
            {toppingTypeOptions.map((topping) => (
              <option key={topping.id} value={topping.name}>
                {topping.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="breadType"
            className="block font-semibold mb-1 text-lg"
          >
            Bread Type:
          </label>
          <select
            id="breadType"
            value={breadType}
            onChange={(e) => setBreadType(e.target.value)}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            required
          >
            {breadTypeOptions.map((bread) => (
              <option key={bread} value={bread}>
                {bread}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Sandwich
        </button>
      </form>
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
