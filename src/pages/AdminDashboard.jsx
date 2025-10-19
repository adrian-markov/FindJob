import React from "react";
import Navbar from "../Components/Navbar.jsx";
// import Sidebar from "../components/Sidebar";
import DashboardContent from "../Components/DashboardContent.jsx";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <div className="content-container">
        {/* <Sidebar /> */}
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminDashboard;