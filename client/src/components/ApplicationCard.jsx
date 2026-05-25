import { Link } from "react-router-dom";
import ApplicationStatusTracker from "./ApplicationStatusTracker";

function ApplicationCard({ application }) {
  const app = application;
  const job = app.job;

  return (
    <li className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex flex-wrap justify-between gap-2">
        <div>
          <h3 className="font-bold text-xl text-gray-900">
            {job?.title || "Job"}
          </h3>
          <p className="text-gray-600 text-sm">{job?.location}</p>
          {job?.employmentType && (
            <p className="text-sm text-blue-600">{job.employmentType}</p>
          )}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{app.atsScore}/100</div>
          <p className="text-xs text-gray-500">ATS match</p>
        </div>
      </div>

      <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${Math.min(100, app.atsScore || 0)}%` }}
        />
      </div>

      {(app.skillsMatch != null || app.experienceMatch != null) && (
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-600">
          <span>Skills: {app.skillsMatch ?? "—"}%</span>
          <span>Experience: {app.experienceMatch ?? "—"}%</span>
          <span>Keywords: {app.keywordMatch ?? "—"}%</span>
        </div>
      )}

      {app.missingSkills?.length > 0 && (
        <p className="text-sm text-amber-700 mt-2 bg-amber-50 p-2 rounded">
          Improve profile: add {app.missingSkills.join(", ")}
        </p>
      )}

      <ApplicationStatusTracker status={app.status} />

      <p className="text-xs text-gray-400 mt-3">
        Applied {new Date(app.createdAt).toLocaleString()}
      </p>

      {job?._id && (
        <Link
          to={`/jobs/${job._id}`}
          className="inline-block mt-3 text-sm text-blue-600 hover:underline"
        >
          View job listing →
        </Link>
      )}
    </li>
  );
}

export default ApplicationCard;
