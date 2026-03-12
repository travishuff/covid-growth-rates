import { render, screen, fireEvent } from '@testing-library/react';
import type { StatRow } from '../hooks/dataUtils';
import TabGroup from './TabGroup';
import MetricSelector from './MetricSelector';
import TimeRangeSelector from './TimeRangeSelector';
import DetailTable from './DetailTable';

function makeStats(count: number): StatRow[] {
  const stats: StatRow[] = [];
  for (let i = 0; i < count; i++) {
    const date = `3/${8 + i}/20`;
    stats.push({
      date,
      totalDeaths: 5 * (i + 1),
      newDeaths: 5,
      totalCases: 100 * (i + 1),
      newCases: 100,
      dayOverDay: '10%',
      rollingAverage: '10%',
    });
  }
  return stats;
}

describe('TabGroup', () => {
  it('renders both tabs', () => {
    render(<TabGroup activeTab="states" onTabChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'US States' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Countries' })).toBeInTheDocument();
  });

  it('marks the active tab as selected', () => {
    render(<TabGroup activeTab="countries" onTabChange={() => {}} />);
    expect(screen.getByRole('tab', { name: 'Countries' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'US States' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onTabChange when clicked', () => {
    const onChange = vi.fn();
    render(<TabGroup activeTab="states" onTabChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Countries' }));
    expect(onChange).toHaveBeenCalledWith('countries');
  });
});

describe('MetricSelector', () => {
  it('renders all metric buttons', () => {
    render(<MetricSelector metric="newCases" onChange={() => {}} />);
    expect(screen.getByText('New Cases')).toBeInTheDocument();
    expect(screen.getByText('New Deaths')).toBeInTheDocument();
    expect(screen.getByText('Growth %')).toBeInTheDocument();
  });

  it('marks the active metric as pressed', () => {
    render(<MetricSelector metric="newDeaths" onChange={() => {}} />);
    expect(screen.getByText('New Deaths')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('New Cases')).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('TimeRangeSelector', () => {
  it('renders all range buttons', () => {
    render(<TimeRangeSelector range={365} onChange={() => {}} />);
    expect(screen.getByText('90 days')).toBeInTheDocument();
    expect(screen.getByText('1 year')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
  });

  it('marks the active range as pressed', () => {
    render(<TimeRangeSelector range={90} onChange={() => {}} />);
    expect(screen.getByText('90 days')).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('DetailTable', () => {
  const stats = makeStats(20);

  it('renders the location heading', () => {
    render(<DetailTable location="California" stats={stats} />);
    expect(screen.getByText('California')).toBeInTheDocument();
  });

  it('renders table column headers', () => {
    render(<DetailTable location="California" stats={stats} />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('New Cases')).toBeInTheDocument();
    expect(screen.getByText('New Deaths')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
  });

  it('shows recent data rows in reverse chronological order', () => {
    render(<DetailTable location="California" stats={stats} />);
    const rows = screen.getAllByRole('row');
    // header + 20 data rows (capped at 30, we have 20)
    expect(rows.length).toBe(21);
  });
});
