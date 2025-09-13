import { useState } from "react";
import api from "../api";

function InviteUserForm({ fetchUsers }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post("/admin/users/invite", { email, role });
      setSuccess("User invited successfully!");
      setEmail("");
      setRole("member");
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to invite user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Dynamic Feedback Section */}
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md text-sm mb-4 animate-fade-in-down">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500 text-white p-3 rounded-md text-sm mb-4 animate-fade-in-down">
          {success}
        </div>
      )}
      <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 p-3 bg-gray-700 text-gray-200 rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          disabled={loading}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="p-3 bg-gray-700 text-gray-200 rounded-lg border border-transparent focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
          disabled={loading}
        >
          <option value="member" className="bg-gray-700 text-white">Member</option>
          <option value="admin" className="bg-gray-700 text-white">Admin</option>
        </select>
        <button
          className={`py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-transform duration-200 flex items-center justify-center gap-2 ${
            loading
              ? "bg-blue-500 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
          }`}
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Inviting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v2h-2a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" />
              </svg>
              Invite
            </>
          )}
        </button>
      </form>
    </div>
  );
}

export default InviteUserForm;