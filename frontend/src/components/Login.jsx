import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api";

function Login({ setToken, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setAuthToken(res.data.token);
      setSuccess("Login successful!");
      
      // Delay navigation slightly to show the success message
      setTimeout(() => {
        if (res.data.user.role === "admin") navigate("/admin");
        else navigate("/notes");
      }, 500);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm transform transition-transform duration-500 ease-in-out hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-white text-center mb-6">
          Login
        </h2>

        {/* Dynamic feedback messages */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-3 rounded-lg text-sm mb-4 animate-fadeIn">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors duration-300 placeholder-gray-400"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 text-white rounded-lg border border-transparent focus:border-blue-500 focus:outline-none transition-colors duration-300 placeholder-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`w-full p-3 font-semibold text-white rounded-lg shadow-lg transform transition-transform duration-300 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-95"
            }`}
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;