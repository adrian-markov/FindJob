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
    await fetch(`${API_URL}/jobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
    setNewJob({ title: "", description: "", id_company: "" });
    await fetchJobs();
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

  return (
    <div className="p-4">
      <h2 className="page-title">Offres d’emploi</h2>

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

      <br></br>
      <form onSubmit={AddJob} className="mb-6 flex gap-3">
        <input type="text" placeholder="Titre" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} className="border p-2 rounded w-1/3" />
        <input type="text" placeholder="Description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} className="border p-2 rounded w-1/3" />
        <input type="number" placeholder="ID société" value={newJob.id_company} onChange={(e) => setNewJob({ ...newJob, id_company: Number(e.target.value) })} className="border p-2 rounded w-1/6" />
        <button type="submit" className="btn-primary"> Ajouter</button>
      </form>
    </div>
  );
};

export default JobList;
