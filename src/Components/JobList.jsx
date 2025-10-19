import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import "./Pages.css";

const API_URL = "http://localhost:8000";

const JobList = ({ refreshStats }) => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    contract_type: "",
    location: "",
    salary: "",
    remote: 0,
    experience_level: "junior",
    id_company: ""
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const jobsPerPage = 5;

  const fetchJobs = async () => {
    const res = await fetch(`${API_URL}/jobs`);
    const data = await res.json();
    setJobs(data);
  };

  const fetchCompanies = async () => {
    const res = await fetch(`${API_URL}/companies`);
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
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
    setNewJob({
      title: "",
      description: "",
      contract_type: "",
      location: "",
      salary: "",
      remote: 0,
      experience_level: "junior",
      id_company: ""
    });
    setShowAddModal(false);
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
    setShowEditModal(false);
    setEditingJob(null);
    await fetchJobs();
    refreshStats();
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const truncate = (text, max) => text?.length > max ? text.slice(0, max) + "…" : text || "";

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="page-title text-lg sm:text-xl">Offres d'emploi</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl"
        >
          +
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Titre</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Contrat</th>
              <th className="p-2 border">Lieu</th>
              <th className="p-2 border">Remote</th>
              <th className="p-2 border">Entreprise</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentJobs.map((job) => (
              <tr key={job.id_ad}>
                <td className="border p-2 truncate" style={{ maxWidth: "150px" }}>{truncate(job.title, 20)}</td>
                <td className="border p-2 truncate" style={{ maxWidth: "250px" }}>{truncate(job.description, 40)}</td>
                <td className="border p-2 truncate" style={{ maxWidth: "100px" }}>{truncate(job.contract_type, 15)}</td>
                <td className="border p-2 truncate" style={{ maxWidth: "120px" }}>{truncate(job.location, 15)}</td>
                <td className="border p-2 text-center" style={{ maxWidth: "60px" }}>{job.remote ? "✓" : "-"}</td>
                <td className="border p-2 truncate" style={{ maxWidth: "150px" }}>
                  {truncate(companies.find(c => c.id_company === job.id_company)?.name || "-", 20)}
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button onClick={() => { setEditingJob(job); setShowEditModal(true); }} className="btnmod text-white text-xs px-2 py-1">Modifier</button>
                    <button onClick={() => DeleteJob(job.id_ad)} className="btnsup text-white text-xs px-2 py-1">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {currentJobs.map((job) => (
          <div key={job.id_ad} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="space-y-1 text-sm">
              <div className="font-semibold">{job.title}</div>
              {job.description && <div className="text-gray-600 text-xs line-clamp-2">{job.description}</div>}
              <div className="flex flex-wrap gap-2 text-xs mt-1">
                {job.contract_type && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{job.contract_type}</span>}
                {job.location && <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded">{job.location}</span>}
                {job.remote ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded">Remote</span> : null}
              </div>
              <div className="text-gray-600 text-xs truncate mt-1">
                {companies.find(c => c.id_company === job.id_company)?.name || "-"}
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEditingJob(job); setShowEditModal(true); }} className="btnmod text-white text-xs px-3 py-1.5 flex-1">Modifier</button>
              <button onClick={() => DeleteJob(job.id_ad)} className="btnsup text-white text-xs px-3 py-1.5 flex-1">Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Ajouter une offre</h3>
            <form onSubmit={AddJob} className="flex flex-col gap-2">
              <input type="text" placeholder="Titre" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} className="border p-2 rounded" required />
              <textarea placeholder="Description" value={newJob.description} onChange={e => setNewJob({ ...newJob, description: e.target.value })} className="border p-2 rounded h-24 resize-none" required />
              <input type="text" placeholder="Contrat" value={newJob.contract_type} onChange={e => setNewJob({ ...newJob, contract_type: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Lieu" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Salaire" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} className="border p-2 rounded" />
              <select value={newJob.experience_level} onChange={e => setNewJob({ ...newJob, experience_level: e.target.value })} className="border p-2 rounded">
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
              <select value={newJob.id_company} onChange={e => setNewJob({ ...newJob, id_company: e.target.value })} className="border p-2 rounded" required>
                <option value="">Sélectionner l'entreprise</option>
                {companies.map(c => <option key={c.id_company} value={c.id_company}>{c.name}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <label>Remote :</label>
                <input type="checkbox" checked={newJob.remote} onChange={e => setNewJob({ ...newJob, remote: e.target.checked ? 1 : 0 })} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Modifier une offre</h3>
            <form onSubmit={EditJob} className="flex flex-col gap-2">
              <input type="text" placeholder="Titre" value={editingJob.title} onChange={e => setEditingJob({ ...editingJob, title: e.target.value })} className="border p-2 rounded" required />
              <textarea placeholder="Description" value={editingJob.description} onChange={e => setEditingJob({ ...editingJob, description: e.target.value })} className="border p-2 rounded h-24 resize-none" required />
              <input type="text" placeholder="Contrat" value={editingJob.contract_type} onChange={e => setEditingJob({ ...editingJob, contract_type: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Lieu" value={editingJob.location} onChange={e => setEditingJob({ ...editingJob, location: e.target.value })} className="border p-2 rounded" />
              <input type="number" placeholder="Salaire" value={editingJob.salary} onChange={e => setEditingJob({ ...editingJob, salary: e.target.value })} className="border p-2 rounded" />
              <select value={editingJob.experience_level} onChange={e => setEditingJob({ ...editingJob, experience_level: e.target.value })} className="border p-2 rounded">
                <option value="junior">Junior</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
              </select>
              <select value={editingJob.id_company} onChange={e => setEditingJob({ ...editingJob, id_company: e.target.value })} className="border p-2 rounded" required>
                <option value="">Sélectionner l'entreprise</option>
                {companies.map(c => <option key={c.id_company} value={c.id_company}>{c.name}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <label>Remote :</label>
                <input type="checkbox" checked={editingJob.remote} onChange={e => setEditingJob({ ...editingJob, remote: e.target.checked ? 1 : 0 })} />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">Annuler</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
