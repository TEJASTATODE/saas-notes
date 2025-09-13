import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Notes from "./components/Notes";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const PrivateRoute = ({ children, roles }) => {
    if (!token) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/notes" />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login setToken={setToken} setUser={setUser} />} />
      <Route path="/notes" element={<PrivateRoute><Notes user={user} /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminDashboard user={user} /></PrivateRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
