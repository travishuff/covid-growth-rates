export type TimeRange = 90 | 365 | 0;

const RANGES: { id: TimeRange; label: string }[] = [
  { id: 90, label: '90 days' },
  { id: 365, label: '1 year' },
  { id: 0, label: 'All' },
];

interface TimeRangeSelectorProps {
  range: TimeRange;
  onChange: (r: TimeRange) => void;
}

function TimeRangeSelector({ range, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="control-group" role="group" aria-label="Time range">
      {RANGES.map((r) => (
        <button
          key={r.id}
          className="control-btn"
          aria-pressed={range === r.id}
          onClick={() => onChange(r.id)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export default TimeRangeSelector;
