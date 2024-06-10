import { render, screen} from "@testing-library/react";
import { describe, expect } from "vitest";
import { BrowserRouter } from "react-router-dom";

import MyNavbar from "./MyNavbar";
import AuthContext from "../../context/AuthContext";

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

describe("Navbar component", () => {
    it("should render a logo", () => {
        render(
            // Wrapped in BrowserRouter because MyNavBar uses routing functions
            <BrowserRouter>
                {/* Mock the AuthContext that MyNavBar uses to handle user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <MyNavbar/>
                </AuthContext.Provider>
            </BrowserRouter>);
        // Find logo in the navbar
        const logo = screen.getByAltText("logo");
        expect(logo).toBeInTheDocument();
    });
});