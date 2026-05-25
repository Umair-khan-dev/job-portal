import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-bold text-2xl">
          Job Portal
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/">Home</Link>
          <Link to="/jobs">Jobs</Link>

          {user ? (
            <>
              {user.role === "admin" && (
                <>
                  <Link to="/admin">Admin</Link>
                  <Link to="/applications-received">Received</Link>
                </>
              )}
              {user.role === "candidate" && (
                <Link to="/my-applications">Dashboard</Link>
              )}
              <Link to="/profile">Profile</Link>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-white text-blue-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
