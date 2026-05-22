import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import AnalyticsPage from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import LinksPage from "./pages/Links";
import CreateLinkPage from "./pages/CreateLink";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/links" element={<LinksPage />} />
        <Route path="/create" element={<CreateLinkPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
