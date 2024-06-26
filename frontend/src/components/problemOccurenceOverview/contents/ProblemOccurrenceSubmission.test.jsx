import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import ProblemOccurrenceSubmission from './ProblemOccurrenceSubmission';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence overview description', () => {    

    it('succesfull render with example', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceSubmission 
                problemData={mockProblemDataLeaderboard}
            />
        ));

        expect(screen.getByText("Example Submission")).toBeInTheDocument();
    });

    it('succesfull render without example', async () => {
        mockProblemDataLeaderboard.category.example_submission_url = null;

        renderWithRouter(true, () => (
            <ProblemOccurrenceSubmission 
                problemData={mockProblemDataLeaderboard}
            />
        ));

        expect(screen.queryByText("Example Submission")).not.toBeInTheDocument();
    });

}); 