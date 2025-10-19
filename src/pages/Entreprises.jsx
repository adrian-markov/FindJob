import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function Entreprises() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/companies`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setCompanies(data);
      } catch (err) {
        setError("Impossible de charger les entreprises.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  return (
    <div className="min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold text-violet-700 mb-6">Entreprises</h1>

      {loading && <p className="text-gray-600">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {companies.length === 0 && (
            <p className="text-gray-600 col-span-full">Aucune entreprise trouvée.</p>
          )}
          {companies.map((company) => (
            <div
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className="cursor-pointer border border-gray-200 p-4 rounded-lg shadow hover:shadow-md transition text-center hover:bg-violet-50"
            >
              <h2 className="text-xl font-semibold text-violet-600">{company.name}</h2>
            </div>
          ))}
        </div>
      )}

      {selectedCompany && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setSelectedCompany(null)}
              className="absolute top-3 right-3 text-violet-600 text-2xl font-bold bg-white/70 rounded-full w-8 h-8 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-violet-700 mb-4">{selectedCompany.name}</h2>
            <p className="text-gray-700">{selectedCompany.description || "Pas de description disponible."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
