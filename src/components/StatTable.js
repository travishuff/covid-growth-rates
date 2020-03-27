import React, { Fragment, useEffect, useMemo, useState } from 'react';
import DataRows from './DataRows'

const initialLocations = [
  'California',
  'United States'
];

function StatTable({ location, stats }) {
  const [showOlderData, setShowOlderData] = useState(false);
  const [showLocation, setShowLocation] = useState(false)

  const tableHeading = useMemo(() => (
    <tr className="table-heading">
      <td className="date">Date</td>
      <td className="cases">Total<br />cases</td>
      <td className="cases">New<br />cases</td>
      <td className="growth">Day-over<br />day</td>
      { showOlderData && <td className="growth">Rolling<br />3-day</td> }
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
        <div className="title" onClick={ () => setShowLocation(!showLocation) }>
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
                <td colSpan="3">show/hide more data</td>
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
