import { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { StatRow } from '../hooks/dataUtils';
import { addCommas } from '../hooks/dataUtils';
import type { Metric } from './MetricSelector';
import type { TimeRange } from './TimeRangeSelector';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend, Title);

const PALETTE = [
  '#4e79a7', '#b85450', '#59a14f', '#9c6b8a',
  '#c49c2a', '#3d8a8a', '#7b7f86',
];

const MAX_VISIBLE_LABELS = 12;
const CHART_TITLE_COLOR = '#6b6b6b';
const AXIS_TICK_COLOR = '#999';
const GRID_COLOR = '#f0ede8';

interface ComparisonChartProps {
  locations: [string, StatRow[]][];
  metric: Metric;
  timeRange: TimeRange;
}

function getMetricValue(row: StatRow, metric: Metric): number {
  if (metric === 'newCases') return row.newCases;
  if (metric === 'newDeaths') return row.newDeaths;
  return parseFloat(row.dayOverDay) || 0;
}

function getMetricLabel(metric: Metric): string {
  if (metric === 'newCases') return 'New Cases';
  if (metric === 'newDeaths') return 'New Deaths';
  return 'Growth %';
}

function ComparisonChart({ locations, metric, timeRange }: ComparisonChartProps) {
  const chartData = useMemo(() => {
    if (locations.length === 0) return null;

    // Find the union of all dates across locations, then trim to timeRange
    const allDatesSet = new Set<string>();
    locations.forEach(([, stats]) => {
      stats.forEach((s) => allDatesSet.add(s.date));
    });

    let allDates = Array.from(allDatesSet).sort((a, b) => {
      const [am, ad, ay] = a.split('/').map(Number);
      const [bm, bd, by] = b.split('/').map(Number);
      const aTime = Date.UTC(ay < 100 ? 2000 + ay : ay, am - 1, ad);
      const bTime = Date.UTC(by < 100 ? 2000 + by : by, bm - 1, bd);
      return aTime - bTime;
    });

    if (timeRange > 0) {
      allDates = allDates.slice(-timeRange);
    }

    const datasets = locations.map(([name, stats], i) => {
      const dateMap = new Map(stats.map((s) => [s.date, s]));
      const data = allDates.map((d) => {
        const row = dateMap.get(d);
        return row ? getMetricValue(row, metric) : null;
      });

      return {
        label: name,
        data,
        borderColor: PALETTE[i % PALETTE.length],
        backgroundColor: PALETTE[i % PALETTE.length],
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        tension: 0.2,
        spanGaps: true,
      };
    });

    const step = Math.max(1, Math.floor(allDates.length / MAX_VISIBLE_LABELS));
    const labels = allDates.map((d, i) => (i % step === 0 ? d : ''));

    return { labels, datasets, _rawLabels: allDates };
  }, [locations, metric, timeRange]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          pointStyle: 'line' as const,
          padding: 16,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          title: (items: { dataIndex: number }[]) => {
            if (!chartData || items.length === 0) return '';
            return chartData._rawLabels[items[0].dataIndex] ?? '';
          },
          label: (ctx: { dataset: { label?: string }; parsed: { y: number | null } }) => {
            const label = ctx.dataset.label || '';
            const val = ctx.parsed.y;
            if (val === null) return `${label}: —`;
            if (metric === 'growth') return `${label}: ${val}%`;
            return `${label}: ${addCommas(val)}`;
          },
        },
      },
      title: {
        display: true,
        text: getMetricLabel(metric),
        font: { size: 14, weight: 'normal' as const },
        padding: { bottom: 12 },
        color: CHART_TITLE_COLOR,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          font: { size: 11 },
          color: AXIS_TICK_COLOR,
          maxRotation: 0,
        },
      },
      y: {
        grid: { color: GRID_COLOR },
        ticks: {
          font: { size: 11 },
          color: AXIS_TICK_COLOR,
          callback: (value: string | number) => {
            const num = typeof value === 'string' ? parseFloat(value) : value;
            if (metric === 'growth') return `${num}%`;
            return addCommas(num);
          },
        },
      },
    },
    animation: false as const,
  }), [chartData, metric]);

  if (!chartData) return null;

  return (
    <div className="chart-section">
      <div className="chart-container" aria-label={`Comparison chart showing ${getMetricLabel(metric)} across locations`}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default ComparisonChart;
