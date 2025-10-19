import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Profile.css";

const LS_PROFILE_KEY = "findjob_profile";
const LS_CV_KEY = "findjob_cv";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
const formatBytes = (b) => {
  if (!b) return "0 B";
  const k = 1024, sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(b) / Math.log(k));
  return parseFloat((b / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export default function Profile() {
  const navigate = useNavigate(); // 

  const [profile, setProfile] = useState({
    headline: "",
    location: "",
    yearsExp: "",
    skills: "",
    workPref: "remote",
    availability: "",
    salary: "",
    portfolio: "",
    github: "",
    linkedin: "",
    languages: "",
    bio: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [cv, setCv] = useState(null);

  useEffect(() => {
    const p = localStorage.getItem(LS_PROFILE_KEY);
    if (p) setProfile(JSON.parse(p));
    const storedCv = localStorage.getItem(LS_CV_KEY);
    if (storedCv) setCv(JSON.parse(storedCv));
  }, []);

  function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
    setTimeout(() => setSaving(false), 250);
    navigate("/applicant"); // 
  }

  async function handleUploadCv(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const okTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!okTypes.includes(file.type)) {
      alert("Format non supporté. Importez un PDF, DOC ou DOCX.");
      e.target.value = "";
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      alert("Fichier trop volumineux (max 4 Mo).");
      e.target.value = "";
      return;
    }
    const dataUrl = await fileToBase64(file);
    const payload = {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };
    setCv(payload);
    localStorage.setItem(LS_CV_KEY, JSON.stringify(payload));
    e.target.value = "";
  }

  function handleDeleteCv() {
    if (!confirm("Supprimer le CV importé ?")) return;
    setCv(null);
    localStorage.removeItem(LS_CV_KEY);
  }

  function handleDownloadCv() {
    if (!cv?.dataUrl) return;
    const a = document.createElement("a");
    a.href = cv.dataUrl;
    a.download = cv.name || "cv";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">💼</div>
        <div>
          <h1>Mon profil</h1>
          <p className="muted">Gérez vos informations pro et importez votre CV.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card space">
        <div className="grid">
          <label>
            <span>Titre / Poste</span>
            <input
              placeholder="Ex: DevOps Engineer, Data Analyst…"
              value={profile.headline}
              onChange={(e) => setProfile(p => ({ ...p, headline: e.target.value }))}
              required
            />
          </label>
          <label>
            <span>Localisation</span>
            <input
              placeholder="Paris, Ile-de-France"
              value={profile.location}
              onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))}
            />
          </label>

          <label>
            <span>Années d'expérience</span>
            <input
              type="number" min="0" step="0.5"
              placeholder="Ex: 3"
              value={profile.yearsExp}
              onChange={(e) => setProfile(p => ({ ...p, yearsExp: e.target.value }))}
            />
          </label>
          <label>
            <span>Préférence de travail</span>
            <select
              value={profile.workPref}
              onChange={(e) => setProfile(p => ({ ...p, workPref: e.target.value }))}
            >
              <option value="remote">Remote</option>
              <option value="hybride">Hybride</option>
              <option value="onsite">Sur site</option>
            </select>
          </label>

          <label>
            <span>Disponibilité</span>
            <input
              type="date"
              value={profile.availability}
              onChange={(e) => setProfile(p => ({ ...p, availability: e.target.value }))}
            />
          </label>
          <label>
            <span>Salaire souhaité (mensuel)</span>
            <input
              type="number" min="0"
              placeholder="Ex: 1000 euros"
              value={profile.salary}
              onChange={(e) => setProfile(p => ({ ...p, salary: e.target.value }))}
            />
          </label>
        </div>

        <label className="block">
          <span>Compétences</span>
          <input
            placeholder="Ex: Python,React,JavaScript"
            value={profile.skills}
            onChange={(e) => setProfile(p => ({ ...p, skills: e.target.value }))}
          />
        </label>

        <div className="grid">
          <label>
            <span>Portfolio</span>
            <input
              type="url" placeholder="https://mon-portfolio.dev"
              value={profile.portfolio}
              onChange={(e) => setProfile(p => ({ ...p, portfolio: e.target.value }))}
            />
          </label>
          <label>
            <span>GitHub</span>
            <input
              type="url" placeholder="https://github.com/"
              value={profile.github}
              onChange={(e) => setProfile(p => ({ ...p, github: e.target.value }))}
            />
          </label>
          <label>
            <span>LinkedIn</span>
            <input
              type="url" placeholder="https://www.linkedin.com/in/"
              value={profile.linkedin}
              onChange={(e) => setProfile(p => ({ ...p, linkedin: e.target.value }))}
            />
          </label>
          <label>
            <span>Langues</span>
            <input
              placeholder="Ex: Français (C1), Anglais (B2)"
              value={profile.languages}
              onChange={(e) => setProfile(p => ({ ...p, languages: e.target.value }))}
            />
          </label>

          <label>
            <span>Téléphone</span>
            <input
              placeholder="Ex: 0652356489"
              value={profile.phone}
              onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
            />
          </label>
        </div>

        <label className="block">
          <span>Bio</span>
          <textarea
            rows={4}
            placeholder="Quelques lignes sur votre expérience…"
            value={profile.bio}
            onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))}
          />
        </label>

        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <div className="card">
        <h2>Mon CV</h2>
        {!cv ? (
          <>
            <p className="muted">Importez un fichier PDF, DOC ou DOCX (max 4 Mo).</p>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleUploadCv} />
          </>
        ) : (
          <div className="cv-row">
            <div>
              <div className="cv-name">{cv.name}</div>
              <div className="muted">
                {formatBytes(cv.size)} • importé le{" "}
                {new Date(cv.uploadedAt).toLocaleString()}
              </div>
            </div>
            <div className="cv-actions">
              <button className="btn" onClick={handleDownloadCv}>Télécharger</button>
              <button className="btn-danger" onClick={handleDeleteCv}>Supprimer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}