import { Link } from "react-router-dom";

function ScrollableApplicationList({ applications, emptyMessage }) {
  if (!applications?.length) {
    return (
      <p className="text-gray-500 text-center p-6">{emptyMessage}</p>
    );
  }

  return (
    <ul className="space-y-3">
      {applications.map((app) => (
        <li
          key={app._id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          <h3 className="font-bold text-lg">{app.job?.title || "Job"}</h3>
          <p className="text-gray-600 text-sm">{app.job?.location}</p>
          <p className="mt-2">
            Status:{" "}
            <span
              className={`capitalize font-medium ${
                app.status === "shortlisted"
                  ? "text-green-600"
                  : app.status === "rejected"
                    ? "text-red-600"
                    : "text-yellow-600"
              }`}
            >
              {app.status}
            </span>
          </p>
          <p className="text-sm text-gray-500">ATS: {app.atsScore}/100</p>
          <p className="text-xs text-gray-400 mt-1">
            Sent {new Date(app.createdAt).toLocaleString()}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function EmptyApplicationsCTA() {
  return (
    <div className="text-center p-6">
      <p className="text-gray-700 font-medium mb-2">
        You have not sent any applications yet.
      </p>
      <Link
        to="/jobs"
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Browse scrolling job listings
      </Link>
    </div>
  );
}

export default ScrollableApplicationList;
