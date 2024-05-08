import Navbar from "./components/navbar/Navbar";
import HomePage from "./components/homepage/HomePage";
import LoginForm from "./components/forms/LoginForm";
import Submit from "./components/submit/Submit";
import RegisterForm from "./components/forms/RegisterForm";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./util/ProtectedRoute";
import TokenAuthenticator from "./components/tokenauthenticator/TokenAuthenticator";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/tokens" element={<TokenAuthenticator />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route
                path="/submit"
                element={
                  <ProtectedRoute>
                    <Submit />
                  </ProtectedRoute>
                }
              /> 
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
