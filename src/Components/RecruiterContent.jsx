import React, { useState } from "react";
import RecruiterJobList from "./RecruiterJobList.jsx";
import ApplicationsList from "./ApplicationsList.jsx";

const RecruiterContent = () => {
  const [view, setView] = useState("jobs");

  return (
    <div className="flex flex-col md:flex-row">
      <aside className="sidebar md:block hidden">
        <ul>
          <li onClick={() => setView("jobs")}>Mes offres</li>
          <li onClick={() => setView("applications")}>Candidatures</li>
        </ul>
      </aside>

      <main className="flex-1 p-4">
        {view === "jobs" && <RecruiterJobList />}
        {view === "applications" && <ApplicationsList />}
      </main>
    </div>
  );
};

export default RecruiterContent;
