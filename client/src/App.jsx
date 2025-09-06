import { Routes, Route } from "react-router-dom";
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* rute untuk halamam utama akan menampilkan Dashboard */}
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }/>
    </Routes>
  );
}

export default App;