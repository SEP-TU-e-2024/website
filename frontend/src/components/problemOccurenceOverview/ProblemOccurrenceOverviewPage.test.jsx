import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { useLoaderData } from 'react-router-dom';
import ProblemOccurrenceOverviewPage from './ProblemOccurrenceOverviewPage';
import ProblemOccurrenceDescription from './contents/ProblemOccurrenceDescription';
import ProblemOccurrenceLeaderboard from './contents/ProblemOccurrenceLeaderboard';
import ProblemOccurrenceSubmission from './contents/ProblemOccurrenceSubmission';
import ProblemOccurrenceProblemInstanceList from './contents/ProblemOccurrenceProblemInstanceList';

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
    useLoaderData.mockReturnValue({
    problem_name: 'Sample Problem',
    name: 'Sample Problem Occurrence',
    evaluation_settings: {
        time_limit: 60,
        cpu: 4,
    },
    });
});

afterEach(() => {
    vi.clearAllMocks();
});

it('renders the component with problem data', () => {
    // Render the page
    render(<ProblemOccurrenceOverviewPage />);
    
    // Check whether all expected elements are in the page
    expect(screen.getByText('Sample Problem')).toBeInTheDocument();
    expect(screen.getByText('Sample Problem Occurrence : 60 second, 4 CPU variation')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Leaderboard')).toBeInTheDocument();
    expect(screen.getByText('Submission')).toBeInTheDocument();
    expect(screen.getByText('Problem instances')).toBeInTheDocument();
});

it('switches tabs correctly', () => {
    render(<ProblemOccurrenceOverviewPage />);
    const overviewTab = screen.getByText('Overview');
    const leaderboardTab = screen.getByText('Leaderboard');
    const submissionTab = screen.getByText('Submission');
    const problemInstancesTab = screen.getByText('Problem instances');

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
    expect(problemInstancesTab).toHaveClass('active');});

it('throws an error when problem data is null', () => {
    // Mock the useLoaderData function to return null
    useLoaderData.mockReturnValue(null);

    // Check if error is thrown
    expect(() => render(<ProblemOccurrenceOverviewPage />)).toThrow('Problem with fetching the requested data from db');
});
});