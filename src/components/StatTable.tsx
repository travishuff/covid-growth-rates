import { Fragment, useMemo, useState } from 'react';
import type { StatRow } from '../hooks/dataUtils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

import DataRows from './DataRows'

const initialLocations = [
  // 'California',
  'United States'
];

const EDGE_LIMIT = 450000;

function StatTable({ location, stats }: { location: string, stats: StatRow[] }) {
  const [showOlderData, setShowOlderData] = useState(false);
  const [showLocation, setShowLocation] = useState(() => initialLocations.includes(location));

  const toggleLocation = () => {
    setShowLocation((prev) => !prev);
  };

  const toggleOlderData = () => {
    setShowOlderData((prev) => !prev);
  };

  const locationSlug = useMemo(() => {
    return location
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-+|-+$)/g, '');
  }, [location]);

  const tableSectionId = `stats-${locationSlug}`;
  const rowsId = `rows-${locationSlug}`;

  const newCasesData = {
    labels: stats.map(stat => stat.date),
    datasets: [
      {
        label: 'New Cases',
        data: stats.map(stat => {
          if (stat.newCases < EDGE_LIMIT) { // get rid of some incorrect edge cases
            return stat.newCases;
          } else {
            return 0;
          }
        }),
        fill: true,
        backgroundColor: 'rgba(144, 238, 144, 0.2)',
        borderColor: 'rgba(144, 238, 144, 1)',
        pointRadius: 0,
        // options: {
        //   scales: {
        //     yAxes: [{
        //         ticks: {
        //             min: 50,
        //             max: 100000,
        //         },
        //     }],
        //   },
        // },
      },
    ],
  };

  const tableHeading = useMemo(() => (
    <tr className="table-heading">
      <th scope="col" className="date">Date</th>
      <th scope="col" className="death-cases">Total<br />deaths</th>
      <th scope="col" className="death-growth-cases">New<br />deaths</th>
      <th scope="col" className="cases">Total<br />cases</th>
      <th scope="col" className="cases">New<br />cases</th>
      <th scope="col" className="growth">Day-over<br />day</th>
      { showOlderData && <th scope="col" className="rolling-growth">3-day</th> }
    </tr>
  ), [showOlderData]);

  const sevenDayDeathChange = (((stats[stats.length - 1].totalDeaths / stats[stats.length - 15].totalDeaths) - 1) * 100).toFixed()
  const sevenDayCasesChange = (((stats[stats.length - 1].totalCases / stats[stats.length - 15].totalCases) - 1) * 100).toFixed()

  return (
    <Fragment>
      <header>
        <button
          type="button"
          className="title"
          onClick={ toggleLocation }
          aria-expanded={ showLocation }
          aria-controls={ tableSectionId }
        >
          &gt; { location }
        </button>
        <div className="fourteenDay">14-day change in deaths: { sevenDayDeathChange }%</div>
        <div className="fourteenDay">14-day change in cases: { sevenDayCasesChange }%</div>
      </header>
      { showLocation &&
        <section id={ tableSectionId }>
          <table>
            <caption className="sr-only">Daily COVID-19 statistics for { location }</caption>
            <thead>
              { tableHeading }
            </thead>
            <tbody id={ rowsId }>
              <tr>
                <td className="toggle-cell" colSpan={ showOlderData ? 7 : 6 }>
                  <button
                    type="button"
                    className="older-toggle"
                    onClick={ toggleOlderData }
                    aria-expanded={ showOlderData }
                    aria-controls={ rowsId }
                  >
                    show/hide more data
                  </button>
                  <div className="sparkline" aria-hidden="true">
                    <Line data={newCasesData} />
                  </div>
                </td>
              </tr>
              { stats &&
                <DataRows stats={ stats } showOlderData={ showOlderData } /> }
            </tbody>
          </table>
          </section> }
    </Fragment>
  );
}

export default StatTable;
