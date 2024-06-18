import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import ProtectedLayout from "./ProtectedLayout";
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
                    <ProtectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    } else {
        render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <ProtectedLayout/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }    
}

describe("Protected layout", () => {
    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign("/");
    });

    it("should show a member the logout button", () => {
        renderWithRouter(true);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });   

    it("should call logout function when logout button is clicked", async () => {
        renderWithRouter(true);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });

    it("should navigate a guest to login", () => {
        // Should not be at login yet
        expect(window.location.pathname).not.toContain("/login");
        renderWithRouter(false);
        // Should have redirected a guest to the login page
        expect(window.location.pathname).toContain("/login");
    });
    
    
});