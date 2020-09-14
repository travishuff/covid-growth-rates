import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { Line } from "react-chartjs-2";

import DataRows from './DataRows'

const initialLocations = [
  'California',
  'United States'
];

function StatTable({ location, stats }) {
  const [showOlderData, setShowOlderData] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const onClick = (e) => {
    setShowLocation(!showLocation);
  };

  const data = {
    labels: stats.map(stat => {
      if (stat[4] < 1000000) {
        return stat[0];
      }
    }),
    datasets: [
      {
        label: 'New Cases',
        data: stats.map(stat => {
          if (stat[4] < 55000) {
            return stat[4];
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
      { showOlderData && <td className="rolling-growth">Rolling<br />3-day</td> }
    </tr>
  ), [showOlderData]);

  useEffect(() => {
    if (initialLocations.includes(location)) {
      setShowLocation(true);
    }
  }, [location]);

  return (
    <Fragment>
      <header>
        <div className="title" onClick={ (e) => onClick(e) }>
          > { location }
        </div>
      </header>
      { showLocation &&
        <div>
          <table>
            <tbody>
              <tr
                className="older-toggle"
                onClick={ () => setShowOlderData(!showOlderData) }
                >
                <td colSpan="7">
                  <div>show/hide more data</div>
                  <div>
                    <Line data={data} />
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
