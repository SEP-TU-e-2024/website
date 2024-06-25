import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { AlertProvider } from "../../context/AlertContext";
import AuthContext from "../../context/AuthContext";
import LeaderboardColumn from "../leaderboards/LeaderboardColumn";

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

// Data defining a problem category to be displayed on the homepage
export const mockProblemDataLeaderboard = 
    {
        benchmark_instances: [
          {
            id: "0a800b64-0cce-4cb2-95ab-39a5064ece4e",
            filepath: "instance2.txt"
          },
          {
            id: "83a8977e-760a-4d44-9a67-e07ca4d4c155",
            filepath: "instance1.txt"
          }
        ],
        category: null,
        description: "Hello, world!",
        example_submission_url: null,
        id: "3513eb23-7b59-4a70-b6d5-1ebf5e354db4",
        name: "My Test Problem",
        simulator: null,
        style: 1,
        type: 0,
        validator: {
            container: "validators",
            filepath: "validator.zip",
            id: "2d7a8e94-0c3e-4c13-bf98-4296de50ae8a",
            is_downloadable: false
        },
        evaluation_settings: {
            cpu: 1,
            machine_type: "Standard_B1s",
            memory: 256,
            time_limit: 60
        },
        id: "83cb333e-e4c9-4f92-b002-9a8b33b039fd",
        metrics: [
            {
                label: "The score",
                name: "score",
                order: 1,
                unit: ""
            }
        ],
        name: "MyTestSpecProb",
        scoring_metric: {
            label: "The score",
            name: "score",
            order: 1,
            unit: ""
        }
    };

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

export const mockLeaderboardData = [
    {
      instance_entries: [
        {
          benchmark_instance: {
            filepath: "instance2.txt",
            id: "0a800b64-0cce-4cb2-95ab-39a5064ece4e"
          },
          rank: 1,
          results: {
            score: 1
          }
        },
        {
          benchmark_instance: {
            filepath: "instance1.txt",
            id: "83a8977e-760a-4d44-9a67-e07ca4d4c155"
          },
          results: {
            score: 1
          }
        }
      ],
      submission: {
        container: "submissions",
        created_at: "2024-06-19T08:10:29.604000Z",
        filepath: "33da1e2e-1897-4036-9fc2-44d65e586a7e.zip",
        id: "33da1e2e-1897-4036-9fc2-44d65e586a7e",
        is_downloadable: false,
        is_verified: true,
        name: "example submission one",
        problem: "83cb333e-e4c9-4f92-b002-9a8b33b039fd",
        user: "6588ac3c-cfdc-432c-8c82-c67f2b744476"
      },
      submitter: {
        email: "johndoe@gmail.com",
        id: "6588ac3c-cfdc-432c-8c82-c67f2b744476",
        name: "John Doe"
      }
    },
    {
      instance_entries: [
        {
          benchmark_instance: {
            filepath: "instance2.txt",
            id: "0a800b64-0cce-4cb2-95ab-39a5064ece4e"
          },
          rank: 2,
          results: {
            score: 4
          }
        },
        {
          benchmark_instance: {
            filepath: "instance1.txt",
            id: "83a8977e-760a-4d44-9a67-e07ca4d4c155"
          },
          results: {
            score: 3
          }
        }
      ],
      submission: {
        container: "submissions",
        created_at: "2024-06-12T13:14:42.580000Z",
        filepath: "submission.zip",
        id: "a2938ac3-9a6b-4d88-a875-72f46ea913aa",
        is_downloadable: false,
        is_verified: true,
        name: "example submission two",
        problem: "83cb333e-e4c9-4f92-b002-9a8b33b039fd",
        user: "f04cac7e-4b10-4076-bcf8-93718af6efbe"
      },
      submitter: {
        email: "jahnsmith@email.com",
        id: "f04cac7e-4b10-4076-bcf8-93718af6efbe",
        name: "Jane Smith"
      }
    },
    {
        instance_entries: [
          {
            benchmark_instance: {
              filepath: "instance2.txt",
              id: "0a800b64-0cce-4cb2-95ab-39a5064ece4e"
            },
            rank: 2,
            results: {
              score: 1
            }
          },
          {
            benchmark_instance: {
              filepath: "instance1.txt",
              id: "83a8977e-760a-4d44-9a67-e07ca4d4c155"
            },
            results: {
              score: 1
            }
          }
        ],
        submission: {
          container: "submissions",
          created_at: "2024-06-12T13:14:42.580000Z",
          filepath: "submission.zip",
          id: "a2938ac3-9a6b-4d88-a875-72f46ea913aa",
          is_downloadable: false,
          is_verified: true,
          name: "example submission three",
          problem: "83cb333e-e4c9-4f92-b002-9a8b33b039fd",
          user: "f04cac7e-4b10-4076-bcf8-93718af6efbe"
        },
        submitter: {
          email: "jahnsmith@email.com",
          id: "f04cac7e-4b10-4076-bcf8-93718af6efbe",
          name: "Jane Smith"
        }
      }
]
  
export const mockColumns = () => {
    let columns = [];

    columns.push(new LeaderboardColumn("Submission name", 
        (entry) => { return entry.submission.name }));
    columns.push(new LeaderboardColumn("Submitted by", 
        (entry) => { return entry.submitter.name != null && entry.submitter.name != "" ?  entry.submitter.name : "Anonymous user" }));
    columns.push(new LeaderboardColumn("Submission date", 
        (entry) => { return entry.submission.created_at.slice(0,10) })); //the slice is to format the date

    return columns;
}  

export const mockLeaderboardRow = ({columns, entry}) => {
    return (
      <>
        <tr className="view">
          {/* // Add column data cell for the leaderboard entry  */}
          {columns.map(column => (
              <td key={column.name}>{column.getData(entry)}</td>
          ))}        
        </tr>
      </>
    )
  };

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