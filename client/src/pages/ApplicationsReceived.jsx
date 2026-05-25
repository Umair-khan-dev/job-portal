import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import ScrollableJobList from "../components/ScrollableJobList";
import ApplicationReceivedList from "../components/ApplicationReceivedList";

function ApplicationsReceived() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback((jobId = "") => {
    setLoading(true);
    const params = jobId ? { jobId } : {};
    API.get("/applications", { params })
      .then(({ data }) => setApps(data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    API.get("/jobs/admin/all").then(({ data }) => setJobs(data));
    fetchApps();
    const interval = setInterval(() => fetchApps(jobFilter), 15000);
    return () => clearInterval(interval);
  }, [fetchApps, jobFilter]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await API.patch(`/applications/${id}/status`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? data : a)));
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const pendingCount = apps.filter((a) => a.status === "pending").length;

  return (
    <div className="flex min-h-screen">
      <Sidebar pendingCount={apps.length} />
      <div className="p-6 flex-1 flex flex-col max-h-[calc(100vh-0px)]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold">Applications Received</h1>
            <p className="text-gray-600 mt-1">
              {apps.length} total · {pendingCount} pending review
            </p>
          </div>
          <button
            type="button"
            onClick={() => fetchApps(jobFilter)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        <select
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value);
            fetchApps(e.target.value);
          }}
          className="border p-2 rounded mb-4 max-w-md bg-white"
        >
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title}
            </option>
          ))}
        </select>

        <ScrollableJobList
          title={`Received applications (${apps.length})`}
          maxHeight="max-h-[calc(100vh-220px)]"
        >
          {loading ? (
            <Loader />
          ) : (
            <ApplicationReceivedList
              applications={apps}
              loading={false}
              onShortlist={(id) => updateStatus(id, "shortlisted")}
              onReject={(id) => updateStatus(id, "rejected")}
            />
          )}
        </ScrollableJobList>
      </div>
    </div>
  );
}

export default ApplicationsReceived;
