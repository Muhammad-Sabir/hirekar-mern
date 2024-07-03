import { Link } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";
import { useParams } from "react-router-dom";

const Signup = () => {
  const { userType } = useParams();

  return (
    <div
      className="flex justify-center min-h-screen bg-center bg-cover sm:justify-start"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col justify-center w-full p-8 text-center bg-white bg-opacity-75 rounded-lg shadow-lg sm:w-2/4">
        <h1 className="mb-16 text-4xl font-bold text-custom-red">
          {userType === "worker" ? "JOB-SEEKER SIGN UP" : "HIRE-TALENT SIGN UP"}
        </h1>
        <div className="flex justify-center mb-6">
          <Link
            to="/signup/worker"
            className={`px-4 w-full py-2 ${
              userType === "worker"
                ? "text-white bg-custom-yellow rounded-lg"
                : "text-gray-600"
            }`}
          >
            Job Seeker
          </Link>
          <Link
            to="/signup/employer"
            className={`px-4 w-full py-2 ${
              userType === "employer"
                ? "text-white bg-custom-yellow rounded-lg"
                : "text-gray-600"
            }`}
          >
            Hire Talent
          </Link>
        </div>
        <form className="pb-8 space-y-4">
          <div>
            <input
              type="text"
              placeholder="Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to={userType === "worker" ? "/login/worker" : "/login/employer"}
            className="underline text-custom-red"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
