// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children }) => {
//   const token = localStorage.getItem("token"); // ✅ Check if user is logged in

//   return token ? children : <Navigate to="/auth/login" replace />;
// };

// export default PrivateRoute;


import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")) || {};

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/admin/index" replace />; // Redirect to Dashboard if unauthorized
  }

  return <Outlet />;
};

export default PrivateRoute;
