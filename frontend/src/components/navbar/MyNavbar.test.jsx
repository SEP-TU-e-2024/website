import { screen, fireEvent, waitFor } from '@testing-library/react';
import MyNavbar from './MyNavbar';
import { renderWithRouter } from '../testing_utils/TestingUtils';

describe('MyNavbar', () => {
    it('renders the navbar', () => {
        renderWithRouter(false, MyNavbar);

        // Check whether the navbar is rendered by checking whether the logo (which is included in the navbar) is there
        expect(screen.getByAltText('logo')).toBeInTheDocument();
    });

    it('toggles the collapse on clicking the toggler', async () => {
        renderWithRouter(false, MyNavbar);

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
        renderWithRouter(false, MyNavbar);

        // Check whether a guest gets to see login and registration buttons
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Registration')).toBeInTheDocument();
        expect(screen.queryByText('Logout')).not.toBeInTheDocument();
    });

    it('renders logout link for members', () => {
        renderWithRouter(true, MyNavbar);

        // Check whether a member gets to see logout button instead of login button
        expect(screen.getByText('Logout')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
        expect(screen.queryByText('Registration')).not.toBeInTheDocument();
    });
});