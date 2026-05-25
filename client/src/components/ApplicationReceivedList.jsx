import { fileUrl } from "../services/api";

function ApplicationReceivedList({ applications, onShortlist, onReject, loading }) {
  if (loading) {
    return <p className="text-gray-500 p-4">Loading applications...</p>;
  }

  if (!applications?.length) {
    return (
      <p className="text-gray-500 p-6 text-center">
        No applications received yet. Candidates can apply from job listings.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map((app) => (
        <li
          key={app._id}
          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
        >
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <p className="font-bold text-gray-900">{app.fullName}</p>
              <p className="text-sm text-gray-500">{app.email}</p>
              {app.phone && (
                <p className="text-sm text-gray-500">{app.phone}</p>
              )}
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                ATS {app.atsScore}/100
              </span>
              <p className="text-xs text-gray-500 mt-1 capitalize">{app.status}</p>
            </div>
          </div>

          <p className="mt-2 text-sm">
            <span className="font-medium">Job:</span> {app.job?.title || "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Received: {new Date(app.createdAt).toLocaleString()}
          </p>

          <div className="flex flex-wrap gap-3 mt-3">
            {app.resume && (
              <a
                href={fileUrl(app.resume)}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Download resume
              </a>
            )}
            <button
              type="button"
              onClick={() => onShortlist(app._id)}
              className="text-sm text-green-600 hover:underline"
            >
              Shortlist
            </button>
            <button
              type="button"
              onClick={() => onReject(app._id)}
              className="text-sm text-red-600 hover:underline"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default ApplicationReceivedList;
