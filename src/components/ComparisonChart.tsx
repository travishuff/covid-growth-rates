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

const DEFAULT_LABEL_DENSITY = { max: 10, min: 6, tailGap: 1 };
const YEAR_LABEL_DENSITY = { max: 9, min: 6, tailGap: 4 };
const ALL_LABEL_DENSITY = { max: 10, min: 6, tailGap: 3 };
const MOBILE_LABEL_LIMITS = { max: 6, min: 4 };
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

function getLabelDensity(timeRange: TimeRange) {
  if (timeRange === 365) return YEAR_LABEL_DENSITY;
  if (timeRange === 0) return ALL_LABEL_DENSITY;
  return DEFAULT_LABEL_DENSITY;
}

function buildLabelIndexes(total: number, step: number, tailGap: number) {
  const labelIndexes = new Set<number>();
  for (let i = 0; i < total; i += step) {
    labelIndexes.add(i);
  }
  const lastIndex = total - 1;
  if (lastIndex >= 0) {
    labelIndexes.add(lastIndex);
    for (let i = 1; i <= tailGap; i += 1) {
      labelIndexes.delete(lastIndex - i);
    }
  }
  return labelIndexes;
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

    const density = getLabelDensity(timeRange);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
    const maxVisibleLabels = isMobile
      ? Math.min(density.max, MOBILE_LABEL_LIMITS.max)
      : density.max;
    const minVisibleLabels = isMobile
      ? Math.min(density.min, MOBILE_LABEL_LIMITS.min)
      : density.min;
    const maxStepForMin = Math.max(1, Math.floor(allDates.length / minVisibleLabels));
    const baseStep = Math.max(1, Math.floor(allDates.length / maxVisibleLabels));
    const step = Math.min(baseStep, maxStepForMin);
    const tailGap = timeRange === 90 ? 1 : Math.min(density.tailGap, step);
    const labelIndexes = buildLabelIndexes(allDates.length, step, tailGap);

    return {
      labels: allDates,
      datasets,
      _rawLabels: allDates,
      _labelIndexes: labelIndexes,
    };
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
          autoSkip: false,
          maxRotation: 0,
          callback: (_value: string | number, index: number) => {
            if (!chartData || !chartData._labelIndexes) return '';
            return chartData._labelIndexes.has(index)
              ? chartData._rawLabels[index] ?? ''
              : '';
          },
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
