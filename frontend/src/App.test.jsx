import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { router } from './App';
import { getPOInfo } from './components/problemOccurenceOverview/ProblemOccurrenceOverviewPage';

// Mock the components and loader functions used in the router
vi.mock('./components/errorPage/ErrorPage', () => ({ default: () => <div>ErrorPage</div> }));
vi.mock('./components/routing/AuthLayout', () => ({ default: ({ children }) => <div>AuthLayout {children}</div> }));
vi.mock('./components/routing/ProtectedLayout', () => ({ default: ({ children }) => <div>ProtectedLayout {children}</div> }));
vi.mock('./components/routing/UnprotectedLayout', () => ({ default: ({ children }) => <div>UnprotectedLayout {children}</div> }));
vi.mock('./components/problemOccurenceOverview/ProblemOccurrenceOverviewPage', () => ({
  __esModule: true,
  getPOInfo: vi.fn(),
  default: () => <div>ProblemOccurrenceOverviewPage</div>,
}));


describe('Router', () => {
  const renderWithRouter = (route) => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: [route],
    });
    render(<RouterProvider router={testRouter} />);
  };

  it('should render the error page on error', () => {
    const testRouter = createMemoryRouter(router.routes, {
      initialEntries: ['/non-existent-path'],
    });
    render(<RouterProvider router={testRouter} />);
    expect(screen.getByText('ErrorPage')).toBeInTheDocument();
  });

  it('should render the problem occurrence overview page for /problemoccurrence/:problem_occurence path', async () => {
    getPOInfo.mockResolvedValueOnce({ data: 'some data' }); // Mock the resolved value

    renderWithRouter('/problemoccurrence/some_problem');
    
    // Wait for the component to finish loading
    await waitFor(() => {
        expect(getPOInfo).toHaveBeenCalledWith('some_problem');
    });
  });
});
