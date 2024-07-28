import { MdMenu, MdClose } from "react-icons/md";
import logo from "/assets/logo.png";

// eslint-disable-next-line react/prop-types
const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  console.log(localStorage.getItem("user"));
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="fixed top-0 z-10 flex items-center justify-between w-full px-6 bg-white border-b-2 border-blue-600">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4">
          {sidebarOpen ? (
            <MdClose className="text-2xl" />
          ) : (
            <MdMenu className="text-2xl" />
          )}
        </button>
        <span className="font-bold">
          <img src={logo} alt="Logo" width="50" height="50" />
        </span>
      </div>
      <div className="mr-4 font-bold">{user.name}</div>
    </nav>
  );
};

export default Navbar;
