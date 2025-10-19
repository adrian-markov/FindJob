import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Applicant.css"; 

const LS_PROFILE_KEY = "findjob_profile";
const LS_CV_KEY = "findjob_cv";
const LS_APPLICANT_ID = "findjob_applicant_id";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const normalizeUrl = (u) => (!u ? "" : (/^https?:\/\//i.test(u) ? u : `https://${u}`));

export default function Applicant() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [cv, setCv] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const applicantId = useMemo(
    () => Number(localStorage.getItem(LS_APPLICANT_ID) || 0),
    []
  );

  useEffect(() => {
    const p = localStorage.getItem(LS_PROFILE_KEY);
    const c = localStorage.getItem(LS_CV_KEY);
    if (p) setProfile(JSON.parse(p));
    if (c) setCv(JSON.parse(c));
  }, []);

  useEffect(() => {
    let alive = true;
    async function load() {
      if (!applicantId) { setLoading(false); return; }
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/applications`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const all = await res.json();
        const mine = all.filter((a) => a.id_applicant === applicantId);
        if (alive) setApps(mine);
      } catch (e) {
        if (alive) setErr("Impossible de charger les candidatures.");
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [applicantId]);

  const fmtDateTime = (iso) => {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };
  const fmtDate = (iso) => {
    if (!iso) return "—";
    try { return new Date(iso).toLocaleDateString(); } catch { return iso; }
  };
  const fmtMoney = (val) => {
    if (val === null || val === undefined || val === "") return "—";
    const n = Number(val);
    if (Number.isNaN(n)) return String(val);
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
  };
  const fmtWorkPref = (w) => {
    if (!w) return "—";
    const m = { remote: "Remote", hybride: "Hybride", onsite: "Sur site" };
    return m[w] ?? w;
  };

  const skills = (profile?.skills || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <div className="applicant-container">
      <div className="app-header">
        <div className="app-avatar">👤</div>
        <div>
          <h1>Mon dossier candidat</h1>
          <p className="muted">Vos informations et vos candidatures.</p>
        </div>
      </div>

      {!profile ? (
        <div className="app-card">
          <p className="muted">Aucune information de profil trouvée.</p>
          <button className="app-btn-primary" onClick={() => navigate("/profile")}>
            Créer / Modifier mon profil
          </button>
        </div>
      ) : (
        <div className="app-card space">
    
          <div className="grid">
            <div>
              <div className="muted">Titre / Poste</div>
              <div>{profile.headline || "—"}</div>
            </div>
            <div>
              <div className="muted">Localisation</div>
              <div>{profile.location || "—"}</div>
            </div>
            <div>
              <div className="muted">Expérience</div>
              <div>{profile.yearsExp ? `${profile.yearsExp} an(s)` : "—"}</div>
            </div>
            <div>
              <div className="muted">Préférence</div>
              <div>{fmtWorkPref(profile.workPref)}</div>
            </div>
          </div>

          
          <div className="grid" style={{ marginTop: 12 }}>
            <div>
              <div className="muted">Disponibilité</div>
              <div>{fmtDate(profile.availability)}</div>
            </div>
            <div>
              <div className="muted">Salaire souhaité (mensuel)</div>
              <div>{fmtMoney(profile.salary)}</div>
            </div>
            <div>
              <div className="muted">Téléphone</div>
              <div>{profile.phone || "—"}</div>
            </div>
            <div>
              <div className="muted">Langues</div>
              <div>{profile.languages || "—"}</div>
            </div>
          </div>

          
          <div className="block" style={{ marginTop: 12 }}>
            <div className="muted">Compétences</div>
            {skills.length ? (
              <div className="app-tags">
                {skills.map((s, i) => (
                  <span key={i} className="app-tag">{s}</span>
                ))}
              </div>
            ) : "—"}
          </div>

          
          <div className="grid" style={{ marginTop: 12 }}>
            <div>
              <div className="muted">Portfolio</div>
              {profile?.portfolio ? (
                <a href={normalizeUrl(profile.portfolio)} target="_blank" rel="noreferrer">
                  {profile.portfolio}
                </a>
              ) : "—"}
            </div>
            <div>
              <div className="muted">GitHub</div>
              {profile?.github ? (
                <a href={normalizeUrl(profile.github)} target="_blank" rel="noreferrer">
                  {profile.github}
                </a>
              ) : "—"}
            </div>
            <div>
              <div className="muted">LinkedIn</div>
              {profile?.linkedin ? (
                <a href={normalizeUrl(profile.linkedin)} target="_blank" rel="noreferrer">
                  {profile.linkedin}
                </a>
              ) : "—"}
            </div>
          </div>

          
          <div className="block" style={{ marginTop: 12 }}>
            <div className="muted">Bio</div>
            <p>{profile.bio || "—"}</p>
          </div>

         
          <div className="block" style={{ marginTop: 12 }}>
            <div className="muted">CV</div>
            {cv ? (
              <div className="cv-row">
                <div>
                  <div className="cv-name">{cv.name}</div>
                  <div className="muted">
                    {Math.round(cv.size / 1024)} Ko • importé le {fmtDateTime(cv.uploadedAt)}
                  </div>
                </div>
                <div className="cv-actions">
                  <a className="app-btn" href={cv.dataUrl} download={cv.name}>Télécharger</a>
                </div>
              </div>
            ) : (
              <div>—</div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <button className="app-btn-primary" onClick={() => navigate("/profile")}>
              Modifier
            </button>
          </div>
        </div>
      )}

      
      <div className="app-card" style={{ marginTop: 16 }}>
        <h2>Mes candidatures</h2>

        {!applicantId && (
          <p className="muted">Aucun identifiant candidat trouvé. Ouvrez votre profil ou connectez-vous.</p>
        )}

        {loading && <p className="muted">Chargement…</p>}
        {err && <p className="muted" style={{ color: "crimson" }}>{err}</p>}

        {!loading && !err && applicantId && (
          apps.length === 0 ? (
            <p className="muted">Vous n’avez pas encore postulé à des offres.</p>
          ) : (
            <ul className="app-list" style={{ marginTop: 8 }}>
              {apps.map((a) => (
                <li key={a.id_application} className="app-item">
                  <div className="grid">
                    <div>
                      <div className="muted">Offre (id)</div>
                      <div>#{a.id_ad}</div>
                    </div>
                    <div>
                      <div className="muted">Statut</div>
                      <div className={`status status--${(a.status ?? "pending").toLowerCase()}`}>
                        {a.status ?? "pending"}
                      </div>
                    </div>
                    <div>
                      <div className="muted">Candidaté le</div>
                      <div>{fmtDateTime(a.date_applied)}</div>
                    </div>
                    <div>
                      <div className="muted">CV</div>
                      {a.cv_url ? (
                        <a className="app-btn" href={normalizeUrl(a.cv_url)} target="_blank" rel="noreferrer">Voir</a>
                      ) : "—"}
                    </div>
                  </div>
                  {a.message && (
                    <div className="block" style={{ marginTop: 6 }}>
                      <div className="muted">Message</div>
                      <p>{a.message}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
