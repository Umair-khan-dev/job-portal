import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import API, { fileUrl } from "../services/api";
import { setUser } from "../redux/authSlice";
import Loader from "../components/Loader";

function ApplyJob() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(user?.resume || "");
  const [uploadingResume, setUploadingResume] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    Promise.all([API.get(`/jobs/${id}`), API.get("/auth/profile")])
      .then(([jobRes, profileRes]) => {
        setJob(jobRes.data);
        const profile = profileRes.data;
        dispatch(setUser(profile));
        setResumeUrl(profile.resume || "");
        setForm({
          fullName: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        });
      })
      .catch(() => toast.error("Failed to load job or profile"))
      .finally(() => setLoading(false));
  }, [id, dispatch]);

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingResume(true);
    const fd = new FormData();
    fd.append("resume", file);
    try {
      const { data: uploaded } = await API.post("/upload/resume", fd);
      const { data: updated } = await API.put("/auth/profile", {
        resume: uploaded.url,
      });
      dispatch(setUser(updated));
      setResumeUrl(uploaded.url);
      toast.success("Resume uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Resume upload failed");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error("Please upload your resume below");
      return;
    }
    setSubmitting(true);
    try {
      await API.post(`/applications/apply/${id}`, {
        ...form,
        resume: resumeUrl,
      });
      toast.success("Application submitted successfully!");
      navigate("/my-applications");
    } catch (err) {
      toast.error(err.response?.data?.message || "Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!job) return <p className="p-10">Job not found.</p>;

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <div className="bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-2">Apply for {job.title}</h1>
        <p className="text-gray-600 mb-6">
          Submit your application. Resume is required (PDF or DOCX).
        </p>

        <form onSubmit={handleApply} className="flex flex-col gap-3">
          <input
            required
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            className="border p-3 rounded"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border p-3 rounded"
          />
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border p-3 rounded"
          />

          <div className="border rounded p-3 bg-gray-50">
            <label className="block text-sm font-medium mb-2">Resume *</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleResumeUpload}
              disabled={uploadingResume}
              className="mb-2"
            />
            {uploadingResume && (
              <p className="text-sm text-gray-500">Uploading...</p>
            )}
            {resumeUrl && (
              <a
                href={fileUrl(resumeUrl)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm"
              >
                View uploaded resume
              </a>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !resumeUrl}
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyJob;
