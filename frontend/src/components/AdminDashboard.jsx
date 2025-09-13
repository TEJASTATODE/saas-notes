import { useEffect, useState } from "react";
import api from "../api";
import InviteUserForm from "./InviteUserForm";

// Placeholder for a loading spinner component
const Loader = () => (
  <div className="flex justify-center items-center my-8">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span className="ml-4 text-gray-400">Loading data...</span>
  </div>
);

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
      const tenantRes = await api.get("/notes");
      setTenant(tenantRes.data.tenant);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    setError(null);
    setSuccess(null);
    try {
      await api.post(`/admin/tenants/${tenant.slug}/upgrade`);
      setSuccess("Tenant successfully upgraded to Pro!");
      fetchUsers(); // Refetch data to show new plan
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upgrade failed.");
    } finally {
      setUpgrading(false);
      setShowConfirmModal(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">Admin Dashboard</h2>
          <span className="text-sm text-gray-400">
            Tenant: <span className="text-blue-400 font-medium">{tenant?.name || "N/A"}</span>
            <span className="ml-2 text-white"> | Plan: </span>
            <span className={`font-semibold ${tenant?.plan === "free" ? "text-yellow-400" : "text-green-400"}`}>
              {tenant?.plan || "N/A"}
            </span>
          </span>
        </header>

        {/* Dynamic Feedback Section */}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg text-sm mb-6 animate-fade-in-down">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-4 rounded-lg text-sm mb-6 animate-fade-in-down">
            {success}
          </div>
        )}

        {/* Upgrade Card and Invite Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Manage Subscription</h3>
            {tenant?.plan === "free" ? (
              <div className="flex flex-col items-center">
                <p className="text-gray-400 text-center mb-6">
                  Your tenant is currently on the **Free** plan. Upgrade to unlock unlimited notes and more features.
                </p>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className={`py-3 px-8 rounded-full font-semibold text-white shadow-lg transition-transform duration-200 ${
                    upgrading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-95"
                  }`}
                  disabled={upgrading}
                >
                  {upgrading ? "Upgrading..." : "Upgrade Tenant to Pro"}
                </button>
              </div>
            ) : (
              <p className="text-center text-green-400 font-semibold text-lg">
                Your tenant is on the Pro plan! 🎉
              </p>
            )}
          </div>
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">Invite New User</h3>
            <InviteUserForm fetchUsers={fetchUsers} />
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-6">User Accounts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">No users found.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  className="bg-gray-700 p-5 rounded-xl shadow-lg transform transition-transform duration-200 hover:scale-[1.03]"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-full bg-blue-500 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-white truncate">{u.email}</p>
                      <p className={`text-sm font-medium ${u.role === "admin" ? "text-red-400" : "text-gray-400"}`}>
                        {u.role.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Confirm Upgrade</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to upgrade your tenant to the **Pro** plan? This action is permanent.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpgrade}
                className={`py-2 px-6 rounded-lg font-semibold text-white shadow-lg transition-colors ${
                  upgrading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={upgrading}
              >
                {upgrading ? "Confirming..." : "Confirm"}
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-6 rounded-lg font-semibold text-gray-800 bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;