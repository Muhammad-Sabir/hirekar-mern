import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import WorkerHome from "./pages/worker/WorkerHome";

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
      path: "/worker",
      element: <WorkerHome />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
