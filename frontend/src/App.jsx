import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";

import LoginForm from "./components/forms/LoginForm";
import Submit from "./components/submit/Submit";
import HomePage from './components/homepage/HomePage';
import RegisterForm from "./components/forms/RegisterForm";
import ProblemOccurrenceOverviewPage from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';
import ErrorPage from "./components/errorPage/ErrorPage";
import DevelopmentPage from "./components/developmentPage/DevelopmentPage";
import AuthLayout from "./components/routing/AuthLayout";
import ProtectedLayout from "./components/routing/ProtectedLayout";
import TokenAuthenticator from "./components/tokenauthenticator/TokenAuthenticator";
import UnProtectedLayout from "./components/routing/UnprotectedLayout";

import { getPOInfo } from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';
import AccountPage from "./components/accountPage/AccountPage";
import Aboutpage from "./components/about/AboutPage";
import VerificationPage from "./components/verificationPage/VerificationPage";
import { useAlert } from "./context/AlertContext";

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
          <Route path="/account" element={<AccountPage />} />
        </Route>
          
        {/* Non protected routes */}
        <Route element={<UnProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/about" element={<Aboutpage />} />
          {/* Basically an endpoint to save the auth tokens from email only login */}
          <Route path="/tokens" element={<TokenAuthenticator />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/verify/:uid/:token" element={<VerificationPage />} />
          <Route 
            path="/problemoccurrence/:problem_occurence" 
            element={<ProblemOccurrenceOverviewPage />} 
            loader={async ({ params }) => {
              return getPOInfo(params.problem_occurence); //TODO fetching logic here
            }} />
          <Route path="/in_development" element={<DevelopmentPage />} />
        </Route>
        
      </Route>
      
    </>
  )
);