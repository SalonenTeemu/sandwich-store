import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export const Forbidden = () => {
  const authRole = useSelector((state) => state.auth).role;
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-4xl font-semibold mb-4">Access forbidden</div>
      {authRole === "guest" && (
        <>
          <div className="text-1xl font-semibold mb-4">
            You are currently not signed in.
          </div>
          <Link to="/login" className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </>
      )}
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Go Back to the Home Page
      </Link>
    </div>
  );
};
