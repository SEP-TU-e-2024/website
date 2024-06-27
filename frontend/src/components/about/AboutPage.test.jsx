import { screen} from '@testing-library/react';
import { expect } from 'vitest';
import Aboutpage from './AboutPage';
import { renderWithRouter } from '../testing_utils/TestingUtils';


describe('About page', () => {    

    it('succesfull render', async () => {
        // Render component
        renderWithRouter(true, Aboutpage);

        // Check for expected sections
        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Evaluation Environment")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();
    });

});