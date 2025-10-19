import { Disclosure, DisclosurePanel, DisclosureButton } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from "react";

const navigation = [
  { name: 'Acceuil', href: '/', current: false },
  { name: 'Offres', href: '/jobs', current: false },
  { name: 'Entreprises', href: '/entreprises', current: false },
  { name: 'À propos', href: '/a_propos', current: false },
];

const classNames = (...classes) => classes.filter(Boolean).join(' ');

export default function Nav({ openAuthModal }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem('findjob_applicant_id')));
    const onStorage = () => setLoggedIn(Boolean(localStorage.getItem('findjob_applicant_id')));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('findjob_applicant_id');
    setLoggedIn(false);
    window.location.href = '/';
  };

  return (
    <Disclosure as="nav" className="bg-slate-50 fixed top-0 left-0 w-full z-50 shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <div className="flex items-center">
                <a href="/" className="text-lg text-violet-600 font-bold hover:text-violet-400 transition">
                  FindJob
                </a>
              </div>

              {/* Menu principal */}
              <div className="hidden md:flex md:items-center md:space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? 'text-violet-600 font-semibold underline underline-offset-4'
                        : 'text-blue-950 hover:text-violet-500',
                      'text-sm transition'
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Boutons à droite */}
              <div className="hidden md:flex items-center space-x-3">
                {!loggedIn ? (
                  <>
                    <button
                      onClick={() => openAuthModal("login")}
                      className="px-4 py-2 text-sm font-medium bg-indigo-600 text-slate-50 rounded hover:bg-blue-800 hover:text-sky-200 transition"
                    >
                      Se connecter
                    </button>
                    <button
                      onClick={() => openAuthModal("signup")}
                      className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                    >
                      S’inscrire
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/applicant"
                      className="px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                    >
                      Mon profil
                    </a>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium bg-gray-200 text-blue-900 rounded hover:bg-gray-300 transition"
                    >
                      Déconnexion
                    </button>
                  </>
                )}
              </div>

              {/* Menu mobile */}
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

          {/* Menu mobile déroulant */}
          <DisclosurePanel className="md:hidden px-4 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current
                    ? 'text-violet-600 font-semibold underline underline-offset-4'
                    : 'text-blue-950 hover:text-violet-500',
                  'block text-sm py-2'
                )}
              >
                {item.name}
              </a>
            ))}

            <div className="mt-2 space-y-2">
              {!loggedIn ? (
                <>
                  <button
                    onClick={() => openAuthModal("login")}
                    className="block w-full text-center px-4 py-2 text-sm font-medium bg-indigo-600 text-slate-50 rounded hover:bg-blue-800 hover:text-sky-200 transition"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => openAuthModal("signup")}
                    className="block w-full text-center px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                  >
                    S’inscrire
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/applicant"
                    className="block w-full text-center px-4 py-2 text-sm font-medium bg-blue-50 text-blue-900 rounded hover:bg-gray-100 transition"
                  >
                    Mon profil
                  </a>
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
  );
}
