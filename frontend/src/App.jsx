import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";

import LoginForm from "./components/forms/LoginForm";
import Submit from "./components/submit/Submit";
import HomePage from './components/homepage/HomePage';
import RegisterForm from "./components/forms/RegisterForm";
import LeaderboardPage from './components/leaderboardPage/LeaderboardPage'
import ProblemOccurrenceOverviewPage from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';
import ErrorPage from "./components/errorPage/ErrorPage";
import AuthLayout from "./components/routing/AuthLayout";
import ProtectedLayout from "./components/routing/ProtectedLayout";
import TokenAuthenticator from "./components/tokenauthenticator/TokenAuthenticator";
import UnProtectedLayout from "./components/routing/UnprotectedLayout";

import { getPOInfo } from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';

/**
 * This is the router object.
 * The authlayout gives all the other routes acces to the auth context that is needed to do the protected routing.
 * see the react router dom documentation for kind of a guide on how extend this.
 * If you are adding a page and don't understand how to do it, please contact Thijs.
 */
export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<AuthLayout />} errorElement={<ErrorPage />}>
        
        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route 
            path="/problemoccurrence/:poID" 
            element={<ProblemOccurrenceOverviewPage />} 
            loader={async ({ params }) => {
              return getPOInfo(params.poID); //TODO fetching logic here
            }} />
        </Route>
          
        {/* Non protected routes */}
        <Route element={<UnProtectedLayout />}>
          <Route path="/submit" element={<Submit />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* Basically an endpoint to save the auth tokens from email only login */}
          <Route path="/tokens" element={<TokenAuthenticator />} />
        </Route>
        
      </Route>
      
    </>
  )
);