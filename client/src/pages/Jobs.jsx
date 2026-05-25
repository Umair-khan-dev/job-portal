import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import ScrollableJobList from "../components/ScrollableJobList";
import Loader from "../components/Loader";

const emptyFilters = {
  keyword: "",
  location: "",
  employmentType: "",
  experienceLevel: "",
  minSalary: "",
  maxSalary: "",
  skills: "",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(emptyFilters);

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");
  const resultCount = jobs.length;

  const fetchJobs = useCallback(async (activeFilters) => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v !== "")
      );
      const { data } = await API.get("/jobs", { params });

      const list = Array.isArray(data) ? data : data.jobs || [];
      const suggested = Array.isArray(data) ? [] : data.suggestions || [];

      setJobs(list);
      setSuggestions(suggested);
      setShowSuggestions(list.length === 0 && suggested.length > 0);
    } catch {
      toast.error("Failed to load jobs. Is the server running?");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(emptyFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const textFields = ["keyword", "location", "minSalary", "maxSalary", "skills"];
    const hasText = textFields.some((k) => filters[k] !== "");
    if (!hasText) return;

    const timer = setTimeout(() => fetchJobs(filters), 600);
    return () => clearTimeout(timer);
  }, [
    filters.keyword,
    filters.location,
    filters.minSalary,
    filters.maxSalary,
    filters.skills,
  ]);

  const clearFilters = () => {
    setFilters(emptyFilters);
    fetchJobs(emptyFilters);
  };

  const renderJobGrid = (list) => (
    <div className="grid md:grid-cols-2 gap-4">
      {list.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-2">Job Listings</h1>
      <p className="text-gray-600 mb-6">
        Scroll through jobs below. Click View Details → Apply to send your application.
      </p>

      <JobFilters
        filters={filters}
        setFilters={setFilters}
        onSearch={fetchJobs}
        onClear={clearFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={showSuggestions ? suggestions.length : resultCount}
        loading={loading}
      />

      {loading ? (
        <Loader />
      ) : jobs.length === 0 && !showSuggestions ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-700 font-medium">No jobs match your filter.</p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Clear filter & show all
            </button>
          ) : (
            <p className="text-gray-500 mt-2 text-sm">
              No jobs posted yet. Admin → Create Job to add listings.
            </p>
          )}
        </div>
      ) : (
        <>
          {jobs.length > 0 && (
            <ScrollableJobList title={`Jobs (${jobs.length}) — scroll to browse`}>
              {renderJobGrid(jobs)}
            </ScrollableJobList>
          )}

          {showSuggestions && (
            <div className="mt-6">
              <p className="text-amber-700 bg-amber-50 border border-amber-200 p-4 rounded-lg mb-4">
                No exact match. Similar jobs:
              </p>
              <ScrollableJobList title="Suggested jobs">
                {renderJobGrid(suggestions)}
              </ScrollableJobList>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;
