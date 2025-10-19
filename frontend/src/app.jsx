import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './app.css';
import Nav from './components/Nav.jsx';
import Accueil from './components/Accueil.jsx';
import JobCard from './components/JobCard.jsx';
import ApplicationPage from "./pages/ApplicationPage.jsx";
import JobsPage from "./pages/AdsPage.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Entreprises from "./pages/Entreprises.jsx";
import APropos from "./pages/APropos.jsx";

function App() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour le modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des jobs");
        return res.json();
      })
      .then((data) => {
        const sortedJobs = data.slice().sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
        const latestJobs = sortedJobs.slice(0, 8);
        setJobs(latestJobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger les jobs.");
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <Nav openAuthModal={openAuthModal} />

        <main>
          <Routes>
            <Route
              path="/"
              element={
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
                    {loading ? (
                      <p>Chargement des jobs...</p>
                    ) : error ? (
                      <p className="text-red-500">{error}</p>
                    ) : jobs.length === 0 ? (
                      <p>Aucune offre disponible pour le moment.</p>
                    ) : (
                      jobs.map((job) => (
                        <JobCard key={job.id_ad} job={job} />
                      ))
                    )}
                  </div>
                </>
              }
            />

            <Route path="/apply/:jobId" element={<ApplicationPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/entreprises" element={<Entreprises />} />
            <Route path="/a_propos" element={<APropos />} />

          </Routes>
        </main>

        <AuthModal isOpen={isAuthOpen} onClose={closeAuthModal} defaultTab="login" />

        <footer className="bg-[#1f1f2e] text-white px-8 py-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-3">FindJob</h2>
            <p className="text-sm max-w-sm mx-auto md:mx-0">
              FindJob est une plateforme qui vous permet de trouver un job qui vous correspond à travers les meilleures offres sur le marché !
            </p>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-3">Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li>📧 contact@findjob.com</li>
              <li>📞 +33 1 23 45 67 89</li>
              <li>📍 123 Rue de la République, Paris</li>
            </ul>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
