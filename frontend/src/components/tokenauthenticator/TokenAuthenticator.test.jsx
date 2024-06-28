import { render, screen, waitFor } from '@testing-library/react';
import { expect, vi } from 'vitest';
import TokenAuthenticator from './TokenAuthenticator';
import { renderWithRouter, mockMemberContextData } from '../testing_utils/TestingUtils';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { AlertProvider } from '../../context/AlertContext';
import HomePage from '../homepage/HomePage';
import LoginForm from '../forms/LoginForm';
import RegisterForm from '../forms/RegisterForm';

const mockTokens = {
    refresh:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxOTQ4MjUzNSwiaWF0IjoxNzE5NDc4OTM1LCJqdGkiOiJiM2VlNTlmZGI0YmM0Mjc3OTM2NzVhZmE5NjU3NmM2MyIsInVzZXJfaWQiOiI5YTI2MzZlMC05ODRmLTRlNzktYmM5ZS0xM2E2MjhmM2NmN2IifQ._F6MKVNtMyIMSbQMJOWRLL48zB2Xk811BwIG4oJcs8w",
    access:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5NDc5MjM1LCJpYXQiOjE3MTk0Nzg5MzUsImp0aSI6ImE2MTVmMWU5MzY0NjRmMTZiYjAyNmJiNjk1YmIyZDQzIiwidXNlcl9pZCI6IjlhMjYzNmUwLTk4NGYtNGU3OS1iYzllLTEzYTYyOGYzY2Y3YiJ9.7WvFx_znI0Rylu9y3DzPHBYTYrVpRUs7xevgFcx2Y70"
}

// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        Navigate: vi.fn()
    };
});

describe('TokenAuthenticator', () => {

    it('redirects with tokens', async () => {
        render(
            <AuthContext.Provider value={mockMemberContextData}>
                <AlertProvider>
                    <MemoryRouter initialEntries={[`/tokens/?refresh_token=${mockTokens.refresh}&access_token=${mockTokens.access}`]}>
                        <Routes>
                            <Route path="/tokens/*" element={<TokenAuthenticator />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/login" element={<LoginForm />} />
                        </Routes>
                    </MemoryRouter>
                </AlertProvider>
            </AuthContext.Provider>
        )

        const { Navigate } = await import('react-router-dom');

        await waitFor(() => {
            // Check for element on home page
            expect(Navigate).toHaveBeenCalled();
            expect(Navigate.mock.calls[0][0]).toMatchObject({ to: '/home' });
        });
    });

    it('error message', async () => {
        render(
            <AuthContext.Provider value={mockMemberContextData}>
                <AlertProvider>
                    <MemoryRouter initialEntries={[`/tokens/?error=error`]}>
                        <Routes>
                            <Route path="/tokens/*" element={<TokenAuthenticator />} />
                            <Route path="/home" element={<HomePage />} />
                            <Route path="/login" element={<LoginForm />} />
                        </Routes>
                    </MemoryRouter>
                </AlertProvider>
            </AuthContext.Provider>
        )
 
        const { Navigate } = await import('react-router-dom');

        await waitFor(() => {
            // Check for element on home page
            expect(Navigate).toHaveBeenCalled();
            expect(Navigate.mock.calls[0][0]).toMatchObject({ to: '/login' });
            expect(screen.getByText("error")).toBeInTheDocument();
        });
    });
});