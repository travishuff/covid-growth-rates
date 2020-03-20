import React, { Fragment } from 'react';

function DataRows({ stats, showOlderData = false }) {
  const recentStats = stats.slice(0).splice(-5);

  return (
    <Fragment>
      { showOlderData && stats.map(([date, numCases, growthRate]) => {
        const el = numCases > 0 && (
          <tr key={ `${date}${numCases}` }>
            <td className="date">{ date }</td>
            <td className="cases">{ numCases }</td>
            <td className="growth">
              { growthRate }
            </td>
          </tr>
        );
        return el;
      }) }
      { !showOlderData && recentStats.map(([date, numCases, growthRate]) => {
        const el = numCases > 0 && (
          <tr key={ `${date}${numCases}` }>
            <td className="date">{ date }</td>
            <td className="cases">{ numCases }</td>
            <td className="growth">
              { growthRate }
            </td>
          </tr>
        );
        return el;
      }) }
    </Fragment>
  );
}

export default DataRows;
