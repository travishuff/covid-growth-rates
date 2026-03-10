import { addCommas, getState, getCountry } from './dataUtils';

describe('addCommas', () => {
  it('formats numbers over 1 million as M', () => {
    expect(addCommas(1500000)).toBe('1.50M');
    expect(addCommas(2000000)).toBe('2.00M');
  });

  it('formats numbers over 100k as k (no decimal)', () => {
    expect(addCommas(150000)).toBe('150k');
    expect(addCommas(999999)).toBe('1000k');
  });

  it('formats numbers over 10k as k (one decimal)', () => {
    expect(addCommas(15000)).toBe('15.0k');
    expect(addCommas(99999)).toBe('100.0k');
  });

  it('formats small numbers with comma separators', () => {
    expect(addCommas(1234)).toBe('1,234');
    expect(addCommas(999)).toBe('999');
    expect(addCommas(0)).toBe('0');
  });
});

describe('getCountry', () => {
  const mockCountryJson = {
    timeline: {
      cases: {
        '3/7/20': 500,
        '3/8/20': 600,
        '3/9/20': 800,
        '3/10/20': 1000,
        '3/11/20': 1300,
      },
      deaths: {
        '3/7/20': 5,
        '3/8/20': 8,
        '3/9/20': 12,
        '3/10/20': 18,
        '3/11/20': 25,
      },
    },
  };

  it('returns an array of data rows', () => {
    const result = getCountry(mockCountryJson);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('each row has 7 elements: date, deaths, deathGrowth, cases, newCases, growth, rollingAvg', () => {
    const result = getCountry(mockCountryJson);
    result.forEach(row => {
      expect(row).toHaveLength(7);
    });
  });

  it('filters out entries before 3/8/20', () => {
    const result = getCountry(mockCountryJson);
    // 3/7/20 is before 3/8/20 (1583654400000), so it should be excluded
    const dates = result.map(row => row[0]);
    expect(dates).not.toContain('3/7/20');
  });

  it('calculates new cases correctly', () => {
    const result = getCountry(mockCountryJson);
    // 3/9/20: 800 - 600 = 200 new cases
    const march9 = result.find(row => row[0] === '3/9/20');
    expect(march9).toBeDefined();
    expect(march9![4]).toBe(200);
  });

  it('calculates death growth correctly', () => {
    const result = getCountry(mockCountryJson);
    // 3/9/20: 12 - 8 = 4 new deaths
    const march9 = result.find(row => row[0] === '3/9/20');
    expect(march9![2]).toBe(4);
  });
});

describe('getState', () => {
  const mockStateJson = [
    { date: 20200315, positive: 1000, death: 10 },
    { date: 20200314, positive: 800, death: 8 },
    { date: 20200313, positive: 600, death: 5 },
    { date: 20200312, positive: 400, death: 3 },
    { date: 20200311, positive: 200, death: 1 },
    { date: 20200310, positive: 100, death: 0 },
    // before the 3/8/20 cutoff
    { date: 20200307, positive: 50, death: 0 },
  ];

  it('returns an array of data rows', () => {
    const result = getState(mockStateJson);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters out entries before 3/8/20 (date < 20200308)', () => {
    const result = getState(mockStateJson);
    const dates = result.map(row => row[0]);
    // 3/7/20 should be excluded (20200307 < 20200308)
    expect(dates).not.toContain('03/07/20');
  });

  it('each row has 7 elements', () => {
    const result = getState(mockStateJson);
    result.forEach(row => {
      expect(row).toHaveLength(7);
    });
  });
});
