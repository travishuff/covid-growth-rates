import { memo } from 'react';
import type { StatRow } from '../hooks/dataUtils';
import { addCommas } from '../hooks/dataUtils';

const VISIBLE_ROWS = 30;

interface DetailTableProps {
  location: string;
  stats: StatRow[];
}

function DetailTable({ location, stats }: DetailTableProps) {
  const rows = stats.slice(-VISIBLE_ROWS).reverse();

  return (
    <div className="detail-section">
      <div className="detail-heading">{location}</div>
      <table className="detail-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">New Cases</th>
            <th scope="col">New Deaths</th>
            <th scope="col">Growth</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.date}>
              <td>{row.date}</td>
              <td>{addCommas(row.newCases)}</td>
              <td>{addCommas(row.newDeaths)}</td>
              <td>{row.dayOverDay}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default memo(DetailTable);
