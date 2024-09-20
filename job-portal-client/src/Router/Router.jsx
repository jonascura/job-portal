import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../Pages/Home";
import Admin from "../Pages/Admin"
import CreateJob from "../Pages/CreateJob";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import AdminRoute from "../component/AdminRoute"
import JobDetails from "../Pages/JobDetails";
import MyProfile from "../Pages/MyProfile";
import Settings from "../Pages/Settings"
import Resumes from "../Pages/Resumes";
import EmployerLogin from "../Pages/EmployerLogin";
import EmployerRegister from "../Pages/EmployerRegister";
import AdminLogin from "../Pages/AdminLogin";
import EmployerRoute from "../component/EmployerRoute";
import EmployerDashboard from "../Pages/EmployerDashboard";
import AdminAndEmployerRoute from "../component/AdminAndEmployerRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [ 
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      { path: "/job/:id", element: <JobDetails />},
      { path: "/my-profile", element: <MyProfile /> },
      { path: "/settings", element: <Settings /> },
      { path: "/resumes", element: <Resumes /> },
      { path: "/employer-login", element: <EmployerLogin />},
      { path: "/employer-register", element: <EmployerRegister />},
      { path: "/admin-login:5173", element: <AdminLogin />},

      
      // employer only
      { path: "/dashboard", element: (<EmployerRoute><EmployerDashboard /></EmployerRoute>) },
      
      // admin only
      { path: "/admin",element: (<AdminRoute><Admin /></AdminRoute>) },

      // admin && employer
      { path: "/post-job", element: (<AdminAndEmployerRoute><CreateJob /></AdminAndEmployerRoute>) },
    ],
  },
]);

export default router
