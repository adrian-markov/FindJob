import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const mockCurrentUser = {
  id_user: 1,
  first_name: "Johanna",
  last_name: "Angloma",
  email: "johanna.angloma@epitech.eu",
  phone: "0634051092",
};

export default function ApplicationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    setFormData({
      first_name: mockCurrentUser.first_name,
      last_name: mockCurrentUser.last_name,
      email: mockCurrentUser.email,
      phone: mockCurrentUser.phone || "",
    });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8000/jobs/${jobId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement du job");
        return res.json();
      })
      .then((data) => setJob(data))
      .catch((err) => console.error("Erreur:", err));
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
      id_ad: parseInt(jobId),
      id_applicant: mockCurrentUser.id_user,
      message,
      applicant_info: formData, 
    };

    try {
      const response = await fetch("http://localhost:8000/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la candidature");

      alert("Candidature envoyée !");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Impossible d'envoyer la candidature");
    }
  };

  if (!job)
    return (
      <p className="pt-40 text-center text-gray-600 font-semibold">
        Chargement de l’offre...
      </p>
    );

  return (
    <section className="pt-40 px-4 py-12 bg-[#f8f5fc] flex justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-violet-700">{job.title}</h1>
        <p className="text-gray-700">
          <span className="font-semibold">Entreprise :</span> {job.company_name || job.company}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Lieu :</span> {job.location}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Description :</span> {job.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Infos personnelles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
            <input
              type="text"
              placeholder="Nom"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
              required
            />
            <input
              type="tel"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          <textarea
            placeholder="Votre message de motivation..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Envoyer ma candidature
          </button>
        </form>
      </div>
    </section>
  );
}
