import { useState, useEffect } from "react";
import EnSavoirPlusInline from "./learnmore.jsx"; 

export default function Accueil() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const API_BASE = "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/jobs`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        console.log("[Accueil] initial fetch data:", data); 
        
        const list = Array.isArray(data) ? data : data.jobs ?? [];
        setJobs(list);
      } catch (err) {
        console.error("[Accueil] fetch error:", err);
        setError("Impossible de charger les offres.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      
      let url = `${API_BASE}/jobs`;
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      
      if ([...params].length) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("[Accueil] search fetch data:", data);
      const list = Array.isArray(data) ? data : data.jobs ?? [];
      
      const filtered = location
        ? list.filter((job) =>
            (job.location || "").toLowerCase().includes(location.toLowerCase())
          )
        : list;

      setJobs(filtered);
      if (filtered.length === 0) setError("Aucune offre trouvée. Essayez un autre mot-clé.");
    } catch (err) {
      console.error("[Accueil] search error:", err);
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
                {loading && <p className="text-center text-gray-600">Chargement des offres...</p>}
                {error && <p className="text-center text-red-500 font-semibold">{error}</p>}
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

      <div className="w-full max-w-6xl mt-12 flex justify-center">
        {loading ? (
          <p className="text-gray-600">Chargement des offres...</p>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-600">Aucune offre disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {jobs.map((job) => (
              <article
                key={job.id_ad ?? job.id ?? job._id}
                className="bg-white rounded-xl shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-violet-700 mb-2">
                    {job.title || job.job_title || "Titre non renseigné"}
                  </h3>
                  <p className="text-gray-700 font-medium">{job.company || job.employer || "Entreprise"}</p>
                  <p className="text-gray-500 text-sm mb-4">{job.location || "Localisation"}</p>

                  <EnSavoirPlusInline
                    preview={(job.description || "").slice(0, 140) + (job.description && job.description.length > 140 ? "..." : "")}
                  >
                    <p className="text-gray-700 whitespace-pre-line">
                      {job.description || "Aucune description disponible."}
                    </p>

                    <a
                      href={`/apply/${job.id_ad ?? job.id ?? job._id}`}
                      className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Postuler
                    </a>
                  </EnSavoirPlusInline>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
