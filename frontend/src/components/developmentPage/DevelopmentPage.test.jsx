import { screen} from '@testing-library/react';
import { expect } from 'vitest';
import DevelopmentPage from './DevelopmentPage';
import { renderWithRouter } from '../testing_utils/TestingUtils';


describe('Development page', () => {    

    it('succesfull render', async () => {
        // Render component
        renderWithRouter(true, DevelopmentPage);

        // Check for expected sections
        expect(screen.getByText("In development")).toBeInTheDocument();
        expect(screen.getByText("This is a feature that is still being worked on")).toBeInTheDocument();
    });

});