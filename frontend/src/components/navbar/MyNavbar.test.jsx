import { fireEvent, render, screen, waitFor} from "@testing-library/react";
import { describe, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";

import MyNavbar from "./MyNavbar";
import AuthContext from "../../context/AuthContext";
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
}

// Mocks a user that is not logged in, i.e. a guest
const mockGuestContextData = {
    user: null, // null because user is not logged in
    set_tokens: vi.fn(),
    login_user: vi.fn(),
    logout_user: vi.fn(),
    register_user: vi.fn(),
    send_email_login: vi.fn(),
};

describe("Navbar component", () => {
    it("should render a logo", () => {
        render(
            // Wrapped in BrowserRouter because MyNavBar uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that MyNavBar uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <MyNavbar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Find logo in the navbar
        const logo = screen.getByAltText("logo");
        expect(logo).toBeInTheDocument();
    });

    it("should shrink navbar with window size", async () => {
        render(
            // Wrapped in BrowserRouter because MyNavBar uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that MyNavBar uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <MyNavbar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Resize the window
        Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 200});
        await fireEvent(window, new Event("resize"));
        waitFor(() => {
            // Check if the buttons are in the document
            // If the navbar is shrunk properly, they shouldn't be visible
            const loginButton = screen.getByText("Login");
            expect(loginButton).not.toBeVisible();
            const logoutButton = screen.getByText("Logout");
            expect(logoutButton).not.toBeVisible();
            const registerButton = screen.getByText("Registration");
            expect(registerButton).not.toBeVisible();
            // Logo should still be visible
            const logo = screen.getByAltText("logo");
            expect(logo).toBeVisible();
            // Navbar toggler (to expand/collaps navbar in this state) should be visible
            const toggler = screen.getByText("navbar-toggler");
            expect(toggler).toBeVisible();
        });        
    });

    it("navbar toggler should expand navbar", async () => {
        render(
            // Wrapped in BrowserRouter because MyNavBar uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that MyNavBar uses to handle user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <MyNavbar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
        // Resize the window
        Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 200});
        await fireEvent(window, new Event("resize"));
        waitFor(async () => {
            // Find navbar toggler
            const toggler = screen.getByText("navbar-toggler");
            // Buttons should not be visible
            const loginButton = screen.getByText("Login");
            expect(loginButton).not.toBeVisible();
            const logoutButton = screen.getByText("Logout");
            expect(logoutButton).not.toBeVisible();
            const registerButton = screen.getByText("Registration");
            expect(registerButton).not.toBeVisible();
            // Click the toggler to expand the navbar
            await userEvent.click(toggler);
            // Buttons should be visible now
            expect(loginButton).toBeVisible();
            expect(logoutButton).toBeVisible();
            expect(registerButton).toBeVisible();
        });
    });
});