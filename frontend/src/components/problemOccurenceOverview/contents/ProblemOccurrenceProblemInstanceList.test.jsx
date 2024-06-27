import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { expect } from 'vitest';
import ProblemOccurrenceProblemInstanceList from './ProblemOccurrenceProblemInstanceList';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../../testing_utils/TestingUtils';


describe('Problem occurrence instance list', () => {    

    it('succesfull render', async () => {
        renderWithRouter(true, () => (
            <ProblemOccurrenceProblemInstanceList 
                problemData={mockProblemDataLeaderboard}
                leaderboardData={mockLeaderboardData}
            />
        ));

        // TODO: Chance visibility requirement
        expect(screen.getByText(mockProblemDataLeaderboard.benchmark_instances[0].id)).toBeVisible();
        // expect(screen.queryByText(mockProblemDataLeaderboard.benchmark_instances[1].id)).not.toBeVisible();

        // Simulate changing the select value
        fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
        expect(screen.getByText(mockProblemDataLeaderboard.benchmark_instances[1].id)).toBeVisible();
        // expect(screen.queryByText(mockProblemDataLeaderboard.benchmark_instances[0].id)).not.toBeVisible();
    });

}); 