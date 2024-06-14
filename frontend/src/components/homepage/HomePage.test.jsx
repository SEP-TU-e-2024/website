import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import HomePage from "./HomePage";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import api from "../../api";

// Data for if no problem data is retrieved
const mockNoProblemData = {};

// Data defining a problem category to be displayed on the homepage
const mockProblemData = [
    {
        description : "The Time Slotting Problem (TSP) entails optimizing the allocation of entities into predefined time slots.",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc3",
        name : "Time Slotting Problem",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0745', name : 'Meeting scheduling'}],
        style : 0,
        type : 1,
        validator: null
    }
];

// Data defining a couple problem categories to be displayed on the homepage
const mockMultiProblemData = [
    {
        description : "The Time Slotting Problem (TSP) entails optimizing the allocation of entities into predefined time slots.",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc3",
        name : "Time Slotting Problem",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0745', name : 'Meeting scheduling'}],
        style : 0,
        type : 1,
        validator: null
    }, {
        description : "The Capacitated Vehicle Routing Problem (CVRP) is a logistics optimization challenge where a fleet of vehicles with limited capacity must efficiently serve a set of customers while minimizing transportation costs. Each vehicle starts and ends its route at a central depot, visiting customers to fulfill their demands without exceeding the vehicle's capacity. The objective is to minimize total travel distance or time while ensuring that all customers are served. CVRP finds applications in various industries su",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc4",
        name : "CVRP",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0744', name : 'CVRP instance'}],
        style : 0,
        type : 0,
        validator: null
    }
];

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
        render(
            <BrowserRouter>
                <HomePage />
            </BrowserRouter>
        );

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

        render(
            // Wrap it in BrowserRouter to allow for navigation
            <BrowserRouter>
                <HomePage/>
            </BrowserRouter>
        );

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

        render(
            // Wrap it in BrowserRouter to allow for navigation
            <BrowserRouter>
                <HomePage/>
            </BrowserRouter>
        );

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

        render(
            // Wrap it in BrowserRouter to allow for navigation
            <BrowserRouter>
                <HomePage/>
            </BrowserRouter>
        );

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