import React from "react";

const Sidebar = ({ setView }) => {
  return (
    <aside className="sidebar">
      <ul>
        <li onClick={() => setView("dashboard")}>Tableau de bord</li>
        <li onClick={() => setView("jobs")}>Offres d’emploi</li>
        <li onClick={() => setView("companies")}>Entreprises</li>
        <li onClick={() => setView("users")}>Utilisateurs</li>
      </ul>
    </aside>
  );
};

export default Sidebar;
