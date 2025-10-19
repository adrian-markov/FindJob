import { useState, useEffect } from "react";
import"./SearchedJob.css";
import SearchedJob from "./SearchedJob.jsx";


export default function Accueil() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setQuery("");
    setLocation("");
    setJobs([]);
    setError(null);
    setSearched(false);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      let url = `http://127.0.0.1:8000/jobs?`;
      if (query) url += `q=${encodeURIComponent(query)}&`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur de chargement des offres");

      const data = await res.json();

      const filtered = location
        ? data.filter((job) =>
            job.location?.toLowerCase().includes(location.toLowerCase())
          )
        : data;

      setJobs(filtered);

      if (filtered.length === 0) {
        setError("Aucune offre trouvée. Essayez un autre mot-clé.");
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les offres.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-40 px-4 py-12 bg-[#f8f5fc] flex flex-col items-center gap-12">
  
      <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-12">
        <div className="w-full max-w-xl space-y-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-violet-700">
            Trouvez votre emploi de rêve
          </h1>
          <h3 className="text-blue-900">
            Explorez des milliers d'opportunités à travers nos offres
          </h3>

          <form onSubmit={handleSearch} className="space-y-4 text-left">
            <input
              type="text"
              placeholder="Titre du poste ou mot-clé"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-2 rounded border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <input
              type="text"
              placeholder="Ville ou région"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 rounded border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            >
              Rechercher
            </button>

            {searched && (
              <div className="pt-4">
                {loading && (
                  <p className="text-center text-gray-600">Chargement des offres...</p>
                )}
                {error && (
                  <p className="text-center text-red-500 font-semibold">{error}</p>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="w-full max-w-md">
          <img
            src="/src/assets/femme-affaires-multitache.jpg"
            alt="Réunion professionnelle"
            className="rounded-lg shadow-lg w-full object-cover max-h-[400px]"
          />
        </div>
      </div>

      {searched && !loading && !error && jobs.length > 0 && (
        <div className="w-full max-w-6xl mt-12 flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {jobs.map((job) => (
              <SearchedJob key={job.id_ad} job={job} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}