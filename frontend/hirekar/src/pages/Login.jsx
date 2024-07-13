import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("role")) {
      const role = localStorage.getItem("role");
      console.log(role);
      navigate(`/${role}`);
    }
  }, [navigate]);

  const { userType } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);

        if (userType !== data.user.role) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setError("Select the correct role!");
        } else {
          navigate(`/${data.user.role}/`);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-md p-8 text-center bg-white bg-opacity-75 rounded-lg shadow-lg w-96">
        <h1 className="mb-4 text-3xl font-bold text-custom-red">
          {userType === "worker" ? "JOB-SEEKER LOGIN" : "HIRE-TALENT LOGIN"}
        </h1>
        <div className="flex justify-center mb-6">
          <Link
            to="/login/worker"
            className={`px-4 py-2 ${
              userType === "worker"
                ? "text-white bg-blue-600 rounded-lg"
                : "text-gray-600"
            }`}
          >
            Job Seeker
          </Link>
          <Link
            to="/login/employer"
            className={`px-4 py-2 ${
              userType === "employer"
                ? "text-white bg-blue-600 rounded-lg"
                : "text-gray-600"
            }`}
          >
            Hire Talent
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
          >
            Login
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
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
