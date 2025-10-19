import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import "./Pages.css";

const API_URL = "http://localhost:8000";

const UserList = ({ refreshStats }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", phone: "", role: "applicant" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const usersPerPage = 5;

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const DeleteUser = async (id) => {
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    await fetchUsers();
    refreshStats();
  };

  const AddUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) {
      const err = await res.json();
      alert("Erreur lors de l'ajout : " + (err.detail || JSON.stringify(err)));
      return;
    }
    setNewUser({ first_name: "", last_name: "", email: "", phone: "", role: "applicant" });
    setShowAddModal(false);
    await fetchUsers();
    refreshStats();
  };

  const EditUser = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/users/${editingUser.id_user}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingUser),
    });
    setShowEditModal(false);
    setEditingUser(null);
    await fetchUsers();
    refreshStats();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const truncate = (text, max) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "…" : text;
  };

  return (
    <div className="p-2 sm:p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="page-title text-lg sm:text-xl">Utilisateurs</h2>
        <button onClick={() => setShowAddModal(true)} className="bg-purple-600 hover:bg-purple-700 text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-xl">+</button>
      </div> 

      <div className="hidden md:block overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Prénom</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Téléphone</th>
              <th className="p-2 border">Rôle</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id_user}>
                <td className="border p-2">{user.first_name}</td>
                <td className="border p-2">{user.last_name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phone || "-"}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => { setEditingUser(user); setShowEditModal(true); }} className="btnmod text-white text-xs px-2 py-1">Modifier</button>
                    <button onClick={() => DeleteUser(user.id_user)} className="btnsup text-white text-xs px-2 py-1">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {currentUsers.map((user) => (
          <div key={user.id_user} className="bg-white border rounded-lg p-3 shadow-sm">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-base">{user.first_name} {user.last_name}</div>
                  <div className="text-gray-600 text-xs">{user.email}</div>
                </div>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">{user.role}</span>
              </div>
              {user.phone && <div className="text-gray-600">📞 {user.phone}</div>}
            </div>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setEditingUser(user); setShowEditModal(true); }} className="btnmod text-white text-xs px-3 py-1.5 flex-1">Modifier</button>
              <button onClick={() => DeleteUser(user.id_user)} className="btnsup text-white text-xs px-3 py-1.5 flex-1">Supprimer</button>
            </div>
          </div>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Ajouter un utilisateur</h3>
            <form onSubmit={AddUser} className="flex flex-col gap-3">
              <input type="text" placeholder="Prénom" value={newUser.first_name} onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Nom" value={newUser.last_name} onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} className="border p-2 rounded" required />
              <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Téléphone" value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })} className="border p-2 rounded" />
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded" required>
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded order-2 sm:order-1">Annuler</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded order-1 sm:order-2">Ajouter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-400 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-[600px] shadow-lg max-h-[90vh] overflow-y-auto">
            <h3 className="text-purple font-bold mb-4 text-lg">Modifier un utilisateur</h3>
            <form onSubmit={EditUser} className="flex flex-col gap-3">
              <input type="text" placeholder="Prénom" value={editingUser.first_name} onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Nom" value={editingUser.last_name} onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })} className="border p-2 rounded" required />
              <input type="email" placeholder="Email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="border p-2 rounded" required />
              <input type="text" placeholder="Téléphone" value={editingUser.phone || ""} onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })} className="border p-2 rounded" />
              <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} className="border p-2 rounded" required>
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
                <button type="button" onClick={() => setShowEditModal(false)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded order-2 sm:order-1">Annuler</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded order-1 sm:order-2">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}  
    </div>
  );
};

export default UserList;