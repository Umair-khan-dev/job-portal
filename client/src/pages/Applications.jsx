import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API, { fileUrl } from "../services/api";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

function Applications() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobFilter, setJobFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApps = (jobId = "") => {
    setLoading(true);
    const params = jobId ? { jobId } : {};
    API.get("/applications", { params })
      .then(({ data }) => setApps(data))
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    API.get("/jobs/admin/all").then(({ data }) => setJobs(data));
    fetchApps();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await API.patch(`/applications/${id}/status`, { status });
      setApps((prev) => prev.map((a) => (a._id === id ? data : a)));
      toast.success(`Marked as ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="flex min-h-[70vh]">
      <Sidebar />
      <div className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Applications</h1>

        <select
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value);
            fetchApps(e.target.value);
          }}
          className="border p-2 rounded mb-4"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>{j.title}</option>
          ))}
        </select>

        {loading ? (
          <Loader />
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">Applicant</th>
                  <th className="p-3">Job</th>
                  <th className="p-3">ATS</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Resume</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="p-3">{app.fullName}<br /><span className="text-gray-500">{app.email}</span></td>
                    <td className="p-3">{app.job?.title}</td>
                    <td className="p-3 font-semibold">{app.atsScore}/100</td>
                    <td className="p-3 capitalize">{app.status}</td>
                    <td className="p-3">
                      {app.resume && (
                        <a href={fileUrl(app.resume)} target="_blank" rel="noreferrer" className="text-blue-600">
                          Download
                        </a>
                      )}
                    </td>
                    <td className="p-3 space-x-2">
                      <button type="button" onClick={() => updateStatus(app._id, "shortlisted")} className="text-green-600 text-xs">Shortlist</button>
                      <button type="button" onClick={() => updateStatus(app._id, "rejected")} className="text-red-600 text-xs">Reject</button>
                    </td>
                  </tr>
                ))}
                {apps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-gray-500">No applications yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;
