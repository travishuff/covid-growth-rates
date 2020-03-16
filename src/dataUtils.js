export function getCali(json) {
  const cali = json.locations.filter(item => item.province === 'California')[0].history;

  return Object.entries(cali)
  .map(([date, number]) => [date, number])
  .sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  });
}


export function getUS(json) {
  const US = json.locations.filter(item => item.country_code === 'US');

  const totalsForUS = Object.entries(US)
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

  const targetDate = new Date('3/9/20');
  return Object.entries(totalsForUS)
  .map(([date, number]) => [date, number])
  .sort((a, b) => {
    return new Date(a[0]) - new Date(b[0]);
  })
  .filter(item => {
    const itemDate = new Date(item[0]);
    return itemDate > targetDate;
  });
}