import { describe, expect } from "vitest";
import HomePage from "./HomePage";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getRows } from "./HomePage";

describe("HomePage", () => {
    
    it("should display 'No data found' if no data is given", () => {
        const getRowsSpy = vi.spyOn(HomePage, 'getRows').mockImplementation(async () => {
            return {};
        });
        render(
            // Wrap it in BrowserRouter to allow for navigation
            <BrowserRouter>
                <HomePage/>
            </BrowserRouter>
        );
        const test = getRows();
        const noDataText = screen.getByText("No data found");
        expect(noDataText).toBeInTheDocument();
        expect(test).toBe({});   
    });

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