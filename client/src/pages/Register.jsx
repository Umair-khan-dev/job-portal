import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import API from "../services/api";
import { loginSuccess } from "../redux/authSlice";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", form);
      dispatch(loginSuccess(data));
      toast.success("Account created");
      navigate(data.role === "admin" ? "/admin" : "/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6">Register</h1>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-3 mb-3 rounded"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border p-3 mb-3 rounded"
        />

        <input
          type="password"
          placeholder="Password (min 6 chars)"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border p-3 mb-3 rounded"
        />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full border p-3 mb-4 rounded"
        >
          <option value="candidate">Job Seeker (Candidate)</option>
          <option value="admin">Administrator (Recruiter)</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white w-full p-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Register"}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
