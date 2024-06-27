import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { expect, it } from 'vitest';
import ProblemOccurrenceProblemInstanceList from './ProblemOccurrenceProblemInstanceList';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence instance list', () => {    
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
    
    it("should display 'No entries found' if no data is given", async () => {
        //transform the mock data to not have any problem instances
        let noProblemInstancesMockProblemDataLeaderboard = structuredClone(mockProblemDataLeaderboard);
        noProblemInstancesMockProblemDataLeaderboard.benchmark_instances = [];
        
        // Render the AggregateLeaderBoard component wrapped in BrowserRouter
        renderWithRouter(true, () => (
            <ProblemOccurrenceProblemInstanceList 
                problemData={noProblemInstancesMockProblemDataLeaderboard}
                leaderboardData={[]}
            />)
        );

        // Wait for the useEffect and fetchData to complete
        await waitFor(async () => {
            // Check whether the correct text is displayed
            expect(screen.getAllByText('No entries found')[0]).toBeVisible(); //the getallby[0] is because the instanceleaderboard also displays 'no entries found'
        });
    });
    
    it('succesfull render', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceProblemInstanceList 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));
        
        // TODO: when the intance names are merged into main, change this test to name instead of id
        for (let instance of mockProblemDataLeaderboard.benchmark_instances) {
            expect(screen.getByText(instance.id)).toBeVisible();
        }
    });
    
    it('row folds open', async () => {
        
        
        renderWithRouter(true, () => (
            <ProblemOccurrenceProblemInstanceList 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));
        
        await waitFor(async () => {
            const row = screen.getByText(mockProblemDataLeaderboard.benchmark_instances[0].id).closest("td").closest("tr");
            const hiddenLeaderboard = screen.getAllByText("The score")[0].closest("table").closest("div").closest("td").closest("tr");
            
            //the instance leaderboard should be collapsed before clicking the row
            expect(hiddenLeaderboard).not.toBeVisible();
            
            await userEvent.click(row);
            expect(hiddenLeaderboard).toBeVisible();
        });
    });

}); 