import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import App from './components/App';

const mockCountryResponse = {
  timeline: {
    cases: {
      '3/8/20': 100, '3/9/20': 200, '3/10/20': 400, '3/11/20': 600,
      '3/12/20': 900, '3/13/20': 1300, '3/14/20': 1800,
      '3/15/20': 2400, '3/16/20': 3100, '3/17/20': 3900,
      '3/18/20': 4800, '3/19/20': 5800, '3/20/20': 6900,
      '3/21/20': 8100, '3/22/20': 9400, '3/23/20': 10800,
      '3/24/20': 12300, '3/25/20': 13900, '3/26/20': 15600,
      '3/27/20': 17400,
    },
    deaths: {
      '3/8/20': 2, '3/9/20': 4, '3/10/20': 8, '3/11/20': 14,
      '3/12/20': 22, '3/13/20': 32, '3/14/20': 44,
      '3/15/20': 58, '3/16/20': 74, '3/17/20': 92,
      '3/18/20': 112, '3/19/20': 134, '3/20/20': 158,
      '3/21/20': 184, '3/22/20': 212, '3/23/20': 242,
      '3/24/20': 274, '3/25/20': 308, '3/26/20': 344,
      '3/27/20': 382,
    },
  },
};

const mockStateResponse = Array.from({ length: 20 }, (_, i) => ({
  date: 20200327 - i,
  positive: 10000 - i * 400,
  death: 200 - i * 8,
}));

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if (url.includes('disease.sh')) {
      return Promise.resolve({
        json: () => Promise.resolve(mockCountryResponse),
      });
    }
    return Promise.resolve({
      json: () => Promise.resolve(mockStateResponse),
    });
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders title on main page', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText(/COVID-19 Growth Tracker/i)).toBeInTheDocument();
});

test('renders credits section with data source links', async () => {
  await act(async () => {
    render(<App />);
  });
  expect(screen.getByText(/Country-level data source/i)).toBeInTheDocument();
  expect(screen.getByText(/State-level data source/i)).toBeInTheDocument();
  expect(screen.getByText(/Source code/i)).toBeInTheDocument();
});

test('renders stat tables after data loads', async () => {
  await act(async () => {
    render(<App />);
  });
  await waitFor(() => {
    expect(screen.getByText('> United States')).toBeInTheDocument();
  });
});

test('calls disease.sh API for each country', async () => {
  await act(async () => {
    render(<App />);
  });
  const diseaseCalls = global.fetch.mock.calls.filter(([url]) =>
    url.includes('disease.sh')
  );
  expect(diseaseCalls.length).toBeGreaterThan(0);
});
