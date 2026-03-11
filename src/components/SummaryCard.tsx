import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import type { StatRow } from '../hooks/dataUtils';
import { addCommas } from '../hooks/dataUtils';
import type { Metric } from './MetricSelector';

const PALETTE = [
  '#4e79a7', '#b85450', '#59a14f', '#9c6b8a',
  '#c49c2a', '#3d8a8a', '#7b7f86',
];

interface SummaryCardProps {
  location: string;
  stats: StatRow[];
  index: number;
  selected: boolean;
  metric: Metric;
  onClick: () => void;
}

function SummaryCard({ location, stats, index, selected, metric, onClick }: SummaryCardProps) {
  const color = PALETTE[index % PALETTE.length];
  const last = stats[stats.length - 1];

  const change14d = useMemo(() => {
    if (stats.length < 15) return null;
    const recent = stats[stats.length - 1];
    const older = stats[stats.length - 15];
    if (!older.totalCases || !recent.totalCases) return null;
    return ((recent.totalCases / older.totalCases - 1) * 100).toFixed(1);
  }, [stats]);

  const sparklineData = useMemo(() => {
    const tail = stats.slice(-60);
    const values = tail.map((s) => {
      if (metric === 'newCases') return s.newCases;
      if (metric === 'newDeaths') return s.newDeaths;
      return parseFloat(s.dayOverDay) || 0;
    });
    return {
      labels: tail.map((s) => s.date),
      datasets: [{
        data: values,
        fill: false,
        borderColor: color,
        borderWidth: 1.5,
        pointRadius: 0,
        tension: 0.3,
      }],
    };
  }, [stats, metric, color]);

  const sparklineOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: false as const,
  }), []);

  return (
    <div
      className="summary-card"
      role="button"
      tabIndex={0}
      aria-selected={selected}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <div className="card-location" style={{ color }}>{location}</div>
      <div className="card-stats">
        <span>Cases: <span className="card-stat-value">{addCommas(last.totalCases)}</span></span>
        <span>Deaths: <span className="card-stat-value">{addCommas(last.totalDeaths)}</span></span>
      </div>
      {change14d !== null && (
        <div className={`card-change ${Number(change14d) > 0 ? 'positive' : 'zero'}`}>
          14-day change: {change14d}%
        </div>
      )}
      <div className="card-sparkline">
        <Line data={sparklineData} options={sparklineOptions} />
      </div>
    </div>
  );
}

export default SummaryCard;
