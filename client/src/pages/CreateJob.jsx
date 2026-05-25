import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../components/Sidebar";

const initial = {
  title: "",
  description: "",
  requiredSkills: "",
  experienceLevel: "mid",
  salaryMin: "",
  salaryMax: "",
  location: "",
  employmentType: "On-site",
  isPublished: true,
};

function CreateJob() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/jobs", form);
      toast.success("Job created");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh]">
      <Sidebar />
      <div className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Create Job Posting</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow flex flex-col gap-3">
          <input required placeholder="Job Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-3 rounded" />
          <textarea required placeholder="Job Description" rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-3 rounded" />
          <input placeholder="Required Skills (comma separated)" value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} className="border p-3 rounded" />
          <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="border p-3 rounded">
            <option value="entry">Entry</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Min Salary" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} className="border p-3 rounded" />
            <input type="number" placeholder="Max Salary" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} className="border p-3 rounded" />
          </div>
          <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border p-3 rounded" />
          <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="border p-3 rounded">
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Publish job
          </label>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;
