import { describe, expect, it, vi } from "vitest";
import Submit from "./Submit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import AuthContext from "../../context/AuthContext";
import api from "../../api";
import { mockGuestContextData, mockMemberContextData } from "../testing_utils/TestingUtils";

function renderWithRouter(loggedIn) {
    if (loggedIn) {
        render(
            // Wrapped in BrowserRouter for navigation
            <BrowserRouter>
                {/* Mocks the user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <Submit/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    } else {
        render(
            // Wrapped in BrowserRouter to do navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <Submit/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }    
}

describe("Submit form", () => {
    beforeEach(() => {
        // Reset the mock object to avoid leaking state
        vi.resetAllMocks();
    });

    afterEach(() => {
        // Restore the mock object to its original state after each test to avoid leaking state    
        vi.restoreAllMocks();
    });

    it("should contain a submit button", () => {
        renderWithRouter(false);

        // Check whether submit button is in there
        const submitButton = screen.getByText("Submit solution");
        expect(submitButton).toBeInTheDocument();
    });

    it("should alert when no file is provided", async () => {
        renderWithRouter(false);

        // Mock the window.alert function such that we can check whether it's been called
        window.alert = vi.fn();

        // Press submit button without providing a file
        const submitButton = screen.getByText("Submit solution");
        userEvent.click(submitButton);
        waitFor(() => {
            expect(window.alert).toBeCalledWith("No file provided");
        });
    });

    it("should select a provided document", async () => {
        renderWithRouter(false);
        
        const fileSelector = screen.getByLabelText('Select a File');
        // Create mock file
        const file = new File(['file contents'], 'example.zip', { type: 'application/zip' });
        expect(fileSelector.files).not.toContain(file);
        // Submit mock file
        fireEvent.change(fileSelector, { target: { files: [file] } });
        // Fill in testName as the name of the submission
        await waitFor(async () => {
            // Check if only the test file has been selected
            expect(fileSelector.files[0]).toBe(file);
            expect(fileSelector.files).toHaveLength(1);
        });
    });

    it("should enter a submission name", async () => {
        renderWithRouter(false);
        const input = screen.getByPlaceholderText("Submission Name");
        // Fill in testName as the name of the submission
        const testName = 'test';
        expect(input.value).not.toBe(testName);
        fireEvent.change(input, {target: {value: testName}})
        await waitFor(async () => {
            // Check if the test name has been entered
            expect(input.value).toBe(testName);
        });
    });
    
    it("guest should enter an email", async () => {
        renderWithRouter(false);
        const input = screen.getByPlaceholderText("Email");
        // Fill in testName as the email
        const testEmail = 'test@email.com';
        expect(input.value).not.toBe(testEmail);
        fireEvent.change(input, {target: {value: testEmail}})
        await waitFor(async () => {
            // Check if the test email has been entered
            expect(input.value).toBe(testEmail);
        });
    });

    it("member should not enter an email", async () => {
        renderWithRouter(true);
        const input = screen.queryByPlaceholderText("Email");
        await waitFor(async () => {
            // Check if the test name has been entered
            expect(input).not.toBeInTheDocument();
        });
    });
});