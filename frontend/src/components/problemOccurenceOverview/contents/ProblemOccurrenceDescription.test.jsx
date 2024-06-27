import React from 'react';
import { screen} from '@testing-library/react';
import { expect } from 'vitest';
import ProblemOccurrenceDescription from './ProblemOccurrenceDescription';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence overview description', () => {    

    it('succesfull render', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceDescription 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));

        expect(screen.getByText(mockProblemDataLeaderboard.category.description, {exact:false})).toBeInTheDocument();
    });

});