import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock canvas API (not supported in jsdom) so chart.js doesn't throw
HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock react-chartjs-2 to avoid canvas issues in tests
vi.mock('react-chartjs-2', () => ({
  Line: () => null,
}));

// Mock chart.js registration to avoid canvas errors
vi.mock('chart.js', () => ({
  Chart: { register: vi.fn() },
  CategoryScale: class {},
  LinearScale: class {},
  PointElement: class {},
  LineElement: class {},
  Filler: class {},
  Tooltip: class {},
  Legend: class {},
  Title: class {},
}));
