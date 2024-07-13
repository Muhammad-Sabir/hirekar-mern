import { MdMenu, MdClose } from "react-icons/md";
import Notification from "./Notifications";

// eslint-disable-next-line react/prop-types
const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const currentUrl = window.location.href;
  const hasWorkerPath = currentUrl.includes("/worker");
  
  return (
    <nav className="fixed top-0 z-10 flex items-center justify-between w-full p-3 px-6 bg-black">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="mr-4 text-white">
          {sidebarOpen ? (
            <MdClose className="text-2xl" />
          ) : (
            <MdMenu className="text-2xl" />
          )}
        </button>
        <span className="font-bold text-white">Hirekar</span>
      </div>
      <div className="flex justify-center items-center">
      <div className="text-white mr-4">Hello, {hasWorkerPath? 'Worker': 'Employer'}</div>
      <Notification/>
      </div>
      
    </nav>
  );
};

export default Navbar;
