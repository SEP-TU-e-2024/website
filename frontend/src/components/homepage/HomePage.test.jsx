import { describe, expect } from "vitest";
import HomePage from "./HomePage";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

describe("HomePage", () => {
    // const getRows = vi.spyOn(HomePage, "getRows").mockImplementation(() => {
    //     return {};
    // });
    // it("should display 'No data found' if no data is given", () => {
    //     render(
    //         // Wrap it in BrowserRouter to allow for navigation
    //         <BrowserRouter>
    //             <HomePage/>
    //         </BrowserRouter>
    //     );
    //     const noDataText = screen.getByText("No data found");
    //     expect(noDataText).toBeInTheDocument();
    //     expect(getRows).toBeCalled();   
    // });

    it("should display nr of problem occurrences given", () => {
        var rows = render(
            // Wrap it in BrowserRouter to allow for navigation
            <BrowserRouter>
                <HomePage/>
            </BrowserRouter>
        );
        const noDataText = screen.getByText("No data found");
        expect(noDataText).toBeInTheDocument();
    });
});