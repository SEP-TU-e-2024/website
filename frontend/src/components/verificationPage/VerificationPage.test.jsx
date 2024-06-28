import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import VerificationPage from './VerificationPage';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../testing_utils/TestingUtils';


describe('Problem occurrence instance list', () => {    

    it('succesfull render', async () => {
        renderWithRouter(true, VerificationPage);

        // TODO: Chance visibility requirement
        expect(screen.getByText("Verify your email address")).toBeInTheDocument();
        expect(screen.getByText("Click to verify")).toHaveAttribute('href', "http://127.0.0.1:8000/api/auth/activate/localhost:3000/");
    });

}); 