import React, { Fragment, useMemo, useState } from 'react';
import DataRows from './DataRows'

function StatTable({
  error,
  loading,
  location,
  stats,
}) {
  const [showOlderData, setShowOlderData] = useState(false);

  const tableHeading = useMemo(() => (
    <tr className="table-heading">
      <td className="date">Date</td>
      <td className="cases"># cases</td>
      <td className="growth">Day over day growth rate</td>
    </tr>
  ), []);

  return (
    <Fragment>
      <header>
        <div className="title">
          { location }
        </div>
      </header>
      <div>
        { loading &&
        <div>Loading data...</div> }

        { error &&
        <div>Error occured getting data.</div> }

        <table>
          <tbody>
            <tr
              className="older-toggle"
              onClick={ () => setShowOlderData(!showOlderData) }
              >
              <td colSpan="3">show/hide older data</td>
            </tr>
            { tableHeading }
            { stats &&
              <DataRows stats={ stats } showOlderData={ showOlderData } /> }
          </tbody>
        </table>
      </div>
    </Fragment>
  );
}

export default StatTable;
