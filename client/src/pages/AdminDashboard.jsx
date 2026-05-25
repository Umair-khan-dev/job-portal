import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import ScrollableJobList from "../components/ScrollableJobList";
import ApplicationReceivedList from "../components/ApplicationReceivedList";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    Promise.all([
      API.get("/applications/dashboard/stats"),
      API.get("/jobs/admin/all"),
      API.get("/applications"),
    ])
      .then(([statsRes, jobsRes, appsRes]) => {
        setStats(statsRes.data);
        setJobs(jobsRes.data);
        setRecentApps(appsRes.data.slice(0, 20));
      })
      .catch(() => toast.error("Failed to load dashboard"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar pendingCount={stats?.totalApplications ?? 0} />
      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Total Jobs Posted</p>
            <p className="text-4xl font-bold text-blue-600">{stats?.totalJobs ?? 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-500">Applications Received</p>
            <p className="text-4xl font-bold text-green-600">
              {stats?.totalApplications ?? 0}
            </p>
            <Link
              to="/applications-received"
              className="text-sm text-blue-600 mt-2 inline-block hover:underline"
            >
              View all received →
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ScrollableJobList title="Job postings" maxHeight="max-h-64">
            <ul className="space-y-2 text-sm">
              {jobs.map((job) => (
                <li key={job._id} className="flex justify-between border-b pb-2">
                  <span>{job.title}</span>
                  <Link to={`/edit-job/${job._id}`} className="text-blue-600">
                    Edit
                  </Link>
                </li>
              ))}
              {jobs.length === 0 && (
                <li className="text-gray-500">
                  <Link to="/create-job" className="text-blue-600">
                    Create a job
                  </Link>
                </li>
              )}
            </ul>
          </ScrollableJobList>

          <ScrollableJobList
            title="Latest applications received"
            maxHeight="max-h-64"
          >
            <ApplicationReceivedList
              applications={recentApps}
              loading={false}
              onShortlist={() => {}}
              onReject={() => {}}
            />
            {recentApps.length > 0 && (
              <Link
                to="/applications-received"
                className="block text-center text-blue-600 text-sm mt-3 hover:underline"
              >
                Manage all applications
              </Link>
            )}
          </ScrollableJobList>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
