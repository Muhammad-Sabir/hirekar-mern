import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./layouts/Layout";
import Jobs from "./pages/worker/Jobs";
import Resume from "./pages/worker/Resume";
import ChatBox from "./components/ChatBox";
import RecentChats from "./pages/RecentChats";
import Recommendations from "./pages/employer/Recommendations";
import HiringForm from "./pages/employer/HiringForm";
import JobPostingForm from "./pages/employer/JobPostingForm";
import JobPostings from "./pages/employer/JobPostings";
import Workers from "./pages/employer/Workers";
import Profile from "./pages/employer/Profile";
import OtpForm from "./pages/OtpForm";
import WorkerDetailPage from "./pages/employer/WorkerDetailPage";
import Chatbot from "./components/ChatBot";

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
      path: "/verifyOtp/:userType",
      element: <OtpForm />,
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
      path: "/worker/chats/:chat_id",
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
      path: "/employer/recommendations",
      element: (
        <Layout>
          <Recommendations />
        </Layout>
      ),
    },
    {
      path: "/employer/",
      element: (
        <Layout>
          <Workers />
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
      path: "/employer/chats/:chat_id/:chat_user",
      element: (
        <Layout>
          <ChatBox />
        </Layout>
      ),
    },
    {
      path: "/employer/hire/:user/:user_id",
      element: (
        <Layout>
          <HiringForm />
        </Layout>
      ),
    },
    {
      path: "/employer/:worker_id",
      element: (
        <Layout>
          <WorkerDetailPage />
        </Layout>
      ),
    },
    {
      path: "/employer/jobPostings",
      element: (
        <Layout>
          <JobPostings />
        </Layout>
      ),
    },
    {
      path: "/employer/jobPostingForm",
      element: (
        <Layout>
          <JobPostingForm />
        </Layout>
      ),
    },
    {
      path: "/employer/profile",
      element: (
        <Layout>
          <Profile />
        </Layout>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <Chatbot />
    </>
  );
}

export default App;
