import { useEffect, useState } from "react";
import JobCard from "../Components/JobCard.jsx";

function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="px-8 py-16 pt-32">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
        Toutes nos offres d’emploi
      </h1>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Découvrez l’ensemble des opportunités disponibles sur FindJob. 
        Filtrez, explorez et trouvez le poste qui correspond à vos aspirations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {jobs.length === 0 ? (
          <p className="text-center col-span-full">Chargement des offres...</p>
        ) : (
          jobs.map((job) => <JobCard key={job.id_ad} job={job} />)
        )}
      </div>
    </div>
  );
}

export default JobsPage;