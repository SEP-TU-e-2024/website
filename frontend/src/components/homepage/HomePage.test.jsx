import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import HomePage from "./HomePage";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import api from "../../api";
import { mockNoProblemData, mockProblemData, mockMultiProblemData, renderWithRouter } from "../testing_utils/TestingUtils";

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
        renderWithRouter(true, HomePage);

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

        renderWithRouter(true, HomePage);

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

        renderWithRouter(true, HomePage);

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

        renderWithRouter(true, HomePage);

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

describe('API Error test suite', () => {
    const apiSpy = (statusCode) => {
        const spy = vi.spyOn(api, 'post').mockRejectedValue({
            response: {
                status: statusCode,
            }
        });
        return spy
    }        
    
    it('Error 401', async () => {
        // Render component
        const spy = apiSpy(401);
        renderWithRouter(true, HomePage);

        await waitFor(async () => {
            // Check for error message
            expect(spy).toBeCalled();
            expect(screen.getByText("Unauthorized to access this content")).toBeInTheDocument();
        });
    });

    it('Error 404', async () => {
        // Render component
        const spy = apiSpy(404);
        renderWithRouter(true, HomePage);

        await waitFor(async () => {
            // Check for error message
            expect(spy).toBeCalled();
            expect(screen.getByText("No problems found")).toBeInTheDocument();
        });
    });

    it('Generic error', async () => {
        // Render component
        const spy = apiSpy(500);
        renderWithRouter(true, HomePage);

        await waitFor(async () => {
            // Check for error message
            expect(spy).toBeCalled();
            expect(screen.getByText("Something went wrong")).toBeInTheDocument();
        });
    });
});
