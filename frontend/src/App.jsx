import { useState, useEffect } from 'react'
import MyNavbar from './components/navbar/MyNavbar';
import HomePage from './components/homepage/HomePage';
import RegisterForm from "./components/forms/RegisterForm";
import LoginForm from './components/forms/LoginForm';
import LeaderboardPage from './components/leaderboardPage/LeaderboardPage'
import { AuthProvider } from './context/AuthContext';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import ProtectedRoute from './util/ProtectedRoute';
import TokenAuthenticator from "./components/tokenauthenticator/TokenAuthenticator";
import ProblemOccurrenceOverviewPage from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <MyNavbar />
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
              <Route 
                path= "/leaderboard"
                element = {
                <ProtectedRoute> 
                    <LeaderboardPage/>
                </ProtectedRoute>
                } 
                />
              <Route 
                path= "/problemoccurence" //TODO add multiple paths here for the different problem occurences
                element = {
                <ProtectedRoute> 
                    <ProblemOccurrenceOverviewPage/>
                </ProtectedRoute>
                } 
                />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
              {/* <Route
                path="/submit"
                element={
                  <ProtectedRoute>
                    <Submit />
                  </ProtectedRoute>
                }
              /> */}
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
