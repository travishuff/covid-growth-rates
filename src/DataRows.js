import React, { Fragment } from 'react';

function DataRows({ data }) {
  let prev = 0

  return (
    <Fragment>
      { data && data.map(([date, numCases]) => {
        const el = numCases > 0 && (
          <tr key={ `${date}${numCases}` }>
            <td className="date">{ date }</td>
            <td className="cases">{ numCases }</td>
            <td className="growth">{ prev !== 0 && Math.round((numCases/prev - 1) * 100) }%</td>
          </tr>
        );
        prev = numCases;
        return el;
      }) }
    </Fragment>
  );
}

export default DataRows;
