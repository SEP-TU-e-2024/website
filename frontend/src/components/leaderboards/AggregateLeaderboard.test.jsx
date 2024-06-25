import { afterEach, beforeEach, describe, expect, vi } from "vitest";
import { screen, waitFor, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockLeaderboardData, mockColumns, mockProblemDataLeaderboard, renderWithRouter, mockInstanceColumns, mockBlobResponse } from "../testing_utils/TestingUtils";
import AggregateLeaderboard from "./AggregateLeaderboard";
import api from "../../api";
import { InstanceRow, createInstanceColumns, LeaderboardRow } from "./AggregateLeaderboard"

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
        // Render the AggregateLeaderBoard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <AggregateLeaderboard 
                problemData={[]}
                leaderboardData={mockLeaderboardData}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText('Error: no column names found')).toBeInTheDocument();
        });
    });

    it("should display 'No entries found' if no data is given", async () => {
        // Render the AggregateLeaderBoard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <AggregateLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={[]}
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
        // Render the AggregateLeaderBoard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <AggregateLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
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

    // Leaderboard Row test
    it("leaderboard row test with unfold", async () => {

        // Render the LeaderboardRow component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <LeaderboardRow 
                columns={mockColumns()}
                entry={mockLeaderboardData[0]}
                problemData={mockProblemDataLeaderboard}
                parentPrefix={"test"}
            />
        ));

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            const johndoe = screen.getByText('John Doe');
            expect(johndoe).toBeInTheDocument();
            expect(screen.getByText('example submission one')).toBeInTheDocument();
            expect(screen.getByText('2024-06-19')).toBeInTheDocument();

            
            const row = johndoe.closest("tr")
            expect(row).not.toBeNull();

            const hiddenRow = screen.getByText("The score").closest("td").closest("tr")
            expect(hiddenRow).toHaveClass('fold-closed');

            await userEvent.click(row);
            expect(hiddenRow).toHaveClass('fold-open');
        });
    });

    // Leaderboard Row test
    it("leaderboard row test with unfold competition type", async () => {

        mockProblemDataLeaderboard.category.style = 0;

        // Render the LeaderboardRow component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <LeaderboardRow 
                columns={mockColumns()}
                entry={mockLeaderboardData[0]}
                problemData={mockProblemDataLeaderboard}
                parentPrefix={"test"}
            />
        ));

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {

            // Check whether clicking row does not unfold
            const johndoe = screen.getByText('John Doe');
            const row = johndoe.closest("tr")
            expect(row).not.toBeNull();
            await userEvent.click(row);

            // Test folded content for visibility
            expect(screen.queryByText('The score')).not.toBeInTheDocument();
            expect(screen.queryByText('The score part 2')).not.toBeInTheDocument();

        });
    });

    // Leaderboard Row test
    it("leaderboard row test no problem", async () => {

        // Render the InstanceRow component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <LeaderboardRow 
                columns={mockColumns()}
                entry={mockLeaderboardData[0]}
                problemData={{}}
                parentPrefix={"test"}
            />
        ));

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getByText("Error: no column names found")).toBeInTheDocument();
        });
    });

    // Instance Row test
    it("instance row test", async () => {

        // Render the InstanceRow component wrapped in BrowserRouter
        render(
            <InstanceRow 
                columns={mockInstanceColumns(mockProblemDataLeaderboard)}
                entry={mockLeaderboardData[0].instance_entries[0]}
            />
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.queryByText('0')).toBeInTheDocument();
            expect(screen.queryByText('1')).toBeInTheDocument();
        });
    });

    // createInstanceRows test good case
    it("createInstanceRows good test", async () => {

        let columns = createInstanceColumns(mockProblemDataLeaderboard)  
        expect(columns).toHaveLength(2);
        expect(columns.some(col => col.name === 'The score')).toBe(true);
        expect(columns.some(col => col.name === 'The score part 2')).toBe(true);
    });

    // createInstanceRows test bas case
    it("createInstanceRows bad test", async () => {

        let columns = createInstanceColumns({})
        expect(columns).toHaveLength(0);
    });

    // Might not be testable because of file download
    // TODO: Remove if we can not mock the resposne
    describe('downloadBlob function', () => {
        it('should trigger download with correct blob URL', () => {
            // Call the function
            // downloadBlob(mockBlobResponse);
        });
    });

    describe('Download Handler Error test suite', () => {
        const renderLeaderboard = () => renderWithRouter(true, () => (
            <AggregateLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));
        
        const apiSpy = (statusCode) => {
            const spy = vi.spyOn(api, 'get').mockRejectedValue({
                response: {
                    status: statusCode,
                }
            });
            return spy
        }        
        
        it('Error 401', async () => {
            // Render component
            renderLeaderboard()

            await waitFor(async () => {
                const spy = apiSpy(401)

                // Find download button and click
                let buttons = screen.getAllByRole('button')
                await userEvent.click(buttons[0]);

                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Unauthorized to access this content")).toBeInTheDocument();
            });
        });
    
        it('Error 403', async () => {
            // Render component
            renderLeaderboard()

            await waitFor(async () => {
                const spy = apiSpy(403)

                // Find download button and click
                let buttons = screen.getAllByRole('button')
                await userEvent.click(buttons[0]);

                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("File not downloadable")).toBeInTheDocument();
            });
        });

        it('Error 404', async () => {
            // Render component
            renderLeaderboard()

            await waitFor(async () => {
                const spy = apiSpy(404)

                // Find download button and click
                let buttons = screen.getAllByRole('button')
                await userEvent.click(buttons[0]);

                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("File not found")).toBeInTheDocument();
            });
        });

        it('Error 500', async () => {
            // Render component
            renderLeaderboard()

            await waitFor(async () => {
                const spy = apiSpy(500)

                // Find download button and click
                let buttons = screen.getAllByRole('button')
                await userEvent.click(buttons[0]);
                await userEvent.click(buttons[0]);

                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Something went wrong on the server")).toBeInTheDocument();
            });
        });
    });

});