import React from 'react';
import { screen} from '@testing-library/react';
import { expect } from 'vitest';
import ProblemOccurrenceLeaderboard from './ProblemOccurrenceLeaderboard';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence leaderboard', () => {    

    it('succesfull render', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceLeaderboard 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));

        expect(screen.getByText("Submission name", {exact:false})).toBeInTheDocument();
    });

});