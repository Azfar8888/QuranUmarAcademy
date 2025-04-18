import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import SuperAdminAttendance from "views/examples/SuperAdminAttendance";
import SuperAdminHomework from "views/examples/SuperAdminHomework";
import StudentHomework from "views/examples/StudentHomework";
import Homework from "views/examples/Homework";
import Attendance from "views/examples/Attendance";
var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-fat-delete text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/assign-students",
    name: "Student Assigning",
    icon: "ni ni-fat-delete text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/user-register",
    name: "User Register",
    icon: "ni ni-fat-delete text-pink",
    component: <Register />,
    layout: "/admin",
  },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "ni ni-fat-delete text-blue",
  //   component: <Icons />,
  //   layout: "/admin",
  // },
  {
    path: "/Attendance",
    name: "Attendance Sheet",
    icon: "ni ni-fat-delete text-orange",
    component: <Attendance />,
    layout: "/admin",
  },
  {
    path: "/Homework",
    name: "Homework",
    icon: "ni ni-book-bookmark text-blue",
    component: <Homework />,
    layout: "/admin",
  },
  // {
  //   path: "/Homework",
  //   name: "Homework Sheet",
  //   icon: "ni ni-fat-delete text-orange",
  //   component: <SuperAdminHomework />,
  //   layout: "/admin",
  // },
  // {
  //   path: "/Homework",
  //   name: "Homework",
  //   icon: "ni ni-book-bookmark text-blue",
  //   component: <StudentHomework />,
  //   layout: "/admin",
  // },
  {
    path: "/user-profile",
    name: "User Profile",
    icon: "ni ni-fat-delete text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  // {
  //   path: "/tables",
  //   name: "Tables",
  //   icon: "ni ni-fat-delete text-red",
  //   component: <Tables />,
  //   layout: "/admin",
  // },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-fat-delete text-info",
    component: <Login />,
    layout: "/auth",
  },
];
export default routes;
