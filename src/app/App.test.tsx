import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { App, compare, channels } from './App';
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { API_KEY } from '../config/conf';

/* Mock Telegram API */
const bigFileId = 123;
const chatMembers = 42;
const server = setupServer(...[
    ...channels.map(c => rest.get(`https://api.telegram.org/bot${API_KEY}/getChat?chat_id=${c.username}`, (req, res, ctx) =>
      res(ctx.json({
        result: { photo: { big_file_id: bigFileId } }
      }))
    )),
    rest.get(`https://api.telegram.org/bot${API_KEY}/getFile?file_id=${bigFileId}`, (req, res, ctx) => {
      return res(ctx.json({
        result: { file_path: 'mock_path.png' }
      }))
    }),
    ...channels.map(c => rest.get(`https://api.telegram.org/bot${API_KEY}/getChatMembersCount?chat_id=${c.username}`, (req, res, ctx) =>
      res(ctx.json({
        result: chatMembers
      }))
    )),
  ]
);

describe('App', () => {

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  test('renders App loading', () => {
    const { getByText } = render(<App />);
    const linkElement = getByText(/loading/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('wait http request', async() => {
    const { getByText } = render(<App />);
    waitForElement(() => getByText(/dminews/i));
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
