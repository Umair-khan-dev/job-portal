import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

function ATSResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/applications/ats")
      .then(({ data }) => setResults(data))
      .catch(() => toast.error("Failed to load ATS results"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-[70vh]">
      <Sidebar />
      <div className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">ATS Results</h1>
        <p className="text-gray-600 mb-6">
          Scoring: Skills 50% · Experience 30% · Keywords 20%
        </p>

        {loading ? (
          <Loader />
        ) : (
          <div className="space-y-4">
            {results.map((app) => (
              <div key={app._id} className="bg-white p-5 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-bold text-lg">{app.fullName}</h2>
                    <p className="text-gray-600">{app.job?.title}</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">{app.atsScore}/100</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3 text-sm">
                  <span>Skills: {app.skillsMatch}%</span>
                  <span>Experience: {app.experienceMatch}%</span>
                  <span>Keywords: {app.keywordMatch}%</span>
                </div>
                {app.missingSkills?.length > 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    Missing skills: {app.missingSkills.join(", ")}
                  </p>
                )}
              </div>
            ))}
            {results.length === 0 && (
              <p className="text-gray-500">No ATS data yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSResults;
