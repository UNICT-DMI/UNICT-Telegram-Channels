import React from 'react';
import { render } from '@testing-library/react';
import { App, compare } from './App';

describe('App', () => {
  test('renders App loading', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/loading/i);
    expect(linkElement).toBeInTheDocument();
  });
});

test('compare', () => {
  for(const test of [
    { c1: { username: 'mock1', subscribers: 0, img: '' }, c2: { username: 'mock2', subscribers: 0, img: '' }, output:  0 },
    { c1: { username: 'mock1', subscribers: 1, img: '' }, c2: { username: 'mock2', subscribers: 0, img: '' }, output: -1 },
    { c1: { username: 'mock1', subscribers: 0, img: '' }, c2: { username: 'mock2', subscribers: 1, img: '' }, output:  1 },
  ]) {
    expect(compare(test.c1, test.c2)).toBe(test.output);
  }
});
