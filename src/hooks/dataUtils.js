const TARGET_DATE = new Date('1/1/20');

function transformData(totals) {
  let prev = 0;
  const growthNumbers = [];

  const dataArr = Object.entries(totals)
  .sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  })
  .filter(item => {
    const itemDate = new Date(item[0]);
    return itemDate > TARGET_DATE;
  })
  .map(([date, totalCases]) => {
    const growthNum = prev !== 0 ? Math.round((totalCases/prev - 1) * 100) : 0;
    growthNumbers.push(growthNum);
    const growth = prev !== 0 ? `${growthNum}%` : 'n/a';
    const newCases = totalCases - prev;
    prev = totalCases;

    return [
      date,
      totalCases,
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

  return dataArr.map(([date, totalCases, newCases, growth]) => {
    return [
      date,
      totalCases,
      newCases,
      growth,
      rollingAverageArray.shift(),
    ]
  });
}


export function getState(state, json) {
  const stateData = json.locations.filter(item => item.province === state)[0].history;

  return transformData(stateData);
}


export function getCountry(country, json) {
  const countryData = json.locations.filter(item => item.country_code === country);

  const totals = Object.entries(countryData)
  .reduce((all, item) => {
    const historyArr = Object.entries(item[1].history);

    historyArr.forEach(([date, number]) => {
      if (!all[`${date}`]) {
        all[`${date}`] = number;
      } else {
        all[`${date}`] += number;
      }
    });
    return all;
  }, {});

  return transformData(totals);
}