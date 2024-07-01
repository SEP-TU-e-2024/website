import { render, screen } from "@testing-library/react";
import { describe, expect, vi } from "vitest";
import UnprotectedLayout from "./UnprotectedLayout";
import AuthContext from "../../context/AuthContext";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { mockGuestContextData, mockMemberContextData } from "../testing_utils/TestingUtils";
import { AlertProvider } from "../../context/AlertContext";

const HomePage = () => <div>Home Page</div>;
const LoginPage = () => <div>Login Page</div>;
const RegisterPage = () => <div>Register Page</div>;
const AboutPage = () => <div>About Page</div>;

function renderWithRouter(loggedIn, initialEntries) {
    render(
        <AlertProvider>
            {/* Wrapped in Authcontext to mock user data. Logged in so mock member data */}
            <AuthContext.Provider value={loggedIn ? mockMemberContextData : mockGuestContextData}>
                {/* Wrapped in MemoryRouter to allow for checking navigation. Initial entries were passed as a parameter*/}
                <MemoryRouter initialEntries={initialEntries}>
                    <Routes>
                        <Route element={<UnprotectedLayout />}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/about" element={<AboutPage />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            </AuthContext.Provider>
        </AlertProvider>
    );
}

describe("Unprotected layout", () => {
    it("should show a guest the registration button", () => {
        renderWithRouter(false, ["/"]);
        // Find register button
        const registerButton = screen.getByText("Registration");
        // Check whether register button is present
        expect(registerButton).toBeInTheDocument();
    });
    
    it("should show a guest the login button", () => {
        renderWithRouter(false, ["/"]);
        // Check if login button is present
        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();
    });

    it("should show a member the logout button", () => {
        renderWithRouter(true, ["/"]);
        // Check if logout button is present
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });

    it("should show the 'about' link in the footer", () => {
        renderWithRouter(false, ["/"]);
        // Find 'about'
        const about = screen.getByText("About");
        // Check whether 'about' is present
        expect(about).toBeInTheDocument();
        // Check whether it is contained in a footer
        const footer = about.closest('footer');
        expect(footer).toBeInTheDocument();
    });
});

describe('Navigation', () => {
    it("should navigate to registration page when register button is clicked", async () => {
        renderWithRouter(false, ["/"]);
        // Should not be at register page yet
        expect(screen.queryByText('Register Page')).not.toBeInTheDocument();
        // Find register button
        const registerButton = screen.getByText("Registration");
        // Simulate click of register button
        await userEvent.click(registerButton);
        // Check whether user was redirected to register page
        expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    it("should not redirect a guest to login", () => {
        renderWithRouter(false, ["/"]);
        // Check if not redirected to login
        expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("should call the logout_user function when logout button is clicked", async () => {
        renderWithRouter(true, ["/"]);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        // Check whether logout_user has been called
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });
    
    it("should navigate to home page when logo is clicked", async () => {
        renderWithRouter(false, ["/login"]);
        // Check if not in homepage before navigating
        expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
        // Find logo in the navbar
        const logo = screen.getByAltText("logo");
        // Simulate click of the logo
        await userEvent.click(logo);
        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });

    it("should navigate to about page when 'about' in footer is clicked", async () => {
        renderWithRouter(false, ["/login"]);
        // Check if not in homepage before navigating
        expect(screen.queryByText("About Page")).not.toBeInTheDocument();
        // Find 'about' in the navbar
        const about = screen.getByText("About");
        // Simulate click of 'about'
        await userEvent.click(about);
        expect(screen.getByText("About Page")).toBeInTheDocument();
    });
})