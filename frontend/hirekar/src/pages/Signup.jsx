import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const { userType } = useParams();
  const isWorker = userType === "worker";

  useEffect(() => {
    if (localStorage.getItem("token") && localStorage.getItem("role")) {
      const role = localStorage.getItem("role");
      navigate(`/${role}`);
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    phone_number: "",
    designation: "",
    hourly_rate: "",
    skills: "",
  });
  const [error, setError] = useState("");

  const validEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validName = (name) => {
    const nameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
    return nameRegex.test(name);
  };

  const validateAddress = (address) => {
    const addressRegex = /, [a-zA-Z\s]+, [a-zA-Z\s]+$/;
    return addressRegex.test(address);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      email,
      password,
      address,
      phone_number,
      designation,
      hourly_rate,
      skills,
    } = formData;

    if (!validName(name)) {
      setError("Name must include both first and last name");
      return;
    }

    if (!validEmail(email)) {
      setError("Please enter a valid Email");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password length must be greater than 8");
      return;
    }

    if (!validateAddress(address)) {
      setError(
        "Please specify the city and country in the address \n (e.g., House No 82, Block B, Model Town, Lahore, Pakistan)."
      );
      return;
    }

    if (!phone_number) {
      setError("Phone number is required to proceed");
      return;
    }

    if (isWorker) {
      if (!designation) {
        setError("Please select a job designation");
        return;
      }

      if (!hourly_rate) {
        setError("Please Enter your Hourly rate");
        return;
      }

      if (!skills) {
        setError("Please Enter your skills");
        return;
      }
    }
    //console.log(formData);

    try {
      const response = await fetch(
        "http://hirekar-frontend.s3-website.eu-north-1.amazonaws.com/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            role: userType,
            skills: skills.split(",").map((skill) => skill.trim()),
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate(`/login/${userType}`);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center min-h-screen bg-center bg-cover sm:justify-start"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col justify-center w-full p-8 text-center bg-white bg-opacity-75 rounded-lg shadow-lg sm:w-2/4">
        <h1 className="mb-16 text-4xl font-bold text-custom-red">
          {isWorker ? "JOB-SEEKER SIGN UP" : "HIRE-TALENT SIGN UP"}
        </h1>
        <div className="flex justify-center mb-6">
          <Link
            to="/signup/worker"
            className={`px-4 w-full py-2 ${
              isWorker ? "text-white bg-blue-600 rounded-lg" : "text-gray-600"
            }`}
          >
            Job Seeker
          </Link>
          <Link
            to="/signup/employer"
            className={`px-4 w-full py-2 ${
              !isWorker ? "text-white bg-blue-600 rounded-lg" : "text-gray-600"
            }`}
          >
            Hire Talent
          </Link>
        </div>
        <form onSubmit={handleSubmit} className="pb-8 space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          <div>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
            />
          </div>
          {isWorker && (
            <>
              <div>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full p-2 px-4 py-2 text-gray-400 rounded-lg focus:outline-none"
                >
                  <option value="">Select Designation</option>
                  <option value="Driver">Driver</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                </select>
              </div>
              <div>
                <input
                  type="text"
                  name="hourly_rate"
                  value={formData.hourly_rate}
                  onChange={handleChange}
                  placeholder="Hourly Rate"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="Skills (comma separated)"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red"
                />
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
          >
            Sign Up
          </button>
          {error && <p className="mt-4 text-red-600">{error}</p>}
        </form>
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to={isWorker ? "/login/worker" : "/login/employer"}
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
