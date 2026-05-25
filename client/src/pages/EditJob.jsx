import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then(({ data }) =>
        setForm({
          title: data.title,
          description: data.description,
          requiredSkills: (data.requiredSkills || []).join(", "),
          experienceLevel: data.experienceLevel,
          salaryMin: data.salaryMin,
          salaryMax: data.salaryMax,
          location: data.location,
          employmentType: data.employmentType,
          isPublished: data.isPublished,
        })
      )
      .catch(() => toast.error("Job not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.put(`/jobs/${id}`, form);
      toast.success("Job updated");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      toast.success("Job deleted");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading || !form) return <div className="flex"><Sidebar /><Loader /></div>;

  return (
    <div className="flex min-h-[70vh]">
      <Sidebar />
      <div className="p-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Edit Job</h1>
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-6 rounded-lg shadow flex flex-col gap-3">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border p-3 rounded" />
          <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border p-3 rounded" />
          <input value={form.requiredSkills} onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })} placeholder="Skills" className="border p-3 rounded" />
          <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="border p-3 rounded">
            {["entry", "junior", "mid", "senior", "lead"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })} className="border p-3 rounded" />
            <input type="number" value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })} className="border p-3 rounded" />
          </div>
          <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="border p-3 rounded" />
          <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="border p-3 rounded">
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} />
            Published
          </label>
          <button type="submit" disabled={saving} className="bg-blue-600 text-white p-3 rounded">
            {saving ? "Saving..." : "Update Job"}
          </button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white p-3 rounded">
            Delete Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;
