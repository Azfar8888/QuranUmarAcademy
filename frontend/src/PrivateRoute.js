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
