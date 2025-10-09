import { render, screen } from '@testing-library/react';
import App from './App';

test('renders characters link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Characters/i);
  expect(linkElement).toBeInTheDocument();
});
