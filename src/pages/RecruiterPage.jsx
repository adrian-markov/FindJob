import React, { useState, useEffect } from "react";
import Nav from "../Components/Nav.jsx";
import { getRecruiterJobs, getCompanyByRecruiter, getApplicationsByJob } from "../api/recruiter.jsx";
import JobApplicationsModal from "../Components/JobApplicationsModal.jsx";

export default function RecruiterPage() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  
  const recruiterId = localStorage.getItem("userId"); 

  useEffect(() => {
    if (!recruiterId) return;

    async function fetchData() {
      const companyData = await getCompanyByRecruiter(recruiterId);
      setCompany(companyData);

      const jobsData = await getRecruiterJobs(recruiterId);
      setJobs(jobsData);
    }

    fetchData();
  }, [recruiterId]);

  const viewApplications = async (jobId) => {
    const apps = await getApplicationsByJob(jobId);
    setSelectedApplications(apps);
    setIsModalOpen(true);
  };

  return (
    <div className="recruiter-page">
      <Nav />

      <main className="pt-16 p-6 bg-[#f8f5fc] min-h-screen">
        {company && (
          <div className="mb-6 p-6 bg-white rounded shadow flex items-center gap-6">
            {company.logo_url && (
              <img
                src={`/src/assets/${company.logo_url}`}
                alt={company.name}
                className="w-24 h-24 object-cover rounded"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-violet-700">{company.name}</h2>
              <p className="text-gray-700">{company.description}</p>
              {company.website && (
                <a href={company.website} className="text-blue-500 underline">
                  Visiter le site
                </a>
              )}
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold mb-4">Mes offres publiées</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <div key={job.id_ad} className="p-4 bg-white rounded shadow">
              <h3 className="text-lg font-semibold text-violet-700">{job.title}</h3>
              <p className="text-gray-700 mb-2">{job.location} - {job.contract_type}</p>
              <p className="text-gray-500 text-sm mb-2">
                {job.experience_level ? `Niveau: ${job.experience_level}` : ""}
              </p>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                onClick={() => viewApplications(job.id_ad)}
              >
                Voir les candidatures
              </button>
            </div>
          ))}
        </div>
      </main>

      <JobApplicationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        applications={selectedApplications}
      />
    </div>
  );
}