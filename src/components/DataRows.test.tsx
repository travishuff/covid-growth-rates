import { render, screen } from '@testing-library/react';
import type { StatRow } from '../hooks/dataUtils';
import DataRows from './DataRows';

const mockStats: StatRow[] = [
  { date: '3/8/20', totalDeaths: 10, newDeaths: 2, totalCases: 500, newCases: 100, dayOverDay: '25%', rollingAverage: 'n/a' },
  { date: '3/9/20', totalDeaths: 15, newDeaths: 5, totalCases: 700, newCases: 200, dayOverDay: '40%', rollingAverage: 'n/a' },
  { date: '3/10/20', totalDeaths: 20, newDeaths: 5, totalCases: 900, newCases: 200, dayOverDay: '29%', rollingAverage: '31%' },
  { date: '3/11/20', totalDeaths: 30, newDeaths: 10, totalCases: 1200, newCases: 300, dayOverDay: '33%', rollingAverage: '34%' },
  { date: '3/12/20', totalDeaths: 50, newDeaths: 20, totalCases: 1700, newCases: 500, dayOverDay: '42%', rollingAverage: '35%' },
  { date: '3/13/20', totalDeaths: 80, newDeaths: 30, totalCases: 2300, newCases: 600, dayOverDay: '35%', rollingAverage: '37%' },
  { date: '3/14/20', totalDeaths: 120, newDeaths: 40, totalCases: 3000, newCases: 700, dayOverDay: '30%', rollingAverage: '36%' },
];

describe('DataRows', () => {
  it('renders the last 7 rows when showOlderData is false', () => {
    render(
      <table><tbody>
        <DataRows stats={mockStats} showOlderData={false} />
      </tbody></table>
    );
    // all 7 rows visible (our mock has exactly 7)
    expect(screen.getByText('3/8/20')).toBeInTheDocument();
    expect(screen.getByText('3/14/20')).toBeInTheDocument();
  });

  it('renders all rows when showOlderData is true', () => {
    render(
      <table><tbody>
        <DataRows stats={mockStats} showOlderData={true} />
      </tbody></table>
    );
    expect(screen.getByText('3/8/20')).toBeInTheDocument();
    expect(screen.getByText('3/14/20')).toBeInTheDocument();
  });

  it('shows the threeDay rolling average column when showOlderData is true', () => {
    render(
      <table><tbody>
        <DataRows stats={mockStats} showOlderData={true} />
      </tbody></table>
    );
    expect(screen.getAllByText('31%').length).toBeGreaterThan(0);
  });

  it('does not show threeDay column when showOlderData is false', () => {
    render(
      <table><tbody>
        <DataRows stats={mockStats} showOlderData={false} />
      </tbody></table>
    );
    expect(screen.queryByText('31%')).not.toBeInTheDocument();
  });

  it('formats large numbers with addCommas', () => {
    const bigStats: StatRow[] = [
      { date: '3/14/20', totalDeaths: 1500, newDeaths: 100, totalCases: 15000, newCases: 2000, dayOverDay: '15%', rollingAverage: '14%' },
    ];
    render(
      <table><tbody>
        <DataRows stats={bigStats} showOlderData={false} />
      </tbody></table>
    );
    expect(screen.getByText('15.0k')).toBeInTheDocument(); // 15000 formatted
  });
});
