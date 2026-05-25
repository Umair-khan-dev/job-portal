import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import API, { fileUrl } from "../services/api";
import { setUser, logout } from "../redux/authSlice";
import Loader from "../components/Loader";
import ScrollableJobList from "../components/ScrollableJobList";
import FileUploadBox from "../components/FileUploadBox";

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    skills: "",
    experienceLevel: "",
  });

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/auth/profile");
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        skills: (data.skills || []).join(", "),
        experienceLevel: data.experienceLevel || "",
      });
      dispatch(setUser(data));
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load profile";
      if (err.response?.status === 401) {
        dispatch(logout());
        toast.error(msg);
        navigate("/login?session=expired");
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      toast.error("Session expired. Please log in again.");
    }
  }, [searchParams]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.put("/auth/profile", form);
      dispatch(setUser(data));
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const uploadFile = async (file, type) => {
    const isResume = type === "resume";
    const setUploading = isResume ? setUploadingResume : setUploadingPhoto;

    setUploading(true);
    const fd = new FormData();
    fd.append(isResume ? "resume" : "profilePicture", file);

    try {
      const endpoint = isResume ? "/upload/resume" : "/upload/profile-image";
      const { data: uploaded } = await API.post(endpoint, fd);
      const field = isResume ? "resume" : "profilePicture";
      const { data: updated } = await API.put("/auth/profile", {
        [field]: uploaded.url,
      });
      dispatch(setUser(updated));
      toast.success(isResume ? "Resume uploaded" : "Photo uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">My Profile</h1>
      <p className="text-gray-600 mb-6 capitalize">
        Role: <strong>{user?.role}</strong> — upload photo & resume, then save details
      </p>

      <ScrollableJobList title="Upload files" maxHeight="max-h-[50vh]">
        <div className="flex flex-col sm:flex-row gap-6 mb-4">
          {user?.profilePicture ? (
            <img
              src={fileUrl(user.profilePicture)}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-100 shrink-0"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
              No photo
            </div>
          )}
          <div className="flex-1">
            <FileUploadBox
              label="Profile picture (JPG / PNG)"
              accept=".jpg,.jpeg,.png"
              hint="Max 2MB"
              currentFileName={
                user?.profilePicture ? "Photo saved on server" : ""
              }
              uploading={uploadingPhoto}
              onUpload={(file) => uploadFile(file, "image")}
            />
            <FileUploadBox
              label="Resume (PDF / DOCX)"
              accept=".pdf,.docx"
              hint="Required to apply for jobs"
              currentFileName={user?.resume ? "Resume on file" : ""}
              uploading={uploadingResume}
              onUpload={(file) => uploadFile(file, "resume")}
            />
            {user?.resume && (
              <a
                href={fileUrl(user.resume)}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 text-sm hover:underline"
              >
                View uploaded resume →
              </a>
            )}
          </div>
        </div>
      </ScrollableJobList>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg shadow p-6 flex flex-col gap-3 mt-6"
      >
        <h2 className="text-lg font-semibold">Profile details</h2>
        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-3 rounded"
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border p-3 rounded"
        />
        <input
          placeholder="Skills (comma separated, e.g. node.js, React)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          className="border p-3 rounded"
        />
        <select
          value={form.experienceLevel}
          onChange={(e) =>
            setForm({ ...form, experienceLevel: e.target.value })
          }
          className="border p-3 rounded"
        >
          <option value="">Experience Level</option>
          <option value="entry">Entry</option>
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
          <option value="lead">Lead</option>
        </select>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-4">
        If you see &quot;Invalid token&quot;, click Logout and log in again (server
        may have restarted with a new security key).
      </p>
    </div>
  );
}

export default Profile;
