import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import { mockLeaderboardData, mockColumns, mockProblemDataLeaderboard, renderWithRouter } from "../testing_utils/TestingUtils";
import InstanceLeaderboard from "./InstanceLeaderboard";
import { LeaderboardRow, rankInstanceEntries } from "./InstanceLeaderboard";

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
        // Render the InstanceLeaderboard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <InstanceLeaderboard 
                problemData={[]}
                leaderboardData={mockLeaderboardData}
                instance={0}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('Error: no column names found')).toBeInTheDocument();
        });
    });

    it("should display 'No entries found' if no data is given", async () => {
        // Render the InstanceLeaderboard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <InstanceLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={[]}
                instance={0}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('No entries found')).toBeInTheDocument();
        });
    });

    // Simple good case
    it("should display mock entries and columns", async () => {
        // Render the InstanceLeaderboard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <InstanceLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
                instance={0}
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
            expect(screen.getByText('Anonymous user')).toBeInTheDocument();
            expect(screen.getByText('example submission one')).toBeInTheDocument();
            expect(screen.getByText('example submission two')).toBeInTheDocument();
            expect(screen.getByText('example submission three')).toBeInTheDocument();
        });
    });

    // Conditional render test
    it("Leaderboard shows result for instance 0", async () => {
        // Render the InstanceLeaderboard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <InstanceLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
                instance={0}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('14')).toBeInTheDocument();
            expect(screen.queryByText('13')).not.toBeInTheDocument();
        });
    });

    // Conditional render test
    it("Leaderboard shows result for instance 1", async () => {
        // Render the InstanceLeaderboard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <InstanceLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
                instance={1}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('13')).toBeInTheDocument();
            expect(screen.queryByText('14')).not.toBeInTheDocument();
        });
    });

    // Row test
    it("row test", async () => {
        // Render the LeaderboardRow component 
        render(
            <LeaderboardRow 
                columns={mockColumns()}
                entry={mockLeaderboardData[0]}
            />
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.queryByText('John Doe')).toBeInTheDocument();
            expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
        });
    });
});

describe('Sorting', () => {
    it("Sorting from high to low", async () => {

        rankInstanceEntries(mockProblemDataLeaderboard, mockLeaderboardData, 0);
        expect(mockLeaderboardData[0].instance_entries[0].rank).toBe(1); // Highest score
        expect(mockLeaderboardData[1].instance_entries[0].rank).toBe(2); // Second highest score
        expect(mockLeaderboardData[2].instance_entries[0].rank).toBe(3); // Lowest score entry
    });

    it("Sorting from low to high", async () => {
        const dataCopy = [...mockLeaderboardData]
        mockProblemDataLeaderboard.scoring_metric["order"] = 0;
        rankInstanceEntries(mockProblemDataLeaderboard, mockLeaderboardData, 0);

        expect(dataCopy[0].instance_entries[0].rank).toBe(4); // Highest score
        expect(dataCopy[1].instance_entries[0].rank).toBe(3); // Second highest score
        expect(dataCopy[2].instance_entries[0].rank).toBe(2); // Low entry
        expect(dataCopy[3].instance_entries[0].rank).toBe(1); // Lowest entry
    });

    it("Sorting with misformatted data", async () => {
        rankInstanceEntries(mockProblemDataLeaderboard, mockLeaderboardData, 1);
        expect(mockLeaderboardData[0].instance_entries[1].rank).toBe(1); // Highest score
        expect(mockLeaderboardData[1].instance_entries[1].rank).toBe(2); // Second highest score
        expect(mockLeaderboardData[2].instance_entries[1].rank).toBe(0); // No score entry
    });
});