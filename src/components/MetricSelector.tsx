import { memo } from 'react';

export type Metric = 'newCases' | 'newDeaths' | 'growth';

const METRICS: { id: Metric; label: string }[] = [
  { id: 'newCases', label: 'New Cases' },
  { id: 'newDeaths', label: 'New Deaths' },
  { id: 'growth', label: 'Growth %' },
];

interface MetricSelectorProps {
  metric: Metric;
  onChange: (m: Metric) => void;
}

function MetricSelector({ metric, onChange }: MetricSelectorProps) {
  return (
    <div className="control-group" role="group" aria-label="Metric">
      {METRICS.map((m) => (
        <button
          key={m.id}
          className="control-btn"
          aria-pressed={metric === m.id}
          onClick={() => onChange(m.id)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default memo(MetricSelector);
