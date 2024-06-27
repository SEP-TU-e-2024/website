import React, { useEffect } from 'react';
import { useContext } from 'react'
import { screen, waitFor, render} from '@testing-library/react';
import { describe, expect, vi } from 'vitest';
import { AuthProvider } from './AuthContext';
import AuthContext from './AuthContext'
import api from '../api';
import { mockProblemDataLeaderboard, mockLeaderboardData, renderWithRouter } from '../components/testing_utils/TestingUtils';

const mockTokens = {
    refresh:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxOTQ4MjUzNSwiaWF0IjoxNzE5NDc4OTM1LCJqdGkiOiJiM2VlNTlmZGI0YmM0Mjc3OTM2NzVhZmE5NjU3NmM2MyIsInVzZXJfaWQiOiI5YTI2MzZlMC05ODRmLTRlNzktYmM5ZS0xM2E2MjhmM2NmN2IifQ._F6MKVNtMyIMSbQMJOWRLL48zB2Xk811BwIG4oJcs8w",
    access:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5NDc5MjM1LCJpYXQiOjE3MTk0Nzg5MzUsImp0aSI6ImE2MTVmMWU5MzY0NjRmMTZiYjAyNmJiNjk1YmIyZDQzIiwidXNlcl9pZCI6IjlhMjYzNmUwLTk4NGYtNGU3OS1iYzllLTEzYTYyOGYzY2Y3YiJ9.7WvFx_znI0Rylu9y3DzPHBYTYrVpRUs7xevgFcx2Y70"
}

const mockReponseTokens = {
    refresh:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcxOTQ4OTAzNCwiaWF0IjoxNzE5NDg1NDM0LCJqdGkiOiI1YWQyNjkwZDNiMmM0MWIwODJiMWNiMmExYTk1NGUyZSIsInVzZXJfaWQiOiIwNjdjNTRlYS0xZGNhLTQ0NzAtYjE5OS1iMzYwMmQ0MjI4NjAifQ.gEFJAsU-_of9wLS2FSi97wREkVHGZnWTLdvQ9G1i-UY",
    access:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5NDg1NzM0LCJpYXQiOjE3MTk0ODU0MzQsImp0aSI6IjRhODM2NzE2ZDNmMDQyODNhOTg3ZGJkNzNhYTU4Y2MwIiwidXNlcl9pZCI6IjA2N2M1NGVhLTFkY2EtNDQ3MC1iMTk5LWIzNjAyZDQyMjg2MCJ9.ChNEszdYoql16iPv7ITIeztNFzyFJ6DEVKkewpkL55k"
}


const TestingComponentRegister = ({event}) => {
    const { user, set_tokens, login_user, logout_user, register_user, send_email_login } = useContext(AuthContext);

    register_user(event)

    return (
        <></>
    );
};

const TestingComponentLogin = ({event}) => {
    const { user, login_user } = useContext(AuthContext);

    login_user(event)

    return (
        <div>
            <p> {user? user.user_id : "No user found"} </p>
        </div>
    );
};

const TestingComponentSendLoginEmail = ({event}) => {
    const { user, send_email_login } = useContext(AuthContext);

    send_email_login(event)

    return (
        <div>
            <p> {user? user.user_id : "No user found"} </p>
        </div>
    );
};

const TestingComponentUpdateToken = () => {
    const { user, update_token, set_tokens } = useContext(AuthContext);

    update_token()

    return (
        <div>
            <p> {user? user.user_id : "No user found"} </p>
        </div>
    );
};

describe('AuthContext', () => {  

    it('renders children components', async () => {
        const provider = renderWithRouter(true, () => (
            <AuthProvider>
                <p> Test </p>
            </AuthProvider>        
        ));

        await waitFor(() => { 
            expect(screen.getByText("Test")).toBeInTheDocument();
            expect(provider.authTokens == null).toBe(true);
            expect(provider.user == null).toBe(true);
        });
    });

    describe('register function', async () => {
        [{
            scenario: 'emails not equal',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password2"},
                    email: {value: "email@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {status: 400},
            expectedOutput: 'Passwords not equal',
        },
        {
            scenario: 'passwords not equal',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password"},
                    email: {value: "email2@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {status: 400},
            expectedOutput: 'Emails are not equal',
        },
        {
            scenario: 'good case',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password"},
                    email: {value: "email@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {status: 201},
            expectedOutput: 'Email sent successfully, please check your email',
        },
        {
            scenario: 'API error detail',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password"},
                    email: {value: "email@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {response: {data: {detail: "Email already in use"}}},
            expectedOutput: 'Email already in use',
        },
        {
            scenario: 'API error 500',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password"},
                    email: {value: "email@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 500}},
            expectedOutput: 'Something went wrong on the server',
        },
        {
            scenario: 'API generic error',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    confirm_password: {value: "password"},
                    email: {value: "email@email.com"},
                    confirm_email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 505}},
            expectedOutput: 'Something went wrong',
        }
        ].forEach(({ scenario, event, api_response, expectedOutput }) => {
            it(scenario, async () => {
                // Mock API Response
                if (api_response.status < 400) {
                    const spy = vi.spyOn(api, 'post').mockResolvedValue(
                        api_response,
                    );
                } else {
                    const spy = vi.spyOn(api, 'post').mockRejectedValue(
                        api_response,
                    );
                }
                
                // Render component
                const provider = renderWithRouter(true, () => (
                    <AuthProvider>
                        <TestingComponentRegister event={event}/>
                    </AuthProvider>        
                ));
        
                await waitFor(() => { 
                    expect(screen.getByText(expectedOutput)).toBeInTheDocument();
                });
            });
        });
    });


    describe('login function', async () => {
        [{
            scenario: 'succesfull login',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    email: {value: "email@email.com"},
                }
            },
            api_response: {data: mockTokens, status: 201},
            expectedOutput: '9a2636e0-984f-4e79-bc9e-13a628f3cf7b', // User id of decoded access token
        },
        {
            scenario: 'API error detail',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {data: {detail: "Email already in use"}}},
            expectedOutput: 'Email already in use',
        },
        {
            scenario: 'API error detail 404',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 404}},
            expectedOutput: 'Account not found',
        },
        {
            scenario: 'API error 500',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 500}},
            expectedOutput: "Something went wrong, maybe you don't have a password.",
        },
        {
            scenario: 'API generic error',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    password: {value: "password"},
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 505}},
            expectedOutput: "Something went wrong",
        },
        ].forEach(({ scenario, event, api_response, expectedOutput }) => {
            it(scenario, async () => {
                // Mock API Response
                if (api_response.status < 400) {
                    const spy = vi.spyOn(api, 'post').mockResolvedValue(
                        api_response,
                    );
                } else {
                    const spy = vi.spyOn(api, 'post').mockRejectedValue(
                        api_response,
                    );
                }
                
                // Render component
                const provider = renderWithRouter(true, () => (
                    <AuthProvider>
                        <TestingComponentLogin event={event}/>
                    </AuthProvider>        
                ));
        
                await waitFor(() => { 
                    expect(screen.getByText(expectedOutput)).toBeInTheDocument();
                });
            });
        });
    });

    describe('send email login function', async () => {
        [{
            scenario: 'succesfull send',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    email: {value: "email@email.com"},
                }
            },
            api_response: {status: 200},
            expectedOutput: 'Email sent succesfully',
        },
        {
            scenario: 'API error detail',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {data: {detail: "Generic response message"}}},
            expectedOutput: 'Generic response message',
        },
        {
            scenario: 'API error detail 404',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 404}},
            expectedOutput: 'Account with given email does not exists',
        },
        {
            scenario: 'API error 500',
            event: {
                preventDefault: vi.fn(),
                target: { 
                    email: {value: "email@email.com"},
                }
            },
            api_response: {response: {status: 500}},
            expectedOutput: "Something went wrong on the server",
        },
        ].forEach(({ scenario, event, api_response, expectedOutput }) => {
            it(scenario, async () => {
                // Mock API Response
                if (api_response.status < 400) {
                    const spy = vi.spyOn(api, 'post').mockResolvedValue(
                        api_response,
                    );
                } else {
                    const spy = vi.spyOn(api, 'post').mockRejectedValue(
                        api_response,
                    );
                }
                
                // Render component
                const provider = renderWithRouter(true, () => (
                    <AuthProvider>
                        <TestingComponentSendLoginEmail event={event}/>
                    </AuthProvider>        
                ));
        
                await waitFor(() => { 
                    expect(screen.getByText(expectedOutput)).toBeInTheDocument();
                });
            });
        });
    });

    describe('update token function', async () => {
        [ 
        {
            scenario: 'succesfull update',
            api_response: {data: mockReponseTokens, status: 200},
            expectedOutput: '067c54ea-1dca-4470-b199-b3602d422860', // User id of decoded access token
        },
        {
            scenario: 'session expired',
            api_response: {response: {status: 400}},
            expectedOutput: 'Session expired',
        },
        ].forEach(({ scenario, api_response, expectedOutput }) => {
            it(scenario, async () => {
                // Mock API Response
                if (api_response.status < 400) {
                    const spy = vi.spyOn(api, 'post').mockResolvedValue(
                        api_response,
                    );
                } else {
                    const spy = vi.spyOn(api, 'post').mockRejectedValue(
                        api_response,
                    );
                }

                localStorage.setItem("authTokens", JSON.stringify(mockTokens))
                
                // Render component
                const provider = renderWithRouter(true, () => (
                    <AuthProvider>
                        <TestingComponentUpdateToken/>
                    </AuthProvider>        
                ));
        
                await waitFor(() => { 
                    expect(screen.getByText(expectedOutput)).toBeInTheDocument();
                });

                // Does not work
                vi.useFakeTimers();
                vi.advanceTimersByTime(1000 * 4 * 61);
                vi.useRealTimers();
                expect(screen.getByText(expectedOutput)).toBeInTheDocument();
            });
        });
    });
});