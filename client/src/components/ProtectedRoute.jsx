import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({ children, role }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token && !localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/jobs"} replace />;
  }

  return children;
}

export default ProtectedRoute;
