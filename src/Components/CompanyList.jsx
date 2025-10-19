import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import './Pages.css';

const API_URL = "http://localhost:8000";

const CompanyList = ({ refreshStats }) => {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({ name: "", description: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const companiesPerPage = 5;

  const fetchCompanies = async () => {
    const res = await fetch(`${API_URL}/companies`);
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const DeleteCompany = async (id) => {
    await fetch(`${API_URL}/companies/${id}`, { method: "DELETE" });
    await fetchCompanies();
    refreshStats();
  };

  const AddCompany = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/companies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCompany),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Erreur lors de l'ajout de l'entreprise : " + (err.detail || JSON.stringify(err)));
      return;
    }

    setNewCompany({ name: "", description: "" });
    setShowAddModal(false);
    await fetchCompanies();
    refreshStats();
  };

  const EditCompany = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/companies/${editingCompany.id_company}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingCompany),
    });
    setEditingCompany(null);
    await fetchCompanies();
    refreshStats();
  };

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(companies.length / companiesPerPage);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="page-title">Entreprises</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[oklch(43.2%_0.232_292.759)] hover:bg-[oklch(38%_0.189_293.745)] text-white rounded-full w-13 h-13 items-center justify-center focus:outline-none"
        >
          +
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCompanies.map((company) => (
            <tr key={company.id_company}>
              <td className="border p-2">{company.name}</td>
              <td className="border p-2">{company.description}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => setEditingCompany(company)} className="btnmod text-white">Modifier</button>
                <button onClick={() => DeleteCompany(company.id_company)} className="btnsup text-white">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {editingCompany && (
        <form onSubmit={EditCompany} className="mt-4 flex gap-3">
          <input type="text" value={editingCompany.name} onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })} className="border p-2 rounded w-1/3" />
          <input type="text" value={editingCompany.description} onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })} className="border p-2 rounded w-1/2" />
          <button type="submit" className="btnenv text-white"> Enregistrer </button>
          <button type="button" onClick={() => setEditingCompany(null)} className="btnannul text-white">Annuler</button>
        </form>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] shadow-lg">
            <h3 className="text-purple font-bold mb-4">Ajouter une entreprise</h3>
            <form onSubmit={AddCompany} className="flex flex-col gap-3">
              <input type="text" placeholder="Nom" value={newCompany.name} onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Description" value={newCompany.description} onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })} className="border p-2 rounded" required />

              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded focus:outline-none">
                  Annuler
                </button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded focus:outline-none">
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

export default CompanyList;
