import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";

// Some mocks that are used by multiple test suites, to avoid code duplication

// Mocks a user object
export const mockUser = {
    name: 'Test User',
    token: 'mock-session-token'
};

// Mocks a user that is logged in, i.e. a member
export const mockMemberContextData = {
    user: mockUser,
    set_tokens: vi.fn(),
    login_user: vi.fn(),
    logout_user: vi.fn(),
    register_user: vi.fn(),
    send_email_login: vi.fn(),
};

// Mocks a user that is not logged in, i.e. a guest
export const mockGuestContextData = {
    user: null, // null because user is not logged in
    set_tokens: vi.fn(),
    login_user: vi.fn(),
    logout_user: vi.fn(),
    register_user: vi.fn(),
    send_email_login: vi.fn(),
};

// Data for if no problem data is retrieved
export const mockNoProblemData = {};

// Data defining a problem category to be displayed on the homepage
export const mockProblemData = [
    {
        description : "The Time Slotting Problem (TSP) entails optimizing the allocation of entities into predefined time slots.",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc3",
        name : "Time Slotting Problem",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0745', name : 'Meeting scheduling'}],
        style : 0,
        type : 1,
        validator: null
    }
];

// Data defining a couple problem categories to be displayed on the homepage
export const mockMultiProblemData = [
    {
        description : "The Time Slotting Problem (TSP) entails optimizing the allocation of entities into predefined time slots.",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc3",
        name : "Time Slotting Problem",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0745', name : 'Meeting scheduling'}],
        style : 0,
        type : 1,
        validator: null
    }, {
        description : "The Capacitated Vehicle Routing Problem (CVRP) is a logistics optimization challenge where a fleet of vehicles with limited capacity must efficiently serve a set of customers while minimizing transportation costs. Each vehicle starts and ends its route at a central depot, visiting customers to fulfill their demands without exceeding the vehicle's capacity. The objective is to minimize total travel distance or time while ensuring that all customers are served. CVRP finds applications in various industries su",
        id : "2587bee1-8210-4d2e-a2ff-08a82fce5fc4",
        name : "CVRP",
        simulator: null,
        specified_problems : [{id : '3e44afea-c625-4cb9-ad31-41ea0fbd0744', name : 'CVRP instance'}],
        style : 0,
        type : 0,
        validator: null
    }
];

export function renderWithRouter(loggedIn, ComponentToRender) {
    if (loggedIn) {
        return render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockMemberContextData}>
                    <AlertProvider>
                        <ComponentToRender/>
                    </AlertProvider>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    } else {
        return render(
            // Wrapped in BrowserRouter to allow for navigation
            <BrowserRouter>
                {/* Mock the user data */}
                <AuthContext.Provider value={mockGuestContextData}>
                    <AlertProvider>
                        <ComponentToRender/>
                    </AlertProvider>
                </AuthContext.Provider>
            </BrowserRouter>
        );
    }    
}

export function renderWithAlertProvider(ComponentToRender) {
    return render(
        <AlertProvider>
            <ComponentToRender />
        </AlertProvider>
    );
}