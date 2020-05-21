import React from 'react';
import { render } from '@testing-library/react';
import App from './components/App';

test('renders title on main page', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/COVID-19 Growth Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
