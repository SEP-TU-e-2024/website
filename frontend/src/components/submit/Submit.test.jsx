import { describe, expect, it, vi } from "vitest";
import Submit from "./Submit";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../testing_utils/TestingUtils";

describe("Basic components", () => {  
    it('basic fields for guests', () => {
        renderWithRouter(false, Submit);
  
        const submissionName = screen.getByPlaceholderText('Submission Name');
        expect(submissionName).toBeInTheDocument();
        const fileSelection = screen.getByText('Drag and drop a file');
        expect(fileSelection).toBeInTheDocument();
        const submitButton = screen.getByText('Submit solution');
        expect(submitButton).toBeInTheDocument();
    });

    it('basic fields for members', () => {
        renderWithRouter(true, Submit);
  
        const submissionName = screen.getByPlaceholderText('Submission Name');
        expect(submissionName).toBeInTheDocument();
        const fileSelection = screen.getByText('Drag and drop a file');
        expect(fileSelection).toBeInTheDocument();
        const submitButton = screen.getByText('Submit solution');
        expect(submitButton).toBeInTheDocument();
    });
});

describe('Submission name', () => {
    it("should enter a submission name", async () => {
        renderWithRouter(false, Submit);

        const input = screen.getByPlaceholderText("Submission Name");

        // Fill in testName as the name of the submission
        const testName = 'test';
        expect(input.value).not.toBe(testName);
        fireEvent.change(input, {target: {value: testName}})

        // Check if the test name has been entered
        await waitFor(async () => {
            expect(input.value).toBe(testName);
        });
    });
});

describe('Email field', () => {       
    it("guest should see an email field", async () => {
        // Render the page as a guest (not logged in)
        renderWithRouter(false, Submit);

        const input = screen.getByPlaceholderText("Email");
        expect(input).toBeInTheDocument();
    });

    it("guest should enter an email", async () => {
        // Render the page as a guest (not logged in)
        renderWithRouter(false, Submit);

        const input = screen.getByPlaceholderText("Email");
        // Fill in testName as the email
        const testEmail = 'test@email.com';
        expect(input.value).not.toBe(testEmail);
        fireEvent.change(input, {target: {value: testEmail}})

        // Check if the test email has been entered
        await waitFor(async () => {
            expect(input.value).toBe(testEmail);
        });
    });

    it("member should not see an email field", async () => {
        // Render the page as a member (logged in)
        renderWithRouter(true, Submit);
        
        // Check if the element is not present
        const input = screen.queryByPlaceholderText("Email");
        await waitFor(async () => {
            expect(input).not.toBeInTheDocument();
        });
    });
});

describe("isDownloadable checkbox", () => {
    it("should show a checkbox for isDownloadable", async () => {
        renderWithRouter(false, Submit);

        // Check if the elements are present
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
        expect(screen.getByText("Make submission downloadable to other users")).toBeInTheDocument();
    });
    
    it("should handle download checkbox change", async () => {
        renderWithRouter(false, Submit);

        // Check if checkbox is not checked initially
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).not.toBeChecked();

        // Check the checkbox
        userEvent.click(checkbox);
        await waitFor(async () => {
            // Check if the checkbox is checked now
            expect(checkbox).toBeChecked();
        });
    });
});

describe("file upload", () => {
    // Function to create a mock File object
    function createMockFile(name, sizeInBytes, fileType) {
        const content = new Uint8Array(sizeInBytes);
        const blob = new Blob([content], { type: fileType });
        return new File([blob], name, { type: fileType });
    }
    
    // Mock console.error
    console.error = vi.fn();
    
    it('should alert when everything except file is provided', async () => {
        renderWithRouter(true, Submit);
  
        const input = screen.getByPlaceholderText("Submission Name");
        // Fill in testName as the name of the submission
        const testName = 'test';
        fireEvent.change(input, {target: {value: testName}})

        // Submit without selecting a file
        const submitButton = screen.getByText('Submit solution');
        userEvent.click(submitButton);
    
        // Check that the correct alert is shown
        await waitFor(() => {
            expect(screen.getByText("No file provided")).toBeInTheDocument();
        });
    });

    it("should show file name", async () => {
        renderWithRouter(true, Submit);
        // Find the file input 
        const fileInput = document.querySelector('.upload_container input[type="file"]');

        // Simulate selecting a dummy file
        const dummyFile = new File(['dummy content'], 'dummy.zip', { type: 'application/zip' });
        Object.defineProperty(fileInput, 'files', {
            value: [dummyFile],
        });
        fireEvent.change(fileInput);

        // Check if the file was selected
        expect(screen.getByText("dummy.zip")).toBeInTheDocument();
    });

    it("should alert if file name exceeds 50 characters", async () => {
        renderWithRouter(true, Submit);
                
        const input = screen.getByPlaceholderText("Submission Name");
        // Fill in testName as the name of the submission
        const testName = 'test';
        fireEvent.change(input, {target: {value: testName}})

        // Find the file input 
        const fileInput = document.querySelector('.upload_container input[type="file"]');

        // Simulate selecting a dummy file
        const dummyFile = new File(['dummy content'], 'dummy11115111102222522220333353333044445444405555555550.zip', { type: 'application/zip' });
        Object.defineProperty(fileInput, 'files', {
            value: [dummyFile],
        });
        fireEvent.change(fileInput);

        // Check if the file was selected
        expect(screen.queryByText("dummy11115111102222522220333353333044445444405555555550.zip")).toBeInTheDocument();

        // Submit
        const submitButton = screen.getByText('Submit solution');
        userEvent.click(submitButton);
    
        // Check that the correct alert is shown
        await waitFor(() => {
            expect(screen.getByText("File name exceeds 50 characters.")).toBeInTheDocument();
        });
    });
    
    it("should alert if file size is too big", async () => {
        renderWithRouter(true, Submit);
                
        const input = screen.getByPlaceholderText("Submission Name");
        // Fill in testName as the name of the submission
        const testName = 'test';
        fireEvent.change(input, {target: {value: testName}})

        // Find the file input 
        const fileInput = document.querySelector('.upload_container input[type="file"]');

        // Simulate selecting a dummy file
        const largeFileSize = 50 * 1024 * 1024 + 1024; // 50 MB + 1 KB
        const dummyFile = createMockFile('toolarge.zip', largeFileSize, 'application/zip');
        // const dummyFile = new File(['dummy content'.repeat(10 * 1024 * 1024)], 'too big.zip', { type: 'application/zip' });
        Object.defineProperty(fileInput, 'files', {
            value: [dummyFile],
        });
        fireEvent.change(fileInput);

        // Check if the file was selected
        expect(screen.queryByText("toolarge.zip")).toBeInTheDocument();

        // Submit
        const submitButton = screen.getByText('Submit solution');
        userEvent.click(submitButton);
    
        // Check that the correct alert is shown
        await waitFor(() => {
            expect(screen.getByText("File size exceeds 50MB.")).toBeInTheDocument();
        });
    });

    // Reset mocks after each test
    afterEach(() => {
        console.error.mockClear();
    });
});