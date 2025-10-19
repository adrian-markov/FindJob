import React, { useState, useEffect } from "react";
import JobList from "./JobList.jsx";
import CompanyList from "./CompanyList.jsx";
import UserList from "./UserList.jsx";
import Sidebar from "./Sidebar.jsx";

const API_URL = "http://localhost:8000";

const DashboardContent = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalUsers: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("dashboard");

  const fetchStats = async () => {
    try {
      const [jobsRes, companiesRes, usersRes] = await Promise.all([
        fetch(`${API_URL}/jobs`),
        fetch(`${API_URL}/companies`),
        fetch(`${API_URL}/users`),
      ]);
      const [jobsData, companiesData, usersData] = await Promise.all([
        jobsRes.json(),
        companiesRes.json(),
        usersRes.json(),
      ]);
      setStats({
        totalJobs: jobsData.length,
        totalCompanies: companiesData.length,
        totalUsers: usersData.length,
        totalApplications: 0, 
      });
    } catch (error) {
      console.error("Erreur lors du chargement des stats :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <main className="main-content"><h2>Chargement...</h2></main>;

  return (
    <div className="content-container">
      <Sidebar setView={setView} />

      <main className="main-content">
        {view === "dashboard" && (
          <>
            <h2 className="page-title">Tableau de bord</h2>
            <div className="dashboard-grid">
              <div className="cardad" onClick={() => setView("jobs")}>
                <h3>Offres d'emploi</h3>
                <p>{stats.totalJobs}</p>
              </div>

              <div className="cardad" onClick={() => setView("companies")}>
                <h3>Entreprises</h3>
                <p>{stats.totalCompanies}</p>
              </div>

              <div className="cardad" onClick={() => setView("users")}>
                <h3>Utilisateurs</h3>
                <p>{stats.totalUsers}</p>
              </div>

              <div className="cardad">
                <h3>Candidatures</h3>
                <p>{stats.totalApplications}</p>
              </div>
            </div>
          </>
        )}

        {view !== "dashboard" && (
          <>
            <button
              onClick={() => setView("dashboard")}
              className="btn-primary"
            >
              ← Retour au tableau de bord
            </button>

            {view === "jobs" && <JobList refreshStats={fetchStats} />}
            {view === "companies" && <CompanyList refreshStats={fetchStats} />}
            {view === "users" && <UserList refreshStats={fetchStats} />}
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardContent;