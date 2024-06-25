import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { mockLeaderboardData, mockColumns, mockProblemData, mockLeaderboardRow, renderWithRouter } from "../testing_utils/TestingUtils";
import Leaderboard from "./Leaderboard";

describe("Leaderboard", () => {
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

    it("should display 'Error: no column names found' if no data is given", async () => {
        // Render the HomePage component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <Leaderboard 
                problemData={mockProblemData}
                columns={[]}
                leaderboardData={mockLeaderboardData}
                LeaderboardRow={mockLeaderboardRow}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('Error: no column names found')).toBeInTheDocument();
        });
    });

    it("should display 'No entries found' if no data is given", async () => {
        // Render the HomePage component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <Leaderboard 
                problemData={mockProblemData}
                columns={mockColumns()}
                leaderboardData={[]}
                LeaderboardRow={mockLeaderboardRow}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('No entries found')).toBeInTheDocument();
        });
    });

    it("should display mock entries and columns", async () => {
        // Render the HomePage component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <Leaderboard 
                problemData={mockProblemData}
                columns={mockColumns()}
                leaderboardData={mockLeaderboardData}
                LeaderboardRow={mockLeaderboardRow}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('Submitted by')).toBeInTheDocument();
            expect(screen.getByText('Submission name')).toBeInTheDocument();
            expect(screen.getByText('Submission date')).toBeInTheDocument();

            // Dynamic data
            const janeSmithInstances = screen.getAllByText('Jane Smith');
            expect(janeSmithInstances).toHaveLength(2);
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('example submission one')).toBeInTheDocument();
            expect(screen.getByText('example submission two')).toBeInTheDocument();
            expect(screen.getByText('example submission three')).toBeInTheDocument();
        });
    });
});