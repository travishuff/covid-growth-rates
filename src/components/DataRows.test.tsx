import { render, screen } from '@testing-library/react';
import type { StatRow } from '../hooks/dataUtils';
import SummaryCard from './SummaryCard';

const mockStats: StatRow[] = [];
for (let i = 0; i < 20; i++) {
  mockStats.push({
    date: `3/${8 + i}/20`,
    totalDeaths: 5 * (i + 1),
    newDeaths: 5,
    totalCases: 100 * (i + 1),
    newCases: 100,
    dayOverDay: '10%',
    rollingAverage: '10%',
  });
}

describe('SummaryCard', () => {
  it('renders the location name', () => {
    render(
      <SummaryCard
        location="California"
        stats={mockStats}
        index={0}
        selected={false}
        metric="newCases"
        onClick={() => {}}
      />
    );
    expect(screen.getByText('California')).toBeInTheDocument();
  });

  it('shows total cases and deaths', () => {
    render(
      <SummaryCard
        location="California"
        stats={mockStats}
        index={0}
        selected={false}
        metric="newCases"
        onClick={() => {}}
      />
    );
    expect(screen.getByText('2,000')).toBeInTheDocument(); // totalCases of last entry: 100*20
  });

  it('shows 14-day change percentage', () => {
    render(
      <SummaryCard
        location="California"
        stats={mockStats}
        index={0}
        selected={false}
        metric="newCases"
        onClick={() => {}}
      />
    );
    expect(screen.getByText(/14-day change/)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(
      <SummaryCard
        location="California"
        stats={mockStats}
        index={0}
        selected={false}
        metric="newCases"
        onClick={onClick}
      />
    );
    screen.getByText('California').click();
    expect(onClick).toHaveBeenCalled();
  });

  it('sets aria-selected when selected', () => {
    render(
      <SummaryCard
        location="California"
        stats={mockStats}
        index={0}
        selected={true}
        metric="newCases"
        onClick={() => {}}
      />
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-selected', 'true');
  });
});
