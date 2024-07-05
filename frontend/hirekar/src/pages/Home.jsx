import { Link } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const Home = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-center bg-cover"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="max-w-lg p-8 mx-auto text-center bg-white bg-opacity-75 rounded-lg shadow-lg">
        <h1 className="mb-6 text-4xl font-bold text-custom-red">
          WELCOME TO HIRE KAR!
        </h1>
        <p className="mb-6 text-lg text-black">
          Find or offer services for low-end jobs like plumbing, electrician
          work, mechanics, and more!
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/login/worker"
            className="w-full px-4 py-2 text-white transition duration-300 rounded-lg bg-custom-red hover:bg-red-700"
          >
            Job Seeker
          </Link>
          <Link
            to="/login/employer"
            className="w-full px-4 py-2 text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-800"
          >
            Hire Talent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
