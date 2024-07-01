import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { useAlert } from './AlertContext';
import { renderWithAlertProvider } from '../components/testing_utils/TestingUtils';

// Helper component to trigger the alert
const TestComponent = () => {
    const { showAlert } = useAlert();
    return (
        <button onClick={() => showAlert('Test Message', 'error')}>Show Alert</button>
    );
};

describe('AlertProvider', () => {
    it('should display the alert when showAlert is called', () => {
        renderWithAlertProvider(TestComponent);

        // Press the button to show an alert
        fireEvent.click(screen.getByText('Show Alert'));

        // Check if the alert is shown
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('should hide the alert when the close button is clicked', () => {
        renderWithAlertProvider(TestComponent);

        // Press the button to trigger the alert
        fireEvent.click(screen.getByText('Show Alert'));
        expect(screen.getByText('Test Message')).toBeInTheDocument();

        // Close the alert
        fireEvent.click(screen.getByLabelText("Close"));

        // Check if the alert is no longer shown
        expect(screen.queryByText('Test Message')).not.toBeInTheDocument();
    });
});
