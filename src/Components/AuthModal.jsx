import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm: "",
    role: "applicant",
    adminCode: "",
    phone: "",
  });

  const API_URL = "http://localhost:8000";
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const Login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) throw new Error("Les identifiants sont incorrects !");
      const data = await response.json();

      localStorage.setItem("findjob_user_role", data.role);
      localStorage.setItem("findjob_token", data.id);
      localStorage.setItem("findjob_first_name", data.first_name);
      localStorage.setItem("findjob_last_name", data.last_name);
      localStorage.setItem("findjob_email", data.email);
      localStorage.setItem("findjob_phone", data.phone || "");

      window.dispatchEvent(new Event("findjob_role_changed"));

      if (data.role === "admin") navigate("/admin");
      else if (data.role === "recruiter") navigate("/recruiter");
      else navigate("/applicant");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion : " + err.message);
    }
  };

  const Signup = async (e) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }
    if (signupData.role === "admin" && signupData.adminCode !== "172806") {
      alert("Code admin invalide !");
      return;
    }

    const dataSend = {
      first_name: signupData.first_name,
      last_name: signupData.last_name,
      email: signupData.email,
      password: signupData.password,
      role: signupData.role,
      phone: signupData.phone || "",
    };

    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataSend),
      });
      if (!response.ok) throw new Error("Erreur lors de l’inscription");
      const data = await response.json();

      localStorage.setItem("findjob_user_role", signupData.role);
      localStorage.setItem("findjob_token", data.id);
      localStorage.setItem("findjob_first_name", signupData.first_name);
      localStorage.setItem("findjob_last_name", signupData.last_name);
      localStorage.setItem("findjob_email", signupData.email);
      localStorage.setItem("findjob_phone", signupData.phone || "");

      window.dispatchEvent(new Event("findjob_role_changed"));

      if (signupData.role === "admin") navigate("/admin");
      else if (signupData.role === "recruiter") navigate("/recruiter");
      else navigate("/applicant");

      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur d’inscription : " + err.message);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp md:grid-col"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-gray-400 text-2xl hover:text-gray-600 transition bg-transparent p-0 leading-none"
        >
          &times;
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {activeTab === "login" ? "Bon retour !" : "Créer un compte"}
          </h2>
          <p className="text-gray-500 text-sm">
            {activeTab === "login"
              ? "Connectez-vous pour accéder à votre compte"
              : "Rejoignez-nous dès aujourd’hui"}
          </p>
        </div>

        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            className={`flex-1 py-2 rounded-l-xl focus:outline-none transition-all ${activeTab === "login"
                ? "bg-white text-violet-600 shadow-md z-10"
                : "bg-transparent text-gray-500"
              }`}
            onClick={() => setActiveTab("login")}
          >
            Se connecter
          </button>
          <button
            className={`flex-1 py-2 rounded-r-xl focus:outline-none transition-all ${activeTab === "signup"
                ? "bg-white text-violet-600 shadow-md z-10"
                : "bg-transparent text-gray-500"
              }`}
            onClick={() => setActiveTab("signup")}
          >
            S'inscrire
          </button>
        </div>

        {activeTab === "login" ? (
          <form onSubmit={Login} className="space-y-1">
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                placeholder="votre@email.com"
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                placeholder="*********"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-violet-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition"
            >
              Se connecter
            </button>
          </form>
        ) : (
          <form onSubmit={Signup} className="space-y-0">
            <div>
              <label className="block text-sm font-semibold mb-0.5">
                Prénom
              </label>
              <input
                type="text"
                value={signupData.first_name}
                onChange={(e) =>
                  setSignupData({ ...signupData, first_name: e.target.value })
                }
                placeholder="Pamela"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-0.5">
                Nom
              </label>
              <input
                type="text"
                value={signupData.last_name}
                onChange={(e) =>
                  setSignupData({ ...signupData, last_name: e.target.value })
                }
                placeholder="Anderson"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-0.5">Email</label>
              <input
                type="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
                placeholder="votre@email.com"
                className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-0.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
                placeholder="*********"
                className="w-47.5 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-0.5">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={signupData.confirm}
                onChange={(e) =>
                  setSignupData({ ...signupData, confirm: e.target.value })
                }
                placeholder="*********"
                className="w-47.5 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-0.5">Rôle</label>
              <select
                value={signupData.role}
                onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                className="w-47.5 border-1 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
              >
                <option value="applicant">Applicant</option>
                <option value="recruiter">Recruiter</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {signupData.role === "admin" && (
              <div>
                <label className="block text-sm font-semibold mb-0.5">Code secret admin</label>
                <input
                  type="password"
                  value={signupData.adminCode}
                  onChange={(e) => setSignupData({ ...signupData, adminCode: e.target.value })}
                  placeholder="Code secret"
                  className="w-47.5 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-violet-600 text-white py-3 rounded-lg font-semibold hover:bg-violet-700 transition"
            >
              Créer un compte
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
