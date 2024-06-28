import { describe, expect, vi } from "vitest";
import LoginForm from "./LoginForm";
import { mockGuestContextData, mockMemberContextData, renderWithRouter } from "../testing_utils/TestingUtils";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

const HomePage = () => <div>Home Page</div>;

function renderWithMemoryRouter(loggedIn) {
    render(<AlertProvider>
        {/* Wrapped in Authcontext to mock member data */}
        <AuthContext.Provider value={loggedIn ? mockMemberContextData : mockGuestContextData}>
            {/* Wrapped in MemoryRouter to allow for checking navigation. */}
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    </AlertProvider>
    );
} 

// Mock the register_user function
const mockLogin = vi.fn();

// Render the RegisterForm using the mocked AuthContext
function renderWithMockLogin(password) {
    // Create a mock AuthContext using the mock function
    const mockAuthContextValueEmail = {
        user: null,     // null to simulate a guest
        send_email_login: mockLogin,
    };
    // Mock a different function for password login
    const mockAuthContextValuePassword = {
        user: null,     // null to simulate a guest
        login_user: mockLogin,
    };

    render(<AlertProvider>
        <BrowserRouter>
            <AuthContext.Provider value={password ? mockAuthContextValuePassword : mockAuthContextValueEmail}>
                <LoginForm/>
            </AuthContext.Provider>
        </BrowserRouter>
    </AlertProvider>);
}

describe("LoginForm email fields", () => {
    it("by default only displays email field", () => {
        renderWithRouter(false, LoginForm);

        // Check if there's a field where the user should enter their email
        expect(screen.getByText("Email")).toBeInTheDocument();
        var textBox = screen.getAllByRole("textbox");
        expect(textBox).toHaveLength(1);
        expect(textBox[0].name).toBe("email");
        // Email field should be required
        expect(textBox[0]).toBeRequired();
        
        // Check if there's no field where the user should enter their password
        expect(screen.queryByText("Password")).not.toBeInTheDocument();
    });

    it("can fill in email", async () => {
        renderWithRouter(false, LoginForm);
        
        var textBox = screen.getAllByRole("textbox")[0];
        // Fill in testMail as email
        const testMail = 'test@email.com';
        expect(textBox.value).not.toBe(testMail);
        userEvent.type(textBox, testMail);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(textBox.value).toBe(testMail);
        });
    });

    it("calls register_user when the register button is pressed and required fields are filled", async () => {
        // Render with the register_user function mocked
        renderWithMockLogin(false);
        
        var textBox = screen.getAllByRole("textbox")[0];
        // Fill in testMail as email
        const testMail = 'test@email.com';
        await userEvent.type(textBox, testMail);

        // Press the login button
        var loginButton = screen.getByText("Send email");
        userEvent.click(loginButton);

        // Check if the register_user function has been called
        await waitFor(async () => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});

describe("LoginForm password fields", () => {
    it("displays password field when requested", async () => {
        renderWithRouter(false, LoginForm);

        // Check if there's no field where the user should enter their password
        expect(screen.queryByText("Password")).not.toBeInTheDocument();
        var textBox = screen.getAllByRole("textbox");
        expect(textBox).toHaveLength(1);
        expect(textBox[0].name).toBe("email");

        // Click 'Or login with password'
        var alternateLogin = screen.getByText("Or login with password");
        await userEvent.click(alternateLogin);

        // Check if there's now also a field where the user should enter their password
        expect(screen.getByText("Password")).toBeInTheDocument();
        const passwordContainer = screen.getByText("Password").closest("div");
        const passwordField = passwordContainer.children.namedItem("password");
        expect(passwordField).toBeInTheDocument();
        expect(passwordField.localName).toBe("input");
        // Password field should be required
        expect(passwordField).toBeRequired();
    });

    it("can fill in password field when present", async () => {
        renderWithRouter(false, LoginForm);

        // Click 'Or login with password'
        var alternateLogin = screen.getByText("Or login with password");
        await userEvent.click(alternateLogin);

        const passwordContainer = screen.getByText("Password").closest("div");
        const passwordField = passwordContainer.children.namedItem("password");
        // Fill in testPassword as password
        const testPassword = 'testing password';
        expect(passwordField.value).not.toBe(testPassword);
        userEvent.type(passwordField, testPassword);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(passwordField.value).toBe(testPassword);
        });
    });

    it("calls register_user when the register button is pressed and required fields are filled", async () => {
        // Render with the register_user function mocked
        renderWithMockLogin(true);
        
        // Click 'Or login with password'
        var alternateLogin = screen.getByText("Or login with password");
        await userEvent.click(alternateLogin);

        var textBox = screen.getAllByRole("textbox")[0];
        // Fill in testMail as email
        const testMail = 'test@email.com';
        await userEvent.type(textBox, testMail);

        const passwordContainer = screen.getByText("Password").closest("div");
        const passwordField = passwordContainer.children.namedItem("password");
        // Fill in testPassword as password
        const testPassword = 'testing password';
        await userEvent.type(passwordField, testPassword);

        // Press the login button
        var loginButton = screen.getByRole("button");
        userEvent.click(loginButton);

        // Check if the register_user function has been called
        await waitFor(async () => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });
});

describe("LoginForm redirects", () => {
    it("redirects member to home", async () => {
        renderWithMemoryRouter(true);
        
        // Check if a member was redirected to the home page
        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Login")).not.toBeInTheDocument();
    });

    it("does not redirect guest to home", async () => {
        renderWithMemoryRouter(false);

        // Check if a guest was not redirected to the home page
        expect(screen.getByText("Login")).toBeInTheDocument();        
        expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
    });
});