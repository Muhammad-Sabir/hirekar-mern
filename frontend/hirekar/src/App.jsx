import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./layouts/Layout";
import Jobs from "./pages/worker/Jobs";
import Resume from "./pages/worker/Resume";
import ChatBox from "./components/ChatBox";
import RecentChats from "./pages/RecentChats";
import JobPosting from "./pages/employer/JobPosting";
import Recommendations from "./pages/employer/Recommendations";
import SearchResultList from "./pages/employer/SearchResultList";

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
      element: (
        <Layout>
          <Jobs />
        </Layout>
      ),
    },
    {
      path: "/worker/chats",
      element: (
        <Layout>
          <RecentChats />
        </Layout>
      ),
    },
    {
      path: "/worker/chats/:user",
      element: (
        <Layout>
          <ChatBox />
        </Layout>
      ),
    },
    {
      path: "/worker/resume",
      element: (
        <Layout>
          <Resume />
        </Layout>
      ),
    },
    {
      path: "/employer/searchResults",
      element: (
        <Layout>
          <SearchResultList />
        </Layout>
      ),
    },
    {
      path: "/employer/",
      element: (
        <Layout>
          <Recommendations />
        </Layout>
      ),
    },
    {
      path: "/employer/chats",
      element: (
        <Layout>
          <RecentChats />
        </Layout>
      ),
    },
    {
      path: "/employer/chats/:user",
      element: (
        <Layout>
          <ChatBox />
        </Layout>
      ),
    },
    {
      path: "/employer/hire",
      element: (
        <Layout>
          <JobPosting/>
        </Layout>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
