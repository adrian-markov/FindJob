import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";
import "./App.css";

import Nav from "./Components/Nav.jsx";
import Accueil from "./Components/Accueil.jsx";
import JobCard from "./Components/JobCard.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx"; 
import JobsPage from "./pages/AdsPage.jsx";
import Entreprises from "./pages/Entreprises.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Applicant from "./Components/applicant.jsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import Protection from "./Components/Protection.jsx";
import AuthModal from "./Components/AuthModal.jsx";

function Layout({ openAuthModal }) {
  const location = useLocation();
  const hideFooter = ["/admin", "/recruiter", "/applicant", "/profile"].includes(location.pathname);

  return (
    <div className="App">
      <Nav openAuthModal={openAuthModal} />
      <main className="pt-16">
        <Outlet />
      </main>

      {!hideFooter && (
        <footer className="bg-[#1f1f2e] text-white px-8 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8 text-center md:text-left">
          <div>
            <h2 className="text-xl font-bold mb-3">FindJob</h2>
            <p className="text-sm max-w-sm mx-auto md:mx-0">
              FindJob est une plateforme qui vous permet de trouver un job qui vous correspond à travers les meilleures offres sur le marché !
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 contact@findjob.com</li>
              <li>📞 +33  1 44 08 00 60</li>
              <li>📍 24, rue Pasteur 94270 Kremlin-Bicêtre</li>
            </ul>
          </div>
        </footer>
      )}
    </div>
  );
}

function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then(res => res.ok ? res.json() : Promise.reject("Erreur lors du chargement des jobs"))
      .then(data => {
        setJobs(data.slice().sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted)).slice(0, 8));
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les jobs.");
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Accueil />

      <section className="text-center mt-16 mx-8">
        <h2 className="text-3xl font-bold mb-4 text-gray-800">
          Découvrez nos dernières offres d’emploi
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Trouvez le poste qui correspond à vos compétences et à vos ambitions parmi notre sélection d’annonces récentes.
        </p>
      </section>

      <div className="jobs-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12 mx-12 my-12">
        {loading ? <p>Chargement des jobs...</p>
        : error ? <p className="text-red-500">{error}</p>
        : jobs.length === 0 ? <p>Aucune offre disponible pour le moment.</p>
        : jobs.map(job => <JobCard key={job.id_ad} job={job} />)}
      </div>
    </>
  );
}

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  return (
    <Router>
      <Routes>
        <Route element={<Layout openAuthModal={openAuthModal} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route path="/apply/:jobId" element={<Protection allowedRoles={["applicant"]}><ApplicationPage /></Protection>} />
          <Route path="/admin" element={<Protection allowedRoles={["admin"]}><AdminDashboard /></Protection>} />
          <Route path="/recruiter" element={<Protection allowedRoles={["admin","recruiter"]}><RecruiterDashboard /></Protection>} />
          <Route path="/applicant" element={<Protection allowedRoles={["admin","applicant"]}><Applicant /></Protection>} />
          <Route path="/profile" element={<Protection allowedRoles={["admin","recruiter","applicant"]}><Profile /></Protection>} />
        </Route>
      </Routes>

      <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} defaultTab="login" />
    </Router>
  );
}

export default App;
