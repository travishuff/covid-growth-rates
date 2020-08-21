export function addCommas(num) {
  if (num > 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num === null) return;

  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

function transformData(timelineData) {
  let prev = 0;
  const growthNumbers = [];
  let prevDeaths = 0;

  const dataArr = Object.entries(timelineData)
  .map(([date, casesObj]) => {
    const growthNum = prev !== 0 ? Math.round((casesObj.affected/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);
    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = casesObj.affected - prev;
    prev = casesObj.affected;

    const deathGrowth = prevDeaths !== 0 ? casesObj.deaths - prevDeaths : 0;
    prevDeaths = casesObj.deaths;

    return [
      date,
      casesObj.deaths,
      deathGrowth,
      casesObj.affected,
      newCases,
      growth,
    ];
  });

  const threeDay = [];
  const rollingAverageArray = growthNumbers.map(item => {
    threeDay.push(item);
    if (threeDay.length > 3) threeDay.shift();

    return threeDay.length === 3
    ? `${Math.round((threeDay.reduce((all, item) => all += item)) / 3)}%`
    : 'n/a';
  });

  return dataArr.map(([date, totalDeaths, deathGrowth, totalCases, newCases, growth]) => {
    return [
      date,
      totalDeaths,
      deathGrowth,
      totalCases,
      newCases,
      growth,
      rollingAverageArray.shift(),
    ]
  });
}


export function getState(json) {
  const stateData = json.reduce((all, item) => {
    all[item.date] = { affected: item.positive, deaths: item.death };
    return all;
  }, {});

  const stateDataModifiedDate = Object.entries(stateData).reduce((all, [date, numCases]) => {
    const newDate = date.toString();
    const year = newDate.slice(0, 2);
    const month = newDate.slice(4, 6);
    const day = newDate.slice(6);
    const formattedDate = `${month}/${day}/${year}`
    all[formattedDate] = numCases;
    return all;
  }, {});

  return transformData(stateDataModifiedDate);
}


export function getCountry(json) {
  const casesObj = json.timeline.cases;
  const deathsObj = json.timeline.deaths;
  let timelineData = {};
  Object.entries(casesObj).forEach(([date, cases]) => {
    timelineData[date] = {
      affected: cases,
      deaths: deathsObj[date],
    };
  });

  return transformData(timelineData);
}