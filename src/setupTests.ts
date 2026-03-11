import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas API (not supported in jsdom) so chart.js doesn't throw
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock react-chartjs-2 to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Line: () => null,
}));
