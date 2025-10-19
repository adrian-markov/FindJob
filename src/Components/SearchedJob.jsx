import "./SearchedJob.css";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchedJob({ job }) {
    const navigate = useNavigate();
    const previewLength = 100;

    const preview = useMemo(() => {
        if (!job.description) return "";
        return job.description.length > previewLength
            ? job.description.slice(0, previewLength) + "..."
            : job.description;
    }, [job.description]);

    const handleApplyClick = () => {
        navigate(`/apply/${job.id_ad}`);
    };

    return (
        <section>
            <div className="searched_job_card">
                <div className="searched_job_header">
                    <h2 className="searched_job_title">{job.title}</h2>
                    <p className="searched_job_company">{job.company}</p>
                    <p className="searched_job_location">{job.location}</p>
                </div>

                <div className="searched_job_content">
                    <p className="searched_job_description">{job.description}</p>
                    <ul className="searched_job_details">
                        <li><strong>Salaire :</strong> {job.salary} €</li>
                        <li><strong>Télétravail :</strong> {job.remote ? "Oui" : "Non"}</li>
                        <li><strong>Contrat :</strong> {job.contract_type}</li>
                        <li><strong>Expérience :</strong> {job.experience_level}</li>
                    </ul>
                </div>

                <div className="job_actions">
                    <button className="apply_button" onClick={handleApplyClick}>
                        Postuler
                    </button>
                </div>
            </div>
        </section>
    );
}