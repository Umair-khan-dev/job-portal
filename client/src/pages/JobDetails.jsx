import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import API from "../services/api";
import Loader from "../components/Loader";

function JobDetails() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then(({ data }) => setJob(data))
      .catch(() => toast.error("Job not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!job) return <p className="p-10">Job not found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold">{job.title}</h1>
        <p className="text-gray-600 mt-2">{job.location} · {job.employmentType}</p>
        <p className="capitalize text-sm text-blue-600 mt-1">
          {job.experienceLevel} level
        </p>
        {job.salaryMax > 0 && (
          <p className="mt-2 font-medium">
            Salary: ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
          </p>
        )}

        <h2 className="text-xl font-semibold mt-6 mb-2">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>

        {job.requiredSkills?.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mt-6 mb-2">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {user?.role === "candidate" && (
          <Link
            to={`/apply/${job._id}`}
            className="inline-block mt-8 bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Apply Now
          </Link>
        )}

        {user?.role === "admin" && (
          <Link
            to={`/edit-job/${job._id}`}
            className="inline-block mt-8 ml-3 border border-blue-600 text-blue-600 px-6 py-3 rounded"
          >
            Edit Job
          </Link>
        )}
      </div>
    </div>
  );
}

export default JobDetails;
