import { describe } from 'vitest';
import router from './App';
import { render, screen } from "@testing-library/react";

describe('App', () => {
    it('renders routing', () => {
        render(() => router());
    });
    screen.debug();
});