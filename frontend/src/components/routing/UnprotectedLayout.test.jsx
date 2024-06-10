import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import UnprotectedLayout from "./UnprotectedLayout";
import AuthContext from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// Mocks a user object
const mockUser = {
    name: 'Test User',
    token: 'mock-session-token'
};

// Mocks a user that is logged in, i.e. a member
const mockMemberContextData = {
    user: mockUser,
    set_tokens: vi.fn(),
    login_user: vi.fn(),
    logout_user: vi.fn(),
    register_user: vi.fn(),
    send_email_login: vi.fn(),
};

// Mocks a user that is not logged in, i.e. a guest
const mockGuestContextData = {
    user: null, // null because user is not logged in
    set_tokens: vi.fn(),
    login_user: vi.fn(),
    logout_user: vi.fn(),
    register_user: vi.fn(),
    send_email_login: vi.fn(),
};

describe("Unprotected layout", () => {

    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign('/');
    });
    
    it("should show a guest the registration button", () => {
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find register button
        const registerButton = screen.getByText("Registration");
        // Check whether user was redirected to register page
        expect(registerButton).toBeInTheDocument();
    });

    it("should navigate to registration page when register button is clicked", async () => {
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
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
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        expect(window.location.pathname).not.toContain("/login");
    });
    
    it("should show a guest the login button", () => {
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();
    });

    it("should show a member the logout button", () => {
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });

    it("should call the logout_user function when logout button is clicked", async () => {
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        // Check whether logout_user has been called
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });
    
    it("should redirect to home page when logo is clicked", async () => {
        window.location.assign("/login");
        render(
            // Wrapped in BrowserRouter because it uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that it uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <UnprotectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find logo in the navbar
        const logo = screen.getByAltText("logo");
        // Simulate click of the logo
        await userEvent.click(logo);
        expect(window.location.pathname).toBe("/");
    });
})