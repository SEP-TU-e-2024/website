import { screen, waitFor, render } from '@testing-library/react';
import { expect, vi } from 'vitest';

import ErrorPage from './ErrorPage';
import { renderWithRouter } from '../testing_utils/TestingUtils';
import { BrowserRouter, useRouteError } from 'react-router-dom';

// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useRouteError: vi.fn()
    };
});

describe('About page', () => {    

    it('succesfull render with status text', async () => {
        // Mocking of hook
        const mockStatusText = 404;
        const { useRouteError } = await import('react-router-dom');
        useRouteError.mockReturnValue({
            statusText: mockStatusText,
        });

        // Render component
        renderWithRouter(true, ErrorPage);
        
        // Check expected output
        await waitFor(async () => {
            expect(screen.getByText("Oops")).toBeInTheDocument();
            expect(screen.getByText("Sorry, an unexpected error occured")).toBeInTheDocument();
            expect(screen.getByText(404)).toBeInTheDocument();
        })
    });

    it('succesfull renderwith error message', async () => {
        // Mocking of hook
        const mockMessage = "Generic error message";
        const { useRouteError } = await import('react-router-dom');
        useRouteError.mockReturnValue({
            message: mockMessage,
        });

        // Render component
        renderWithRouter(true, ErrorPage);
        
        await waitFor(async () => {
            expect(screen.getByText("Oops")).toBeInTheDocument();
            expect(screen.getByText("Sorry, an unexpected error occured")).toBeInTheDocument();
            expect(screen.getByText("Generic error message")).toBeInTheDocument();
        })
    });
});