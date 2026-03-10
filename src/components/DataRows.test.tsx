import React from 'react';
import { render, screen } from '@testing-library/react';
import DataRows from './DataRows';

// Each row: [date, totalDeaths, deathGrowth, totalCases, newCases, growthRate, threeDay]
const mockStats: any[] = [
  ['3/8/20', 10, 2, 500, 100, '25%', 'n/a'],
  ['3/9/20', 15, 5, 700, 200, '40%', 'n/a'],
  ['3/10/20', 20, 5, 900, 200, '29%', '31%'],
  ['3/11/20', 30, 10, 1200, 300, '33%', '34%'],
  ['3/12/20', 50, 20, 1700, 500, '42%', '35%'],
  ['3/13/20', 80, 30, 2300, 600, '35%', '37%'],
  ['3/14/20', 120, 40, 3000, 700, '30%', '36%'],
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
    const bigStats: any[] = [
      ['3/14/20', 1500, 100, 15000, 2000, '15%', '14%'],
    ];
    render(
      <table><tbody>
        <DataRows stats={bigStats} showOlderData={false} />
      </tbody></table>
    );
    expect(screen.getByText('15.0k')).toBeInTheDocument(); // 15000 formatted
  });
});
