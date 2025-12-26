import React from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h2 className="mb-4">Welcome User 🎉</h2>
        <p>You are logged in. Enjoy your dashboard!</p>
        <button className="btn btn-danger mt-3" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
