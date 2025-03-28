import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

const App = () => {
  const navigate = useNavigate();

  return (
    <div
      className="app-container"
      style={{ textAlign: "center", padding: "50px" }}
    >
      <h1>Welcome to the Dashboard Portal</h1>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/user/dashboard")}
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          Go to User Dashboard
        </button>
        <button
          onClick={() => navigate("/admin/dashboard")}
          style={{ margin: "10px", padding: "10px 20px", fontSize: "16px" }}
        >
          Go to Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default App;
