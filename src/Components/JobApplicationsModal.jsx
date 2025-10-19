import React from "react";

export default function JobAppModal({ isOpen, onClose, applications }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">Candidatures</h2>
        <button
          className="absolute top-2 right-4 text-gray-400 text-2xl hover:text-gray-600"
          onClick={onClose}
        >
          &times;
        </button>
        {applications.length === 0 ? (
          <p>Aucune candidature pour cette offre.</p>
        ) : (
          <ul className="space-y-2">
            {applications.map((app) => (
              <li key={app.id_application} className="border p-2 rounded">
                <p>
                  <strong>{app.first_name} {app.last_name}</strong> - {app.email}
                </p>
                {app.cv_url && (
                  <p>
                    <a
                      href={app.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      Voir CV
                    </a>
                  </p>
                )}
                <p>Status: {app.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}