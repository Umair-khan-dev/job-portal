import { Link } from "react-router-dom";

function JobCard({ job, showApply = false }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow hover:shadow-md transition h-full flex flex-col">
      <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
      <p className="text-gray-600 mt-1">{job.location}</p>
      <p className="text-sm text-blue-600 mt-1">{job.employmentType}</p>
      <p className="text-sm text-gray-500 capitalize">
        {job.experienceLevel} level
      </p>
      {job.salaryMax > 0 && (
        <p className="text-sm mt-1">
          ${job.salaryMin?.toLocaleString()} – ${job.salaryMax?.toLocaleString()}
        </p>
      )}
      <div className="mt-auto pt-4 flex flex-wrap gap-2">
        <Link
          to={`/jobs/${job._id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          View Details
        </Link>
        {showApply && (
          <Link
            to={`/apply/${job._id}`}
            className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50 text-sm"
          >
            Apply
          </Link>
        )}
      </div>
    </div>
  );
}

export default JobCard;
