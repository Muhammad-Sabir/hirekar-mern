import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const Login = () => {
  const { userType } = useParams();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md p-8 text-center bg-white bg-opacity-75 rounded-lg shadow-lg w-96">
        <h1 className="mb-4 text-3xl font-bold text-red-600">
          {userType === "worker" ? "JOB-SEEKER LOGIN" : "HIRE-TALENT LOGIN"}
        </h1>
        <div className="flex justify-center mb-6">
          <Link
            to="/login/worker"
            className={`px-4 py-2 ${
              userType === "worker"
                ? "text-white bg-custom-red rounded-lg"
                : "text-gray-600"
            }`}
          >
            Job Seeker
          </Link>

          <Link
            to="/login/employer"
            className={`px-4 py-2 ${
              userType === "employer"
                ? "text-white bg-custom-red rounded-lg"
                : "text-gray-600"
            }`}
          >
            Hire Talent
          </Link>
        </div>
        <form className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-300 bg-red-600 rounded-lg"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Dont have an account?{" "}
          <Link to="/signup/worker" className="underline text-custom-red">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
