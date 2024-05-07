import { useState, useEffect } from 'react'
import MyNavbar from './components/navbar/MyNavbar';
import HomePage from './components/homepage/HomePage';
import LoginForm from './components/forms/LoginForm';
import LeaderboardPage from './components/leaderboardPage/LeaderboardPage'
import RegisterForm from './components/forms/RegisterForm';
import { AuthProvider } from './context/AuthContext';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import ProtectedRoute from './util/ProtectedRoute';

function App() {
  return (
    <>
        <Router>
            <AuthProvider>
                
            <MyNavbar />
            
            <div className='container'>
                <Routes>
                    <Route 
                        path= "/" 
                        element = 
                        {
                        // <ProtectedRoute> 
                            <HomePage/>
                        // </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path= "/home"
                        element = 
                        {
                        // <ProtectedRoute> 
                            <HomePage/>
                        // </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path= "/leaderboard"
                        element = 
                        {
                        // <ProtectedRoute> 
                            <LeaderboardPage/>
                        // </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/login" 
                        element={<LoginForm/>} 
                    />
                    <Route 
                        path="/register" 
                        element={<RegisterForm/>} 
                    />
                </Routes>
            </div>
            </AuthProvider>
        </Router>      
    </>
  )
}

export default App
