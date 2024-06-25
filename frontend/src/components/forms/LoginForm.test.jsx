import { describe, expect } from "vitest";
import LoginForm from "./LoginForm";
import { mockGuestContextData, mockMemberContextData, renderWithRouter } from "../testing_utils/TestingUtils";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";
import { MemoryRouter, Route, Routes } from "react-router-dom";

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

describe("LoginForm fields", () => {
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