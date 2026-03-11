import { render, screen, fireEvent } from '@testing-library/react';
import type { StatRow } from '../hooks/dataUtils';
import StatTable from './StatTable';

// Need 15+ entries for StatTable to compute 14-day change stats
function makeStats(count: number): StatRow[] {
  const stats: StatRow[] = [];
  for (let i = 0; i < count; i++) {
    const date = `3/${8 + i}/20`;
    const totalCases = 100 * (i + 1);
    const newCases = 100;
    const totalDeaths = 5 * (i + 1);
    const newDeaths = 5;
    stats.push({
      date,
      totalDeaths,
      newDeaths,
      totalCases,
      newCases,
      dayOverDay: '10%',
      rollingAverage: '10%',
    });
  }
  return stats;
}

const mockStats = makeStats(20);

describe('StatTable', () => {
  it('renders the location name', () => {
    render(<StatTable location="California" stats={mockStats} />);
    expect(screen.getByText('> California')).toBeInTheDocument();
  });

  it('shows the 14-day change stats in the header', () => {
    render(<StatTable location="California" stats={mockStats} />);
    expect(screen.getByText(/14-day change in deaths/)).toBeInTheDocument();
    expect(screen.getByText(/14-day change in cases/)).toBeInTheDocument();
  });

  it('does not show data table by default for non-initialLocation', () => {
    render(<StatTable location="California" stats={mockStats} />);
    expect(screen.queryByText('Date')).not.toBeInTheDocument();
  });

  it('shows data table when "United States" (initialLocation) is rendered', () => {
    render(<StatTable location="United States" stats={mockStats} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
  });

  it('toggles table visibility when location title is clicked', () => {
    render(<StatTable location="California" stats={mockStats} />);
    expect(screen.queryByText('Date')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('> California'));
    expect(screen.getByText('Date')).toBeInTheDocument();

    fireEvent.click(screen.getByText('> California'));
    expect(screen.queryByText('Date')).not.toBeInTheDocument();
  });

  it('shows table headings: Total deaths, New deaths, Total cases, New cases', () => {
    render(<StatTable location="United States" stats={mockStats} />);
    expect(screen.getAllByText(/Total/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/New/).length).toBeGreaterThan(0);
  });
});
