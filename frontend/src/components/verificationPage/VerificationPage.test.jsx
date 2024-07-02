import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import VerificationPage from './VerificationPage';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../testing_utils/TestingUtils';


describe('Problem occurrence instance list', () => {    

    it('succesfull render', async () => {
        renderWithRouter(true, VerificationPage);
        
        const backendURL = import.meta.env.VITE_API_URL

        // TODO: Chance visibility requirement
        expect(screen.getByText("Verify your email address")).toBeInTheDocument();
        expect(screen.getByText("Click to verify")).toHaveAttribute('href', backendURL + "/auth/activate/localhost:3000/");
    });

}); 