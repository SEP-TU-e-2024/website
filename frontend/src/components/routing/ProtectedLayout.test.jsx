import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import ProtectedLayout from "./ProtectedLayout";
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

describe("Protected layout", () => {
    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign("/");
    });

    it("should show a member the logout button", () => {
        render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the AuthContext that is used to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <ProtectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });   

    it("should call logout function when logout button is clicked", async () => {
        render(
            // Wrapped in BrowserRouter because MyNavBar uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that MyNavBar uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <ProtectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });

    it("should navigate a guest to login", () => {
        // Should not be at login yet
        expect(window.location.pathname).not.toContain("/login");
        render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the AuthContext that is used to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <ProtectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Should have redirected a guest to the login page
        expect(window.location.pathname).toContain("/login");
    });
    
    
});