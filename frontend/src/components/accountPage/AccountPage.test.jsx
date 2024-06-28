import { screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';
import AccountPage from './AccountPage'
import userEvent from "@testing-library/user-event";
import { renderWithRouter, mockAccountData, mockAccountSubmissionData } from '../testing_utils/TestingUtils';
import api from "../../api";

describe('Account page', () => {    

    it('succesfull render', async () => {
        const spy = vi.spyOn(api, 'get')
        .mockResolvedValueOnce({
            data: mockAccountData
        })
        .mockResolvedValueOnce({
            data: mockAccountSubmissionData
        });

        // Render component
        renderWithRouter(true, AccountPage);

        await waitFor(async () => {
            // Check for expected sections
            expect(screen.getByText("My profile")).toBeInTheDocument();
            expect(screen.getByText("Submissions")).toBeInTheDocument();
            expect(screen.getByText("admin@email.com")).toBeInTheDocument();
            expect(screen.getByText("Example time slotting submission")).toBeInTheDocument();
            expect(screen.getByText("Example traveling salesman submission")).toBeInTheDocument();

            expect(spy).toBeCalled();

            // Check navigation to problem
            const td = screen.getByText("Example traveling salesman submission");
            expect(td).not.toBeNull();
            const row = td.closest("tr")
            expect(row).not.toBeNull();
            expect(window.location.pathname).not.toContain("/problemoccurrence/343da3bd-d33d-4e6f-a0fc-2c5361918faf");
            await userEvent.click(row);
            expect(window.location.pathname).toContain("/problemoccurrence/343da3bd-d33d-4e6f-a0fc-2c5361918faf");
        })
    });

    it('missing email', async () => {
        const spy = vi.spyOn(api, 'get')
        .mockResolvedValueOnce({
            data: {}
        })
        .mockResolvedValueOnce({
            data: mockAccountSubmissionData
        });

        // Render component
        renderWithRouter(true, AccountPage);

        await waitFor(async () => {
            // Check for expected sections
            expect(screen.getByText("Unknown email")).toBeInTheDocument();
            expect(spy).toBeCalled();
        })
    });


    describe('API Error test suite', () => {
        const apiSpy = (statusCode) => {
            const spy = vi.spyOn(api, 'get').mockRejectedValue({
                response: {
                    status: statusCode,
                }
            });
            return spy
        }        
        
        it('Error 401', async () => {
            // Render component
            const spy = apiSpy(401)
            renderWithRouter(true, AccountPage)

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Unauthorized to access this content")).toBeInTheDocument();
            });
        });
    
        it('Error 404', async () => {
            // Render component
            const spy = apiSpy(404)
            renderWithRouter(true, AccountPage)

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Account data not found")).toBeInTheDocument();
            });
        });

        it('Error 500', async () => {
            // Render component
            const spy = apiSpy(500)
            renderWithRouter(true, AccountPage)

            await waitFor(async () => {
                // Check for error message
                expect(spy).toBeCalled();
                expect(screen.getByText("Something went wrong on the server")).toBeInTheDocument();
            });
        });
    });
});