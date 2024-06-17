import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import UnprotectedLayout from "./UnprotectedLayout";
import AuthContext from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { mockGuestContextData, mockMemberContextData } from "../testing_utils/TestingUtils";

function renderWithRouter(loggedIn) {
    if (loggedIn) {
        render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    } else {
        render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }    
}

describe("Unprotected layout", () => {

    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign('/');
    });
    
    it("should show a guest the registration button", () => {
        renderWithRouter(false);
        // Find register button
        const registerButton = screen.getByText("Registration");
        // Check whether register button is present
        expect(registerButton).toBeInTheDocument();
    });

    it("should navigate to registration page when register button is clicked", async () => {
        renderWithRouter(false);
        // Should not be at register page yet
        expect(window.location.pathname).not.toContain("/register");
        // Find register button
        const registerButton = screen.getByText("Registration");
        // Simulate click of register button
        await userEvent.click(registerButton);
        // Check whether user was redirected to register page
        expect(window.location.pathname).toContain("/register");
    });

    it("should not redirect a guest to login", () => {
        renderWithRouter(false);
        // Check if not redirected to login
        expect(window.location.pathname).not.toContain("/login");
    });
    
    it("should show a guest the login button", () => {
        renderWithRouter(false);
        // Check if login button is present
        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();
    });

    it("should show a member the logout button", () => {
        renderWithRouter(true);
        // Check if logout button is present
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });

    it("should call the logout_user function when logout button is clicked", async () => {
        renderWithRouter(true);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        // Check whether logout_user has been called
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });
    
    it("should redirect to home page when logo is clicked", async () => {
        window.location.assign("/login");
        renderWithRouter(true);
        // Find logo in the navbar
        const logo = screen.getByAltText("logo");
        // Simulate click of the logo
        await userEvent.click(logo);
        expect(window.location.pathname).toBe("/");
    });
})