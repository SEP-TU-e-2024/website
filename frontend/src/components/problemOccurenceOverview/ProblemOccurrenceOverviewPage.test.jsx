import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { expect, vi } from 'vitest';
import api from '../../api';
import { useLoaderData } from 'react-router-dom';
import ProblemOccurrenceOverviewPage from './ProblemOccurrenceOverviewPage';
import { getPOInfo } from './ProblemOccurrenceOverviewPage'
import { AlertProvider } from '../../context/AlertContext';
import { renderWithAlertProvider, mockProblemDataLeaderboard, mockLeaderboardData } from '../testing_utils/TestingUtils';


vi.mock('react-router-dom', () => ({
useLoaderData: vi.fn(),
}));

vi.mock('./contents/ProblemOccurrenceDescription', () => ({
__esModule: true,
default: vi.fn(() => <div>Mock Description</div>),
}));

vi.mock('./contents/ProblemOccurrenceLeaderboard', () => ({
__esModule: true,
default: vi.fn(() => <div>Mock Leaderboard</div>),
}));

vi.mock('./contents/ProblemOccurrenceSubmission', () => ({
__esModule: true,
default: vi.fn(() => <div>Mock Submission</div>),
}));

vi.mock('./contents/ProblemOccurrenceProblemInstanceList', () => ({
__esModule: true,
default: vi.fn(() => <div>Mock Problem Instances</div>),
}));

describe('ProblemOccurrenceOverviewPage', () => {
    beforeEach(() => {
        useLoaderData.mockReturnValue(mockProblemDataLeaderboard);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders the component with problem data', async () => {
        // Mock API call for leaderboard data
        const apiSpy = vi.spyOn(api, 'get').mockResolvedValue({
            status: 200,
            data: {
                entries: mockLeaderboardData
            }        
        });

        // Render the page
        renderWithAlertProvider(ProblemOccurrenceOverviewPage);
        
        await waitFor(async () => {
            // Check whether all expected elements are in the page
            expect(screen.getByText('MyTestSpecProb')).toBeInTheDocument();
            expect(screen.getByText('Overview')).toBeInTheDocument();
            expect(screen.getByText('Leaderboard')).toBeInTheDocument();
            expect(screen.getByText('Submission')).toBeInTheDocument();
            expect(screen.getByText('Problem instances')).toBeInTheDocument();

            // Check if api call is executed
            expect(apiSpy).toBeCalled();
        })
    });

    it('switches tabs correctly', async () => {
        renderWithAlertProvider(ProblemOccurrenceOverviewPage);

        const overviewTab = screen.getByText('Overview');
        const leaderboardTab = screen.getByText('Leaderboard');
        const submissionTab = screen.getByText('Submission');
        const problemInstancesTab = screen.getByText('Problem instances');
        
        await waitFor(async () => {
            // LeaderboardTab should not be active if it's not selected
            expect(leaderboardTab).not.toHaveClass('active');
            // Simulate click leaderboardTab
            fireEvent.click(leaderboardTab);
            // LeaderboardTab should be the only tab active after it's selected
            expect(overviewTab).not.toHaveClass('active');
            expect(leaderboardTab).toHaveClass('active');
            expect(submissionTab).not.toHaveClass('active');
            expect(problemInstancesTab).not.toHaveClass('active');

            // OverviewTab should not be active if it's not selected
            expect(overviewTab).not.toHaveClass('active');
            // Simulate click overviewTab
            fireEvent.click(overviewTab);
            // OverviewTab should be the only tab active after it's selected
            expect(overviewTab).toHaveClass('active');
            expect(leaderboardTab).not.toHaveClass('active');
            expect(submissionTab).not.toHaveClass('active');
            expect(problemInstancesTab).not.toHaveClass('active');

            // SubmissionTab should not be active if it's not selected
            expect(submissionTab).not.toHaveClass('active');
            // Simulate click submissionTab
            fireEvent.click(submissionTab);
            // SubmissionTab should be the only tab active after it's selected
            expect(overviewTab).not.toHaveClass('active');
            expect(leaderboardTab).not.toHaveClass('active');
            expect(submissionTab).toHaveClass('active');
            expect(problemInstancesTab).not.toHaveClass('active');

            // ProblemInstancesTab should not be active if it's not selected
            expect(problemInstancesTab).not.toHaveClass('active');
            // Simulate click problemInstancesTab
            fireEvent.click(problemInstancesTab);
            // ProblemInstancesTab should be the only tab active after it's selected
            expect(overviewTab).not.toHaveClass('active');
            expect(leaderboardTab).not.toHaveClass('active');
            expect(submissionTab).not.toHaveClass('active');
            expect(problemInstancesTab).toHaveClass('active');
        })
    });

    it('hides problem instances tab for competition type problem', () => {
        // Chance style of problem
        mockProblemDataLeaderboard.category.style = 0;

        // Mock the useLoaderData function to return null
        useLoaderData.mockReturnValue(null);
        renderWithAlertProvider(ProblemOccurrenceOverviewPage);

        // Check if text is shown
        expect(screen.queryByText('Problem instances')).not.toBeInTheDocument();
    });

    it('throws an error when problem data is null', () => {
        // Mock the useLoaderData function to return null
        useLoaderData.mockReturnValue(null);
        renderWithAlertProvider(ProblemOccurrenceOverviewPage);
        // Check if error is thrown
        expect(() => {
            screen.getByText('Problem with fetching the requested data from db').toBeInTheDocument();
        })
    });

    it('throws an error when problem data is null', () => {
        // Mock the useLoaderData function to return null
        useLoaderData.mockReturnValue(null);
        renderWithAlertProvider(ProblemOccurrenceOverviewPage);
        // Check if error is thrown
        expect(() => {
            screen.getByText('Problem with fetching the requested data from db').toBeInTheDocument();
        })
    });

    describe('Leaderboard data handler error test suite', () => {    
        const apiSpy = (statusCode) => {
            const spy = vi.spyOn(api, 'get').mockRejectedValue({
                response: {
                    status: statusCode,
                }
            });
            return spy
        }        
        
        it('Error 401', async () => {
            // Mock API to throw error
            const spy = apiSpy(401)

            // Render component
            renderWithAlertProvider(ProblemOccurrenceOverviewPage);

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Unauthorized to access this content")).toBeInTheDocument();
            });
        });

        it('Error 404', async () => {
            // Mock API to throw error
            const spy = apiSpy(404)

            // Render component
            renderWithAlertProvider(ProblemOccurrenceOverviewPage);

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Problem not found")).toBeInTheDocument();
            });
        });

        it('Error 500', async () => {
            // Mock API to throw error
            const spy = apiSpy(500)

            // Render component
            renderWithAlertProvider(ProblemOccurrenceOverviewPage);

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Something went wrong on the server")).toBeInTheDocument();
            });
        });
    });
});

describe('getPOInfo error test suite', () => {    
    // Mock alert
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    it('returns data when API call is successful', async () => {
        const apiSpy = vi.spyOn(api, 'get').mockResolvedValue({
            status: 200,
            data: "Problem Data"
        });

        const result = await getPOInfo(1);

        expect(apiSpy).toBeCalled();
        expect(result).toEqual("Problem Data");
        expect(alertSpy).not.toHaveBeenCalled();
    });
     
    it('alerts unauthorized when API returns 401', async () => {
        const apiSpy = vi.spyOn(api, 'get').mockRejectedValue({
            response: {
                status: 401,
            }
        });

        const result = await getPOInfo(1);

        expect(apiSpy).toBeCalled();
        expect(result).toBeUndefined();
        expect(alertSpy).toHaveBeenCalledWith("Unauthorized to access this content", "error");
    });

    it('alerts not found when API returns 404', async () => {
        const apiSpy = vi.spyOn(api, 'get').mockRejectedValue({
            response: {
                status: 404,
            }
        });

        const result = await getPOInfo(1);

        expect(apiSpy).toBeCalled();
        expect(result).toBeUndefined();
        expect(alertSpy).toHaveBeenCalledWith("No problem categories not found", "error");
    });

    it('alerts server error when API returns 500', async () => {
        const apiSpy = vi.spyOn(api, 'get').mockRejectedValue({
            response: {
                status: 500,
            }
        });

        const result = await getPOInfo(1);

        expect(apiSpy).toBeCalled();
        expect(result).toBeUndefined();
        expect(alertSpy).toHaveBeenCalledWith("Something went wrong on the server", "error");
    });
});