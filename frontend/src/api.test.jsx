import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import api, { getAccessToken } from './api';

// Mock localStorage
const localStorageMock = (() => {
    // The actual storage
    let store = {};

    return {
        // Return the item that was stored at key
        getItem(key) {
            return store[key] || null;
        },
        // Set the item at key to be value
        setItem(key, value) {
            store[key] = value.toString();
        },
        // Clear the storage
        clear() {
            store = {};
        },
        // Delete the item that was stored at key
        removeItem(key) {
            delete store[key];
        }
    };
})();

// Set the window to use the mocked localStorage
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock the axios module to allow for isolated unit tests
vi.mock("axios", async (importOriginal) => {
    // Only change the create implementation, leave the rest as the original
    const actual = await importOriginal()
    return {
        ...actual,
        create: vi.fn(() => ({
            interceptors: {
                request: {
                    // Mock the interceptors.request.use function, including when it rejects the request
                    use: vi.fn((fulfilled, rejected) => {
                        api.interceptors.request.handlers.push({
                            fulfilled,
                            rejected
                        });
                    }),
                    // No actual handling of requests is done because it's just a mock
                    handlers: []
                }
            }
        }))
    }
  });

describe('getAccessToken', () => {
    beforeEach(() => {
        // Clear the localStorage to prevent leaking state
        localStorage.clear();
    });

    it('should return the access token if it exists in localStorage', () => {
        // Set test token
        const tokens = { access: 'testAccessToken' };
        localStorage.setItem('authTokens', JSON.stringify(tokens));

        // Should return the test token
        const token = getAccessToken();
        expect(token).toBe('testAccessToken');
    });

    it('should return null if no tokens exist in localStorage', () => {
        // Try to get access token when none was set
        const token = getAccessToken();
        expect(token).toBeNull();
    });
});

describe('api', () => {
    beforeEach(() => {
        // Clear the localStorage to prevent leaking state between tests
        localStorage.clear();
        // Reset the mocking of axios to prevent leaking state
        vi.resetAllMocks();
    });

    it('should be configured with the correct baseURL', () => {
        expect(api.defaults.baseURL).toBe(import.meta.env.VITE_API_URL);
    });

    it('should include Authorization header if access token exists', async () => {
        // Set a test token
        const tokens = { access: 'testAccessToken' };
        localStorage.setItem('authTokens', JSON.stringify(tokens));

        // Simulate a request
        const requestConfig = {
            headers: {}
        };
        await api.interceptors.request.handlers[0].fulfilled(requestConfig);

        // Check if it has the correct header 
        expect(requestConfig.headers['Authorization']).toBe('Bearer testAccessToken');
    });

    it('should not include Authorization header if access token does not exist', async () => {
        // Create a request without setting a token
        const requestConfig = {
            headers: {}
        };
        await api.interceptors.request.handlers[0].fulfilled(requestConfig);

        // Check if it has the correct header
        expect(requestConfig.headers['Authorization']).toBeUndefined();
    });

    it('should handle request errors', async () => {
        // Create an error
        const error = new Error('Request error');

        try {
            // Simulate the error being thrown
            await api.interceptors.request.handlers[0].rejected(error);
        } catch (e) {
            // Expect that api returned the error
            expect(e).toBe(error);
        }
    });
});
