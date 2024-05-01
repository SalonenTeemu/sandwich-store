import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-4xl font-semibold mb-4">Page Not Found</div>
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Go Back to the Home Page
      </Link>
    </div>
  );
};
