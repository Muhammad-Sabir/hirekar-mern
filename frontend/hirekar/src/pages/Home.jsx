import { Link } from "react-router-dom";
import backgroundImage from "/assets/home-bg.jpg";

const Home = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-lg text-center max-w-lg mx-auto">
        <h1 className="text-4xl font-bold text-custom-red mb-6">
          WELCOME TO HIRE KAR!
        </h1>
        <p className="text-lg mb-6 text-black">
          Find or offer services for low-end jobs like plumbing, electrician
          work, mechanics, and more!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login/worker"
            className="bg-custom-red text-white px-4 py-2 rounded-lg w-full hover:bg-red-700 transition duration-300"
          >
            Job Seeker
          </Link>
          <Link
            to="/login/employer"
            className="bg-custom-yellow text-white px-4 py-2 w-full rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Hire Talent
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
