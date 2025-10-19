import "./JobCard.css";
import EnSavoirPlusInline from "./learnmore.jsx";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();
  const previewLength = 100;

  const preview = useMemo(() => {
    if (!job.description) return "";
    return job.description.length > previewLength
      ? job.description.slice(0, previewLength) + "..."
      : job.description;
  }, [job.description]);

  const handleApplyClick = () => {
    console.log("Navigating to:", `/apply/${job.id_ad}`);
    navigate(`/apply/${job.id_ad}`);
  };

  return (
    <section>
      <div className="job_card">
        <div className="job_header">
          <h2 className="job_title">{job.title}</h2>
          <p className="job_company">{job.company}</p>
          <p className="job_location">{job.location}</p>
        </div>

        <EnSavoirPlusInline
          labelClosed="En savoir plus"
          labelOpen="Moins d'infos"
          preview={preview}
        >
          <div className="job_content">
            <p className="job_description">{job.description}</p>
            <ul className="job_details">
              <li><strong>Salaire :</strong> {job.salary} €</li>
              <li><strong>Télétravail :</strong> {job.remote ? "Oui" : "Non"}</li>
              <li><strong>Contrat :</strong> {job.contract_type}</li>
              <li><strong>Expérience :</strong> {job.experience_level}</li>
            </ul>
          </div>
        </EnSavoirPlusInline>

        <div className="job_actions">
          <button className="apply_button" onClick={handleApplyClick}>
            Postuler
          </button>
        </div>
      </div>
    </section>
  );
}
