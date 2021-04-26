import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Line } from "react-chartjs-2";

import DataRows from './DataRows'

const initialLocations = [
  // 'California',
  'United States'
];

const EDGE_LIMIT = 450000;

function StatTable({ location, stats }: { location: string, stats: [] }) {
  const [showOlderData, setShowOlderData] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const onClick = (e: any) => {
    setShowLocation(!showLocation);
  };

  const newCasesData = {
    labels: stats.map(stat => stat[0]),
    datasets: [
      {
        label: 'New Cases',
        data: stats.map(stat => {
          if (stat[4] < EDGE_LIMIT) { // get rid of some incorrect edge cases
            return stat[4];
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
      <td className="date">Date</td>
      <td className="death-cases">Total<br />deaths</td>
      <td className="death-growth-cases">New<br />deaths</td>
      <td className="cases">Total<br />cases</td>
      <td className="cases">New<br />cases</td>
      <td className="growth">Day-over<br />day</td>
      { showOlderData && <td className="rolling-growth">3-day</td> }
    </tr>
  ), [showOlderData]);

  useEffect(() => {
    if (initialLocations.includes(location)) {
      setShowLocation(true);
    }
  }, [location]);

  const sevenDayDeathChange = (((stats[stats.length - 1][1]/stats[stats.length - 15][1]) - 1) * 100).toFixed()
  const sevenDayCasesChange = (((stats[stats.length - 1][3]/stats[stats.length - 15][3]) - 1) * 100).toFixed()

  return (
    <Fragment>
      <header>
        <div className="title" onClick={ (e) => onClick(e) }>
          &gt; { location }
        </div>
        <div className="fourteenDay">14-day change in deaths: { sevenDayDeathChange }%</div>
        <div className="fourteenDay">14-day change in cases: { sevenDayCasesChange }%</div>
      </header>
      { showLocation &&
        <div>
          <table>
            <tbody>
              <tr
                className="older-toggle"
                onClick={ () => setShowOlderData(!showOlderData) }
                >
                <td colSpan={ showOlderData ? 7 : 6 }>
                  <div>show/hide more data</div>
                  <div>
                    <Line data={newCasesData} />
                  </div>
                </td>
              </tr>
              { tableHeading }
              { stats &&
                <DataRows stats={ stats } showOlderData={ showOlderData } /> }
            </tbody>
          </table>
          </div> }
    </Fragment>
  );
}

export default StatTable;
