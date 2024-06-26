import { describe, expect, vi } from "vitest";
import RegisterForm from "./RegisterForm";
import { mockGuestContextData, mockMemberContextData, renderWithRouter } from "../testing_utils/TestingUtils";
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { render } from "@testing-library/react";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import React from "react";

const HomePage = () => <div>Home Page</div>;
const testMail = 'test@email.com';
const testPassword = 'testing password';

// Render RegisterForm with a MemoryRouter to allow for mocking navigation
function renderWithMemoryRouter(loggedIn) {
    render(<AlertProvider>
        {/* Wrapped in Authcontext to mock member data */}
        <AuthContext.Provider value={loggedIn ? mockMemberContextData : mockGuestContextData} >
            {/* Wrapped in MemoryRouter to allow for checking navigation. */}
            <MemoryRouter initialEntries={["/register"]}>
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterForm />} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    </AlertProvider>
    );
} 

// Render the RegisterForm and navigate to registration with password
async function renderWithPassword(loggedIn) {
    renderWithRouter(loggedIn, RegisterForm);
    
    // Click 'Want to login through password? Click here'
    var alternateRegister = screen.getByText("Want to login through password? Click here");
    await userEvent.click(alternateRegister);
}

// Mock the register_user function
const mockRegisterUser = vi.fn();

// Render the RegisterForm using the mocked AuthContext
function renderWithMockRegister() {
    // Create a mock AuthContext using the mock function
    const mockAuthContextValue = {
        user: null,     // null to simulate a guest
        register_user: mockRegisterUser,
    };
    render(<AlertProvider>
        <BrowserRouter>
            <AuthContext.Provider value={mockAuthContextValue}>
                <RegisterForm/>
            </AuthContext.Provider>
        </BrowserRouter>
    </AlertProvider>);
}

describe("RegisterForm fields", () => {
    beforeEach(() => {
        // Reset the mock object to avoid leaking state
        vi.resetAllMocks();
    });

    afterEach(() => {
        // Restore the mock object to its original state after each test to avoid leaking state    
        vi.restoreAllMocks();
    });
    
    it("by default displays email fields", () => {
        renderWithRouter(false, RegisterForm);

        // Find text fields
        var textBoxes = screen.getAllByRole("textbox");
        expect(textBoxes).toHaveLength(3);

        // Check if there's a field where the user should enter their email
        expect(screen.getByText("Email")).toBeInTheDocument();
        expect(textBoxes[1].name).toBe("email");
        // Email field should be required
        expect(textBoxes[1]).toBeRequired();

        // Check if there's a field where the user should confirm their email
        expect(screen.getByText("Confirm Email")).toBeInTheDocument();
        expect(textBoxes[2].name).toBe("confirm_email");
        // Confirm Email field should be required
        expect(textBoxes[2]).toBeRequired();
        
        // Check if there's no field where the user should enter their password
        expect(screen.queryByText("Password")).not.toBeInTheDocument();
    });

    it("displays password field when requested", async () => {
        renderWithRouter(false, RegisterForm);

        // Check if there's no field where the user should enter their password
        expect(screen.queryByText("Password")).not.toBeInTheDocument();
        var textBoxes = screen.getAllByRole("textbox");
        expect(textBoxes).toHaveLength(3);

        // Click 'Want to login through password? Click here'
        var alternateRegister = screen.getByText("Want to login through password? Click here");
        await userEvent.click(alternateRegister);

        // Find password fields
        const passwordFields = screen.getAllByText(/Password \(optional\)/i);
        expect(passwordFields).toHaveLength(2);
        
        // Check if there's now also a field where the user should enter their password
        const passwordContainer = passwordFields[0].closest("div");
        const passwordField = passwordContainer.children.namedItem("password");
        expect(passwordField).toBeInTheDocument();
        expect(passwordField.localName).toBe("input");
        // Password field should not be required
        expect(passwordField).not.toBeRequired();

        // Check if there's now also a field where the user should confirm their password
        const confirmPasswordContainer = passwordFields[1].closest("div");
        const confirmPasswordField = confirmPasswordContainer.children.namedItem("confirm_password");
        expect(confirmPasswordField).toBeInTheDocument();
        expect(confirmPasswordField.localName).toBe("input");
        // Confirm password field should not be required
        expect(confirmPasswordField).not.toBeRequired();
    });

    it("can fill in email", async () => {
        renderWithRouter(false, RegisterForm);
        
        var textBox = screen.getAllByRole("textbox")[1];
        // Fill in testMail as email
        expect(textBox.value).not.toBe(testMail);
        userEvent.type(textBox, testMail);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(textBox.value).toBe(testMail);
        });
    });

    it("can fill in confirm email", async () => {
        renderWithRouter(false, RegisterForm);
        
        var textBox = screen.getAllByRole("textbox")[2];
        // Fill in testMail as email
        expect(textBox.value).not.toBe(testMail);
        userEvent.type(textBox, testMail);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(textBox.value).toBe(testMail);
        });
    });

    it("can fill in password fields when present", async () => {
        await renderWithPassword(false);

        // Find password field
        const passwordFields = screen.getAllByText(/Password \(optional\)/i);
        const passwordContainer = passwordFields[0].closest("div");
        const passwordField = passwordContainer.children.namedItem("password");

        // Fill in testPassword as password
        expect(passwordField.value).not.toBe(testPassword);
        userEvent.type(passwordField, testPassword);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(passwordField.value).toBe(testPassword);
        }); 
    });

    it("can fill in confirm password field when present", async () => {
        await renderWithPassword(false);
        
        // Find confirm password field
        const confirmPasswordFields = screen.getAllByText(/Password \(optional\)/i);
        const confirmPasswordContainer = confirmPasswordFields[1].closest("div");
        const confirmPasswordField = confirmPasswordContainer.children.namedItem("confirm_password");

        // Fill in testPassword as password
        expect(confirmPasswordField.value).not.toBe(testPassword);
        userEvent.type(confirmPasswordField, testPassword);
        await waitFor(() => {
            // Check if the test email has been entered
            expect(confirmPasswordField.value).toBe(testPassword);
        });
    });

    it("calls register_user when the register button is pressed and required fields are filled", async () => {
        // Render with the register_user function mocked
        renderWithMockRegister(RegisterForm);
        
        // Fill in testMail as email
        var emailField = screen.getAllByRole("textbox")[1];
        expect(emailField.value).not.toBe(testMail);
        await userEvent.type(emailField, testMail);
        // Fill in something different as confirm email
        var confirmField = screen.getAllByRole("textbox")[2];
        await userEvent.type(confirmField, "not testMail");
        expect(confirmField.value).toBe("not testMail");
        expect(emailField.value).toBe(testMail);

        // Press the register button
        var registerButton = screen.getByText("Register");
        const form = screen.getByText('Confirm Email').closest('form');
        // await form.submit();
        userEvent.click(registerButton);

        // Check if the register_user function has been called
        await waitFor(async () => {
            expect(mockRegisterUser).toHaveBeenCalled();
        });
    });
});

describe("RegisterForm redirects", () => {
    it("redirects member to home", async () => {
        renderWithMemoryRouter(true);
        
        // Check if a member was redirected to the home page
        expect(screen.getByText("Home Page")).toBeInTheDocument();
        expect(screen.queryByText("Registration")).not.toBeInTheDocument();
    });

    it("does not redirect guest to home", async () => {
        renderWithMemoryRouter(false);

        // Check if a guest was not redirected to the home page
        expect(screen.getByText("Registration")).toBeInTheDocument();        
        expect(screen.queryByText("Home Page")).not.toBeInTheDocument();
    });
});