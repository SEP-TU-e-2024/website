import LoginForm from "./components/forms/LoginForm";
import Submit from "./components/submit/Submit";
import { useState, useEffect } from 'react'
import MyNavbar from './components/navbar/MyNavbar';
import HomePage from './components/homepage/HomePage';
import RegisterForm from "./components/forms/RegisterForm";
import LeaderboardPage from './components/leaderboardPage/LeaderboardPage'
import { AuthProvider } from './context/AuthContext';
import {
    // BrowserRouter as Router,
    Routes,
    Route,
    BrowserRouter,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import ProtectedRoute from './util/ProtectedRoute';
import TokenAuthenticator from "./components/tokenauthenticator/TokenAuthenticator";
import ProblemOccurrenceOverviewPage from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';
import ErrorPage from "./components/errorPage/ErrorPage";
import AuthLayout from "./components/routing/AuthLayout";
import ProtectedLayout from "./components/routing/ProtectedLayout";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />} errorElement={<ErrorPage />}>
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/submit" element={<Submit />} />
          <Route 
            path="/problemoccurrence/:poID" 
            element={<ProblemOccurrenceOverviewPage />} 
            loader={async ({ params }) => {
              return "hi"; //TODO fetching logic here
            }} />
        </Route>
          
        {/* Non protected routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Route>
      
    </>
  )
);

// function App() {
//   return (
//     <>
//       <Router>
//         <AuthProvider>
//           <MyNavbar />
//           <div className="container">
//             <Routes>
//               <Route path="/tokens" element={<TokenAuthenticator />} />
//               <Route
//                 path="/"
//                 element={
//                   <ProtectedRoute>
//                     <HomePage />
//                   </ProtectedRoute>
//                 }
//                 errorElement={<ErrorPage />}
//               />
//               <Route
//                 path="/home"
//                 element={
//                   <ProtectedRoute>
//                     <HomePage />
//                   </ProtectedRoute>
//                 }
//               />
//               <Route 
//                 path= "/leaderboard"
//                 element = {
//                 <ProtectedRoute> 
//                     <LeaderboardPage/>
//                 </ProtectedRoute>
//                 } 
//               />
//               <Route 
//                 path= "/problemoccurrence" //TODO add multiple paths here for the different problem occurences
//                 element = {
//                 <ProtectedRoute> 
//                     <ProblemOccurrenceOverviewPage/>
//                 </ProtectedRoute>
//                 } 
//               />
//               <Route 
//                 path= "/temporary"
//                 element = {
//                 <ProtectedRoute> 
//                     <RegisterForm/>
//                 </ProtectedRoute>
//                 } 
//               />
//               <Route path="/login" element={<LoginForm />} />
//               <Route path="/register" element={<RegisterForm />} />
//               <Route
//                 path="/submit"
//                 element={
//                     <Submit />
//                 }
//               /> 
//             </Routes>
//           </div>
//         </AuthProvider>
//       </Router>
//     </>
//   );
// }

// export default router;//App;
