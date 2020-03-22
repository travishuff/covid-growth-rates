const TARGET_DATE = new Date('1/1/20');

function transformData(totals) {
  let prev = 0;
  return Object.entries(totals)
  .sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  })
  .filter(item => {
    const itemDate = new Date(item[0]);
    return itemDate > TARGET_DATE;
  })
  .map(([date, totalCases]) => {
    const growth = prev !== 0 ? `${Math.round((totalCases/prev - 1) * 100)}%` : 'n/a';
    const newCases = totalCases - prev;
    prev = totalCases;

    return [
      date,
      totalCases,
      newCases,
      growth,
    ];
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