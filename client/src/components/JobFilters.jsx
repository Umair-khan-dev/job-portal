const filterLabels = {
  keyword: "Keyword",
  location: "Location",
  employmentType: "Type",
  experienceLevel: "Experience",
  minSalary: "Min salary",
  maxSalary: "Max salary",
  skills: "Skills",
};

function JobFilters({ filters, setFilters, onSearch, onClear, hasActiveFilters, resultCount, loading }) {
  const activeEntries = Object.entries(filters).filter(([, v]) => v !== "");

  const removeFilter = (key) => {
    const next = { ...filters, [key]: "" };
    setFilters(next);
    onSearch(next);
  };

  return (
    <div className="bg-white p-5 rounded-lg shadow mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold text-gray-900">Filter Jobs</h2>
        {!loading && (
          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            {resultCount} {resultCount === 1 ? "job" : "jobs"} found
          </span>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeEntries.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => removeFilter(key)}
              className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200"
            >
              <span className="font-medium">{filterLabels[key]}:</span>
              <span>{value}</span>
              <span aria-hidden="true">&times;</span>
            </button>
          ))}
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-red-600 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(filters);
        }}
        className="grid md:grid-cols-3 gap-3"
      >
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Keyword
          </label>
          <input
            placeholder="e.g. web developer"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Location
          </label>
          <input
            placeholder="e.g. Islamabad"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Employment type
          </label>
          <select
            value={filters.employmentType}
            onChange={(e) => {
              const next = { ...filters, employmentType: e.target.value };
              setFilters(next);
              onSearch(next);
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">All types</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Experience
          </label>
          <select
            value={filters.experienceLevel}
            onChange={(e) => {
              const next = { ...filters, experienceLevel: e.target.value };
              setFilters(next);
              onSearch(next);
            }}
            className="w-full border p-2 rounded"
          >
            <option value="">All levels</option>
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Min salary
          </label>
          <input
            type="number"
            placeholder="30000"
            value={filters.minSalary}
            onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Max salary
          </label>
          <input
            type="number"
            placeholder="50000"
            value={filters.maxSalary}
            onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Skills
          </label>
          <input
            placeholder="e.g. React, Node.js"
            value={filters.skills}
            onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex items-end gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Apply filter
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobFilters;
