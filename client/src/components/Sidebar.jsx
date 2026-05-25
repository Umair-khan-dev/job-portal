import { Link, useLocation } from "react-router-dom";

function Sidebar({ pendingCount = 0 }) {
  const location = useLocation();

  const linkClass = (path) =>
    `hover:text-blue-300 ${location.pathname === path ? "text-blue-400 font-semibold" : ""}`;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5 shrink-0">
      <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

      <div className="flex flex-col gap-4">
        <Link to="/admin" className={linkClass("/admin")}>
          Dashboard
        </Link>

        <Link to="/create-job" className={linkClass("/create-job")}>
          Create Job
        </Link>

        <Link to="/applications-received" className={linkClass("/applications-received")}>
          Applications Received
          {pendingCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {pendingCount}
            </span>
          )}
        </Link>

        <Link to="/applications" className={linkClass("/applications")}>
          Applications Table
        </Link>

        <Link to="/ats-results" className={linkClass("/ats-results")}>
          ATS Results
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
