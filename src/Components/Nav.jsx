import { Disclosure, DisclosurePanel, DisclosureButton } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";

const navigation = [
    { name: 'Acceuil', href: '/', current: false },
    { name: 'Offres', href: '/jobs', current: false },
    { name: 'Entreprises', href: '/entreprises', current: false },
    { name: 'À propos', href: '#', current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(" ");

export default function Nav() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState("login");
  const [role, setRole] = useState(localStorage.getItem("findjob_user_role"));
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("findjob_user_role");
    setRole(storedRole);

    const handleRoleChange = () => {
      const updatedRole = localStorage.getItem("findjob_user_role");
      setRole(updatedRole);
    };

    window.addEventListener("findjob_role_changed", handleRoleChange);
    return () => window.removeEventListener("findjob_role_changed", handleRoleChange);
  }, []);

  const openModal = (tab) => {
    setDefaultTab(tab);
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    setRole(null);
    window.dispatchEvent(new Event("findjob_role_changed"));
    navigate("/");
  };

  const renderProfileLink = () => {
    if (role === "admin")
      return (
        <a
          href="/admin"
          className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
        >
          Admin
        </a>
      );
    if (role === "recruiter")
      return (
        <a
          href="/recruiter"
          className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
        >
          Espace recruteur
        </a>
      );
    if (role === "applicant")
      return (
        <a
          href="/applicant"
          className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
        >
          Mon profil
        </a>
      );
    return null;
  };

  return (
    <>
      <Disclosure as="nav" className="bg-slate-50 fixed top-0 left-0 w-full z-50 shadow">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <a href="/" className="text-violet-600 font-bold text-lg">
                    FindJob
                  </a>
                </div>

                <div className="hidden md:flex md:items-center md:space-x-6">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "text-violet-600 font-semibold underline underline-offset-4"
                          : "text-blue-950 hover:text-violet-500",
                        "text-sm"
                      )}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="hidden md:flex items-center space-x-3">
                  {!role ? (
                    <>
                      <button
                        onClick={() => openModal("login")}
                        className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                      >
                        Se connecter
                      </button>
                      <button
                        onClick={() => openModal("signup")}
                        className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                      >
                        S’inscrire
                      </button>
                    </>
                  ) : (
                    <>
                      {renderProfileLink()}
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium bg-gray-200 text-blue-900 rounded hover:bg-gray-300 transition"
                      >
                        Déconnexion
                      </button>
                    </>
                  )}
                </div>

                <div className="md:hidden">
                  <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-violet-600 hover:bg-violet-100 focus:outline-none">
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </DisclosureButton>
                </div>
              </div>
            </div>

            <DisclosurePanel className="md:hidden px-4 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "block text-sm py-2 text-blue-950 hover:text-violet-500"
                  )}
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-2 space-y-2">
                {!role ? (
                  <>
                    <button
                      onClick={() => openModal("login")}
                      className="block w-full text-center px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => openModal("signup")}
                      className="block w-full text-center px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                    >
                      S’inscrire
                    </button>
                  </>
                ) : (
                  <>
                    {renderProfileLink()}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-center px-4 py-2 text-sm font-medium bg-gray-200 text-blue-900 rounded hover:bg-gray-300 transition"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>
            </DisclosurePanel>
          </>
        )}
      </Disclosure>

      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultTab={defaultTab}
        />
      )}
    </>
  );
}
