import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import './Pages.css';


const API_URL = "http://localhost:8000";

const JobList = ({ refreshStats }) => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({ title: "", description: "", id_company: "" });
  const jobsPerPage = 5;

  const fetchJobs = async () => {
    const res = await fetch(`${API_URL}/jobs`);
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const DeleteJob = async (id) => {
    await fetch(`${API_URL}/jobs/${id}`, { method: "DELETE" });
    await fetchJobs();
    refreshStats();
  };

  const AddJob = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Erreur ajout job :", err);
      alert("Erreur lors de la création de l'annonce : " + (err.detail || JSON.stringify(err)));
      return;
    }

    const createdJob = await res.json();
    setJobs((prevJobs) => [createdJob, ...prevJobs]);
    setNewJob({ title: "", description: "", id_company: "" });
    refreshStats();
  };



  const EditJob = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/jobs/${editingJob.id_ad}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingJob),
    });
    setEditingJob(null);
    await fetchJobs();
    refreshStats();
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const [showAddModal, setShowAddModal] = useState(false);


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="page-title">Offres d’emploi</h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[oklch(43.2%_0.232_292.759)] hover:bg-[oklch(38%_0.189_293.745)] text-white rounded-full w-13 h-13 items-center justify-center focus:outline-none"
        >
          +
        </button>
      </div>

      {/* <form onSubmit={AddJob} className="mb-6 flex gap-3">
        <input type="text" placeholder="Titre" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="border p-2 rounded w-1/3" />
        <input type="text" placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="border p-2 rounded w-1/3" />
        <input type="number" placeholder="ID société" value={newJob.id_company} onChange={(e) => setNewJob({ ...newJob, id_company: e.target.value ? Number(e.target.value) : null, })} className="border p-2 rounded w-1/6" />
        <button type="submit" className="btn-primary"> Ajouter</button>
      </form> */}

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Titre</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentJobs.map((job) => (
            <tr key={job.id_ad}>
              <td className="border p-2">{job.title}</td>
              <td className="border p-2">{job.description}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => setEditingJob(job)} className="btnmod">Modifier</button>
                <button onClick={() => DeleteJob(job.id_ad)} className="btnsup text-white">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {editingJob && (
        <form onSubmit={EditJob} className="mt-4 flex gap-3">
          <input type="text" value={editingJob.title} onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })} className="border p-2 rounded w-1/3" />
          <input type="text" value={editingJob.description} onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })} className="border p-2 rounded w-1/3" />
          <button type="submit" className="btnenv text-white"> Enregistrer</button>
          <button type="button" onClick={() => setEditingJob(null)} className="btnannul text-white">Annuler</button>
        </form>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">
            <h3 className="text-purple font-bold mb-4">Ajouter une offre</h3>
            <form onSubmit={AddJob} className="flex flex-col gap-3">
              <input type="text" placeholder="Titre" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="border p-2 rounded" required/>
              <input type="number" placeholder="ID société" value={newJob.id_company} onChange={(e) => setNewJob({...newJob,id_company: e.target.value ? Number(e.target.value) : null,})} className="border p-2 rounded" required />

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded focus:outline-none"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded focus:outline-none"
                >
                  Ajouter
                </button>

              </div>
            </form>

          </div>
        </div>
      )}


    </div>
  );
};

export default JobList;