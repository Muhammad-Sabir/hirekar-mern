import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./pages/worker/Layout";
import Jobs from "./components/Jobs";
import Resume from "./components/Resume";
import ChatBox from "./components/ChatBox";
import RecentChats from "./components/RecentChats";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login/:userType",
      element: <Login />,
    },
    {
      path: "/signup/:userType",
      element: <Signup />,
    },
    {
      path: "/worker/",
      element: <Layout  children={<Jobs/>} />
    },
    {
      path: "/worker/chats",
      element: <Layout  children={<RecentChats/>} />
    },
    {
      path: "/worker/chats/:user",
      element: <Layout  children={<ChatBox/>} />
    },
    {
      path: "/worker/resume",
      element: <Layout  children={<Resume/>} />
    }

  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
