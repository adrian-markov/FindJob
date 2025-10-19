import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import './Pages.css';

const API_URL = "http://localhost:8000";

const CompanyList = ({ refreshStats }) => {
  const [companies, setCompanies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCompany, setEditingCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({ name: "", description: "", website: "", address: "", sector: "", email_contact: "" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const companiesPerPage = 5;

  const fetchCompanies = async () => {
    const res = await fetch(`${API_URL}/companies`);
    const data = await res.json();
    setCompanies(data);
  };

  useEffect(() => { fetchCompanies(); }, []);

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

    setNewCompany({ name: "", description: "", website: "", address: "", sector: "", email_contact: "" });
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
    setShowEditModal(false);
    setEditingCompany(null);
    await fetchCompanies();
    refreshStats();
  };

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);
  const totalPages = Math.ceil(companies.length / companiesPerPage);

  const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="page-title text-lg sm:text-xl">Entreprises</h2>
        <button onClick={() => setShowAddModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl">+</button>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Secteur</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCompanies.map(c => (
              <tr key={c.id_company}>
                <td className="border p-2" style={{ maxWidth: "150px" }}>
                  <div className="truncate" title={c.name}>{c.name}</div>
                </td>
                <td className="border p-2" style={{ maxWidth: "250px" }}>
                  <div className="truncate" title={c.description}>{truncate(c.description, 50)}</div>
                </td>
                <td className="border p-2" style={{ maxWidth: "120px" }}>
                  <div className="truncate" title={c.sector}>{c.sector}</div>
                </td>
                <td className="border p-2" style={{ maxWidth: "180px" }}>
                  <div className="truncate" title={c.email_contact}>{c.email_contact}</div>
                </td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center flex-wrap">
                    <button onClick={() => { setEditingCompany(c); setShowEditModal(true); }} className="btnmod text-white text-xs px-2 py-1 whitespace-nowrap">Modifier</button>
                    <button onClick={() => DeleteCompany(c.id_company)} className="btnsup text-white text-xs px-2 py-1 whitespace-nowrap">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {currentCompanies.map(c => (
          <div key={c.id_company} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="space-y-2 text-sm">
              <div className="font-semibold text-base">{c.name}</div>
              {c.description && <div className="text-gray-600 text-xs line-clamp-2">{c.description}</div>}
              <div className="flex flex-wrap gap-2 text-xs">
                {c.sector && <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">{c.sector}</span>}
              </div>
              {c.email_contact && <div className="text-gray-600 text-xs truncate">📧 {c.email_contact}</div>}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEditingCompany(c); setShowEditModal(true); }} className="btnmod text-white text-xs px-3 py-1.5 flex-1">Modifier</button>
              <button onClick={() => DeleteCompany(c.id_company)} className="btnsup text-white text-xs px-3 py-1.5 flex-1">Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Ajouter une entreprise</h3>
            <form onSubmit={AddCompany} className="flex flex-col gap-3">
              <input type="text" placeholder="Nom" value={newCompany.name} onChange={e => setNewCompany({ ...newCompany, name: e.target.value })} className="border p-2 rounded" required />
              <textarea placeholder="Description" value={newCompany.description} onChange={e => setNewCompany({ ...newCompany, description: e.target.value })} className="border p-2 rounded h-24 resize-none" />
              <input type="text" placeholder="Secteur" value={newCompany.sector} onChange={e => setNewCompany({ ...newCompany, sector: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Adresse" value={newCompany.address} onChange={e => setNewCompany({ ...newCompany, address: e.target.value })} className="border p-2 rounded" />
              <input type="email" placeholder="Email" value={newCompany.email_contact} onChange={e => setNewCompany({ ...newCompany, email_contact: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Site web" value={newCompany.website} onChange={e => setNewCompany({ ...newCompany, website: e.target.value })} className="border p-2 rounded" />
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="btnannul order-2 sm:order-1">Annuler</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded order-1 sm:order-2">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingCompany && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Modifier une entreprise</h3>
            <form onSubmit={EditCompany} className="flex flex-col gap-3">
              <input type="text" placeholder="Nom" value={editingCompany.name} onChange={e => setEditingCompany({ ...editingCompany, name: e.target.value })} className="border p-2 rounded" required />
              <textarea placeholder="Description" value={editingCompany.description} onChange={e => setEditingCompany({ ...editingCompany, description: e.target.value })} className="border p-2 rounded h-24 resize-none" />
              <input type="text" placeholder="Secteur" value={editingCompany.sector} onChange={e => setEditingCompany({ ...editingCompany, sector: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Adresse" value={editingCompany.address} onChange={e => setEditingCompany({ ...editingCompany, address: e.target.value })} className="border p-2 rounded" />
              <input type="email" placeholder="Email" value={editingCompany.email_contact} onChange={e => setEditingCompany({ ...editingCompany, email_contact: e.target.value })} className="border p-2 rounded" />
              <input type="text" placeholder="Site web" value={editingCompany.website} onChange={e => setEditingCompany({ ...editingCompany, website: e.target.value })} className="border p-2 rounded" />
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="btnannul order-2 sm:order-1">Annuler</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded order-1 sm:order-2">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyList;
