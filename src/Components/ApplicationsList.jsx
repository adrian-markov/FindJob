import React, { useEffect, useState } from "react";
import "./Pages.css";

const API_URL = "http://localhost:8000";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    const res = await fetch(`${API_URL}/recruiter/applications`);
    const data = await res.json();
    setApplications(data);
  };

  useEffect(() => { fetchApplications(); }, []);

  const truncate = (text, max) => text.length > max ? text.slice(0, max) + "…" : text;

  return (
    <div>
      <h2 className="page-title mb-4">Candidatures reçues</h2>
      {applications.length === 0 ? (
        <div>Aucune candidature pour le moment.</div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Offre</th>
                  <th className="p-2 border">Candidat</th>
                  <th className="p-2 border">Email</th>
                  <th className="p-2 border">Message</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id_application}>
                    <td className="p-2 border">{truncate(app.job_title, 30)}</td>
                    <td className="p-2 border">{app.user_name}</td>
                    <td className="p-2 border">{app.user_email}</td>
                    <td className="p-2 border">{truncate(app.message, 50)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {applications.map(app => (
              <div key={app.id_application} className="bg-white border rounded-lg p-3 shadow-sm">
                <div className="font-semibold text-base">{app.job_title}</div>
                <div className="text-gray-600 text-sm">📧 {app.user_email}</div>
                <div className="text-gray-800 text-sm">{truncate(app.message, 100)}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ApplicationsList;
