// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Mock canvas API (not supported in jsdom) so chart.js doesn't throw
HTMLCanvasElement.prototype.getContext = () => null;

// Mock react-chartjs-2 to avoid canvas issues in tests
jest.mock('react-chartjs-2', () => ({
  Line: () => null,
}));
