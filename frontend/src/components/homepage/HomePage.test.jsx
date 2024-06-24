import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import HomePage from "./HomePage";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import api from "../../api";
import { mockMemberContextData, mockNoProblemData, mockProblemData, mockMultiProblemData } from "../testing_utils/TestingUtils";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";

function renderWithRouter() {
    render(
        // Wrapped in BrowserRouter for navigation
        <BrowserRouter>
            <AlertProvider>
                {/* Mocks the user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <HomePage/>
                </AuthContext.Provider>
            </AlertProvider>
        </BrowserRouter>
    );
}
describe("HomePage", () => {
    beforeEach(() => {
        // Reset window.location to the homepage to avoid leaking state
        window.location.assign('/');
        // Reset the mock object to avoid leaking state
        vi.resetAllMocks();
    });

    afterEach(() => {
        // Restore the mock object to its original state after each test to avoid leaking state    
        vi.restoreAllMocks();
    });

    it("should display 'no data found' if no data is given", async () => {
        // Spy on the api.post function that retrieves data from the database
        // Let it return no problem categories
        const apiSpy = vi.spyOn(api, 'post').mockResolvedValue(mockNoProblemData);

        // Render the HomePage component wrapped in BrowserRouter
        renderWithRouter();

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the mock function has been used instead of the actual function
            expect(apiSpy).toHaveBeenCalled();
            // Check whether the correct text is displayed
            expect(screen.getByText('No data found')).toBeInTheDocument();
        });

    });

    it("should display the problem category it is given", async () => {
        // Spy on the api.post function that retrieves data from the database
        // Let it return one problem category
        const apiSpy = vi.spyOn(api, 'post').mockResolvedValue({data:mockProblemData});

        renderWithRouter();

        // Wait for the entire page to render before testing its components
        // Necessary because of the data fetching going on
        await waitFor(() => {
            // Check whether our mock function has been used instead of the regular one
            expect(apiSpy).toBeCalled();
            // Check whether the correct text is displayed
            const noDataText = screen.queryByText("No data found");
            expect(noDataText).not.toBeInTheDocument();
            const TSP = screen.getByText(mockProblemData[0].name);
            expect(TSP).toBeInTheDocument();
        });
    });

    it("should display all problem categories given", async () => {
        // Spy on the api.post function that retrieves data from the database
        // Let it return one problem category
        const apiSpy = vi.spyOn(api, 'post').mockResolvedValue({data:mockMultiProblemData});

        renderWithRouter();

        // Wait for the entire page to render before testing its components
        // Necessary because of the data fetching going on
        await waitFor(() => {
            // Check whether our mock function has been used instead of the regular one
            expect(apiSpy).toBeCalled();
            // Check whether the correct text is displayed
            const noDataText = screen.queryByText("No data found");
            expect(noDataText).not.toBeInTheDocument();
            const TSP = screen.getByText(mockMultiProblemData[0].name);
            expect(TSP).toBeInTheDocument();
            const CVRP = screen.getByText(mockMultiProblemData[1].name);
            expect(CVRP).toBeInTheDocument();
        });
    });

    it("should redirect to problem occurrence page when it's clicked", async () => {
        // Spy on the api.post function that retrieves data from the database
        // Let it return one problem category
        const apiSpy = vi.spyOn(api, 'post').mockResolvedValue({data:mockMultiProblemData});

        renderWithRouter();

        // Wait for the entire page to render before testing its components
        // Necessary because of the data fetching going on
        await waitFor(async () => {
            // Check whether our mock function has been used instead of the regular one
            expect(apiSpy).toBeCalled();
            // Check whether the correct text is displayed
            const noDataText = screen.queryByText("No data found");
            expect(noDataText).not.toBeInTheDocument();
            const specifiedProblem = screen.getByText(mockMultiProblemData[0].specified_problems[0].name);
            expect(specifiedProblem).toBeInTheDocument();
            // Check whether we are indeed on the homepage before clicking
            expect(window.location.pathname).toContain("/");
            // Click on a specified problem
            await userEvent.click(specifiedProblem);
            expect(window.location.pathname).toContain("/problemoccurrence/" + mockMultiProblemData[0].specified_problems[0].id);
        });
    });

});