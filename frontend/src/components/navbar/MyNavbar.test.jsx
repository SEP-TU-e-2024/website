import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AuthContext from '../../context/AuthContext';
import MyNavbar from './MyNavbar';
import { mockGuestContextData, mockMemberContextData } from '../testing_utils/TestingUtils';
import { AlertProvider } from "../../context/AlertContext";

function renderWithRouter(loggedIn) {
    if (loggedIn) {
        render(
            // Wrapped in BrowserRouter for navigation
            <BrowserRouter>
                <AlertProvider>
                    {/* Mocks the user data */}
                    <AuthContext.Provider value={mockMemberContextData}>
                        <MyNavbar/>
                    </AuthContext.Provider>
                </AlertProvider>
            </BrowserRouter>
        );
    } else {
        render(
            // Wrapped in BrowserRouter to facilitate navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <MyNavbar/>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }    
}

describe('MyNavbar', () => {
    it('renders the navbar', () => {
        renderWithRouter(false);

        // Check whether the navbar is rendered by checking whether the logo (which is included in the navbar) is there
        expect(screen.getByAltText('logo')).toBeInTheDocument();
    });

    it('toggles the collapse on clicking the toggler', async () => {
        renderWithRouter(false);

        // Click the navbar toggler
        const toggler = screen.getByTestId('toggler');
        fireEvent.click(toggler);
        // Wait for the changes to render
        await waitFor(() => {
            // Check whether the navbar is expanded
            expect(screen.getByTestId('collapse')).toHaveClass('collapse show');
        });

        // Click the navbar toggler again
        fireEvent.click(toggler);
        // Wait for the changes to render
        await waitFor(() => {
            // Check whether the navbar is collapsed
            expect(screen.getByTestId('collapse')).not.toHaveClass('collapse show');
        });
    });

    it('renders login and registration buttons for guests', () => {
        renderWithRouter(false);

        // Check whether a guest gets to see login and registration buttons
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Registration')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('renders logout link for members', () => {
        renderWithRouter(true);

        // Check whether a member gets to see logout button instead of login button
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
        expect(screen.queryByText('Registration')).not.toBeInTheDocument();
    });
});