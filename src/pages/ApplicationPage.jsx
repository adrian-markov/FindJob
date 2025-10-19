import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ApplicationPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");

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
      id_applicant: parseInt(localStorage.getItem('findjob_applicant_id')), 
      message,
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

  if (!job) return <p>Chargement de l’offre...</p>;

  return (
    <div className="apply-page" style={{ maxWidth: "600px", margin: "auto", padding: "20px" }}>
      <h1>Postuler pour : {job.title}</h1>
      <p><strong>Entreprise :</strong> {job.company}</p>
      <p><strong>Lieu :</strong> {job.location}</p>
      <p><strong>Description :</strong> {job.description}</p>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Votre message de motivation..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          style={{ width: "100%", marginTop: "10px" }}
          required
        />
        <br />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Envoyer ma candidature
        </button>
      </form>
    </div>
  );
}