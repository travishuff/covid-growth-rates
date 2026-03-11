import { render, screen, waitFor, act } from '@testing-library/react';
import { vi } from 'vitest';
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

const mockStateCsv = [
  'date,state,fips,cases,deaths',
  '2020-03-27,California,06,10000,200',
  '2020-03-26,California,06,9600,192',
  '2020-03-25,California,06,9200,184',
  '2020-03-24,California,06,8800,176',
  '2020-03-23,California,06,8400,168',
  '2020-03-22,California,06,8000,160',
  '2020-03-21,California,06,7600,152',
  '2020-03-20,California,06,7200,144',
  '2020-03-19,California,06,6800,136',
  '2020-03-18,California,06,6400,128',
  '2020-03-17,California,06,6000,120',
  '2020-03-16,California,06,5600,112',
  '2020-03-15,California,06,5200,104',
  '2020-03-14,California,06,4800,96',
  '2020-03-13,California,06,4400,88',
  '2020-03-12,California,06,4000,80',
  '2020-03-11,California,06,3600,72',
  '2020-03-10,California,06,3200,64',
  '2020-03-09,California,06,2800,56',
  '2020-03-08,California,06,2400,48',
].join('\n');

beforeEach(() => {
  global.fetch = vi.fn((url: string) => {
    if (url.includes('disease.sh')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCountryResponse),
      });
    }
    return Promise.resolve({
      ok: true,
      text: () => Promise.resolve(mockStateCsv),
    });
  }) as unknown as typeof global.fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
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
  const fetchMock = global.fetch as ReturnType<typeof vi.fn>;
  const diseaseCalls = fetchMock.mock.calls.filter((args) =>
    String(args[0]).includes('disease.sh')
  );
  expect(diseaseCalls.length).toBeGreaterThan(0);
});
