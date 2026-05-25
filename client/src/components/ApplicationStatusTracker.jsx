const steps = [
  { key: "submitted", label: "Submitted" },
  { key: "pending", label: "Under review" },
  { key: "decision", label: "Decision" },
];

function ApplicationStatusTracker({ status }) {
  const decision =
    status === "shortlisted"
      ? { label: "Shortlisted", color: "text-green-600", bg: "bg-green-500" }
      : status === "rejected"
        ? { label: "Rejected", color: "text-red-600", bg: "bg-red-500" }
        : { label: "Pending", color: "text-yellow-600", bg: "bg-yellow-500" };

  const stepIndex =
    status === "pending" ? 1 : status === "shortlisted" || status === "rejected" ? 2 : 0;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        {steps.map((s, i) => (
          <span
            key={s.key}
            className={i <= stepIndex ? "text-blue-600 font-medium" : ""}
          >
            {i === 2 ? decision.label : s.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1 flex items-center">
            <div
              className={`h-2 w-full rounded-full ${
                i <= stepIndex
                  ? i === 2
                    ? decision.bg
                    : "bg-blue-500"
                  : "bg-gray-200"
              }`}
            />
          </div>
        ))}
      </div>
      <p className={`text-sm font-semibold mt-2 capitalize ${decision.color}`}>
        Current status: {status}
      </p>
    </div>
  );
}

export default ApplicationStatusTracker;
