import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import ProblemOccurrenceSubmission from './ProblemOccurrenceSubmission';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence submission', () => {    

    it('submission form with example submission link', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceSubmission 
                problemData={mockProblemDataLeaderboard}
            />
        ));

        const submissionLink = screen.getByText("Example Submission");
        expect(submissionLink).toBeInTheDocument();
        expect(submissionLink).toHaveAttribute('href', 'www.google.com');
    });

    it('submission form without example submission link', async () => {
        mockProblemDataLeaderboard.category.example_submission_url = null;

        renderWithRouter(true, () => (
            <ProblemOccurrenceSubmission 
                problemData={mockProblemDataLeaderboard}
            />
        ));

        expect(screen.queryByText("Example Submission")).not.toBeInTheDocument();
    });
}); 