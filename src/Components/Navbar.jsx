import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="logo">FindJob Admin</h1>
      <div className="navbar-actions">
        <button className="btn-primary">Profil</button>
        <button className="btn-secondary">Déconnexion</button>
      </div>
    </nav>
  );
};

export default Navbar;