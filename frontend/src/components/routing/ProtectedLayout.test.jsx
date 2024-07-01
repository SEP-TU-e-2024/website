import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, vi } from "vitest";
import ProtectedLayout from "./ProtectedLayout";
import userEvent from "@testing-library/user-event";
import { mockMemberContextData, renderWithRouter } from "../testing_utils/TestingUtils";

describe("Protected layout", () => {
    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign("/");
    });

    it("should show a member the logout button", () => {
        renderWithRouter(true, ProtectedLayout);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });   
    
    it("should show the 'about' link in the footer", () => {
        renderWithRouter(true, ProtectedLayout);
        // Find 'about'
        const about = screen.getByText("About");
        // Check whether 'about' is present
        expect(about).toBeInTheDocument();
        // Check whether it is contained in a footer
        const footer = about.closest('footer');
        expect(footer).toBeInTheDocument();
    });

    it("should call logout function when logout button is clicked", async () => {
        renderWithRouter(true, ProtectedLayout);
        // Find logout button
        const logoutButton = screen.getByText("Logout");
        // Simulate click of logout button
        await userEvent.click(logoutButton);
        expect(mockMemberContextData.logout_user).toHaveBeenCalledOnce();
    });

    it("should navigate a guest to login", () => {
        // Should not be at login yet
        expect(window.location.pathname).not.toContain("/login");
        renderWithRouter(false, ProtectedLayout);
        // Should have redirected a guest to the login page
        expect(window.location.pathname).toContain("/login");
    });
    
    it("should redirect to about page when 'about' in footer is clicked", async () => {
        renderWithRouter(true, ProtectedLayout);
        // Check if not in homepage before navigating
        expect(window.location.pathname).not.toContain("/about");
        // Find 'about' in the navbar
        const about = screen.getByText("About");
        // Simulate click of 'about'
        await userEvent.click(about);
        expect(window.location.pathname).toContain("/about");
    });
});