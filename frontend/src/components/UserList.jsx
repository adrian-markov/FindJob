import React, { useEffect, useState } from "react";
import Pagination from "./Pagination.jsx";
import './Pages.css';

const API_URL = "http://localhost:8000";

const UserList = ({ refreshStats }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ first_name: "", last_name: "", email: "", role: "applicant" });
  const usersPerPage = 5;

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const Delete = async (id) => {
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    await fetchUsers();
    refreshStats();
  };

  const AddUser = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    setNewUser({ first_name: "", last_name: "", email: "", role: "applicant" });
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
    setEditingUser(null);
    await fetchUsers();
    refreshStats();
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="p-4">
      <h2 className="page-title">Utilisateurs</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Prénom</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Email</th>
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
              <td className="border p-2">{user.role}</td>
              <td className="border p-2 flex gap-2">
                <button onClick={() => setEditingUser(user)} className="btnmod text-white">Modifier</button>
                <button onClick={() => Delete(user.id_user)} className="btnsup text-white">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      {editingUser && (
        <form onSubmit={EditUser} className="mt-4 flex gap-3">
          <input type="text" value={editingUser.first_name} onChange={(e) => setEditingUser({ ...editingUser, first_name: e.target.value })} className="border p-2 rounded w-1/4" />
          <input type="text" value={editingUser.last_name} onChange={(e) => setEditingUser({ ...editingUser, last_name: e.target.value })} className="border p-2 rounded w-1/4" />
          <input type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} className="border p-2 rounded w-1/4" />
          <select value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="recruiter">Recruteur</option>
            <option value="applicant">Candidat</option>
          </select>
          <button type="submit" className="btnenv text-white"> Enregistrer</button>
          <button type="button" onClick={() => setEditingUser(null)}>Annuler</button>
        </form>
      )}

      <br></br>

      <form onSubmit={AddUser} className="mb-6 flex gap-3">
        <h5>Formulaire d'ajout</h5>
        
        <br></br>

        <input type="text" placeholder="Prénom" value={newUser.first_name} onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} className="border p-2 rounded w-1/4" />
        <input type="text" placeholder="Nom" value={newUser.last_name} onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} className="border p-2 rounded w-1/4" />
        <input type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="border p-2 rounded w-1/3" />
        <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="border p-2 rounded w-1/6">
          <option value="admin">Admin</option>
          <option value="recruiter">Recruteur</option>
          <option value="applicant">Candidat</option>
        </select>
        <button type="submit" className="btn-primary"> Ajouter</button>
      </form>
    </div>
  );
};

export default UserList;
