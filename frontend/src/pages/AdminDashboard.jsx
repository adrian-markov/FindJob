import Navbar from "../Components/NavBar.jsx";
import DashboardContent from "../Components/DashboardContent.jsx";

const AdminDashboard = () => {
  return (
    <div className="admin-container">
      <Navbar />
      <div className="content-container">
        <DashboardContent />
      </div>
    </div>
  );
};

export default AdminDashboard;