import React, { useEffect, useState } from "react";
import Navbar from "../Components/Nav.jsx";

const API_URL = "http://localhost:8000";

const RecruiterDashboard = ({ recruiterId }) => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    contract_type: "",
    location: "",
    salary: "",
    remote: false,
    experience_level: "junior",
  });

  useEffect(() => {
    fetchJobs();
  }, [recruiterId]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_URL}/jobs?contact=${recruiterId}`);
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setJobs([]);
    }
  };

  const openModal = async (job) => {
    setSelectedJob(job);
    try {
      const res = await fetch(`${API_URL}/applications?job=${job.id_ad}`);
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
      setModalOpen(true);
    } catch (err) {
      console.error(err);
      setApplications([]);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
    setApplications([]);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submitNewJob = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newJob, id_contact_user: recruiterId }),
      });
      if (res.ok) {
        fetchJobs();
        setNewJob({
          title: "",
          description: "",
          contract_type: "",
          location: "",
          salary: "",
          remote: false,
          experience_level: "junior",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold text-violet-600 mb-6">
          Tableau de bord recruteur
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 grid sm:grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id_ad}
                className="bg-white border border-gray-200 rounded-xl shadow hover:shadow-md transition cursor-pointer p-5"
                onClick={() => openModal(job)}
              >
                <h2 className="font-bold text-xl text-violet-700 mb-2">
                  {job.title}
                </h2>
                <p className="text-gray-600 mb-1">{job.location}</p>
                <p className="text-sm text-gray-500">{job.contract_type}</p>
              </div>
            ))}

            {jobs.length === 0 && (
              <p className="text-gray-500 italic">
                Vous n’avez encore publié aucune offre.
              </p>
            )}
          </div>

          <div className="lg:w-1/3 bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-violet-700 mb-4">
              Publier une offre
            </h2>
            <form className="space-y-4" onSubmit={submitNewJob}>
              <input
                type="text"
                name="title"
                placeholder="Titre de l'offre"
                value={newJob.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newJob.description}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                rows={4}
                required
              />
              <input
                type="text"
                name="contract_type"
                placeholder="Type de contrat"
                value={newJob.contract_type}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="text"
                name="location"
                placeholder="Lieu"
                value={newJob.location}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <input
                type="number"
                name="salary"
                placeholder="Salaire"
                value={newJob.salary}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="remote"
                  checked={newJob.remote}
                  onChange={handleInputChange}
                />
                <label className="text-gray-700">Télétravail possible</label>
              </div>

              <select
                name="experience_level"
                value={newJob.experience_level}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="junior">Junior</option>
                <option value="mid">Intermédiaire</option>
                <option value="senior">Senior</option>
              </select>

              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-md w-full transition"
              >
                Publier l’offre
              </button>
            </form>
          </div>
        </div>
      </div>

      {modalOpen && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-11/12 max-w-2xl p-6 relative shadow-lg">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-violet-600 text-2xl font-bold bg-white/70 rounded-full w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-violet-700 mb-4">
              Candidatures pour {selectedJob.title}
            </h2>
            {applications.length === 0 ? (
              <p className="text-gray-500 italic">
                Aucune candidature pour cette offre.
              </p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {applications.map((app) => (
                  <div
                    key={app.id_application}
                    className="border border-gray-200 p-4 rounded-md bg-gray-50"
                  >
                    <p>
                      <strong>Nom :</strong> {app.applicant_name || "Inconnu"}
                    </p>
                    <p>
                      <strong>Email :</strong> {app.email || "Inconnu"}
                    </p>
                    <p>
                      <strong>Message :</strong> {app.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;
