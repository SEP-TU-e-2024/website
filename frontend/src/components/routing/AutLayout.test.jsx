import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuthLayout from "./AuthLayout";
import { MemoryRouter, Routes, Route } from "react-router-dom";

// Mock the context providers
vi.mock('../../context/AuthContext', () => {
  return {
    AuthProvider: ({ children }) => <div data-testid="auth-provider">{children}</div>,
  };
});

vi.mock('../../context/AlertContext', () => {
  return {
    AlertProvider: ({ children }) => <div data-testid="alert-provider">{children}</div>,
  };
});

describe("AuthLayout Component", () => {
  it("should render without crashing", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
        </Routes>
      </MemoryRouter>
    );
    screen.debug();
  });

  it("should render the AuthProvider and AlertProvider components", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AuthLayout />} />
        </Routes>
      </MemoryRouter>
    );

    // Check for AuthProvider component
    expect(screen.getByTestId("auth-provider")).toBeInTheDocument();
    // Check for AlertProvider component
    expect(screen.getByTestId("alert-provider")).toBeInTheDocument();
  });
});