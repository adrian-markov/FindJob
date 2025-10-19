import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
} from "react-router-dom";

import Nav from "./Components/Nav.jsx";
import Accueil from "./Components/Accueil.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Applicant from "./Components/applicant.jsx";
import ApplicationPage from "./pages/ApplicationPage.jsx"; 
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import Protection from "./Components/Protection.jsx";
import Entreprises from "./pages/Entreprises.jsx";

function Layout() {
  const location = useLocation();

  const hideFooter = ["/admin", "/recruiter", "/applicant", "/profile"].includes(
    location.pathname
  );

  return (
    <div className="App">
      <Nav />
      <main className="pt-16">
        <Outlet />
      </main>

      {!hideFooter && (
        <footer className="bg-[#1f1f2e] text-white px-6 py-12 mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">FindJob</h3>
              <p>
                FindJob est une plateforme qui vous permet de trouver un job qui
                vous correspond à travers les meilleures offres sur le marché !
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Navigation</h3>
              <p>
                Accédez rapidement aux sections importantes du site pour trouver
                le job qui vous correspond.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">À propos</h3>
              <p>
                Nous connectons les talents et les entreprises grâce à une
                expérience fluide et intuitive.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact</h3>
              <p>contact@findjob.com</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/entreprises" element={<Entreprises />} />
          <Route
            path="/admin"
            element={
              <Protection allowedRoles={["admin"]}>
                <AdminDashboard />
              </Protection>
            }
          />
          <Route
            path="/recruiter"
            element={
              <Protection allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </Protection>
            }
          />
          <Route
            path="/applicant"
            element={
              <Protection allowedRoles={["applicant"]}>
                <Applicant />
              </Protection>
            }
          />
          <Route
            path="/profile"
            element={
              <Protection allowedRoles={["admin", "recruiter", "applicant"]}>
                <Profile />
              </Protection>
            }
          />

          <Route
            path="/apply/:jobId"
            element={
              <Protection allowedRoles={["applicant"]}>
                <ApplicationPage />
              </Protection>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
