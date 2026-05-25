import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";
import ScrollableJobList from "../components/ScrollableJobList";
import JobCard from "../components/JobCard";
import ApplicationCard from "../components/ApplicationCard";
import ProfileSummaryCard from "../components/ProfileSummaryCard";

function MyApplications() {
  const { user } = useSelector((state) => state.auth);
  const [apps, setApps] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [appsRes, jobsRes] = await Promise.all([
        API.get("/applications/my"),
        API.get("/jobs"),
      ]);

      const myApps = Array.isArray(appsRes.data)
        ? appsRes.data
        : appsRes.data.applications || [];
      const allJobs = Array.isArray(jobsRes.data)
        ? jobsRes.data
        : jobsRes.data.jobs || [];

      const appliedIds = new Set(
        myApps.map((a) => a.job?._id || a.job).filter(Boolean)
      );
      const openJobs = allJobs.filter((j) => !appliedIds.has(j._id));

      setApps(myApps);
      setAvailableJobs(openJobs);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load data";
      setError(msg);
      if (err.response?.status !== 403) toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (user?.role === "admin") {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">My Applications</h1>
        <Link to="/applications-received" className="text-blue-600">
          View applications received (Admin)
        </Link>
      </div>
    );
  }

  if (loading) return <Loader />;

  const pending = apps.filter((a) => a.status === "pending").length;
  const shortlisted = apps.filter((a) => a.status === "shortlisted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track applications · Browse jobs · Manage your profile
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-red-600 bg-red-50 p-4 rounded-lg mb-4">{error}</p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-blue-600">{apps.length}</p>
          <p className="text-xs text-gray-500">Total sent</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-yellow-600">{pending}</p>
          <p className="text-xs text-gray-500">Under review</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-green-600">{shortlisted}</p>
          <p className="text-xs text-gray-500">Shortlisted</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p className="text-2xl font-bold text-gray-600">{availableJobs.length}</p>
          <p className="text-xs text-gray-500">Jobs you can apply to</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ScrollableJobList
            title={`Track application status (${apps.length})`}
            maxHeight="max-h-[55vh]"
          >
            {apps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No applications sent yet.</p>
                <Link
                  to="/jobs"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                >
                  Browse available jobs
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {apps.map((app) => (
                  <ApplicationCard key={app._id} application={app} />
                ))}
              </ul>
            )}
          </ScrollableJobList>

          <ScrollableJobList
            title={`Available job listings (${availableJobs.length})`}
            maxHeight="max-h-[50vh]"
          >
            {availableJobs.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                No new jobs to apply to. You may have applied to all open listings.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {availableJobs.map((job) => (
                  <JobCard key={job._id} job={job} showApply />
                ))}
              </div>
            )}
            <Link
              to="/jobs"
              className="block text-center text-blue-600 text-sm mt-4 hover:underline"
            >
              View all jobs with filters →
            </Link>
          </ScrollableJobList>
        </div>

        <div className="space-y-4">
          <ProfileSummaryCard user={user} />

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">Quick links</p>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="text-blue-700 hover:underline">
                  Manage profile & upload resume
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="text-blue-700 hover:underline">
                  Search all job listings
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyApplications;
