import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';

import { GeneralWarning, MAX_MESSAGE_LENGTH } from '.';

const renderer = new ShallowRenderer();

const textHeaders = new Headers({ 'content-type': 'text/plain' });
const htmlHeaders = new Headers({ 'content-type': 'text/html' });

const render = (data) => {
  renderer.render(<GeneralWarning data={data} />);
  return renderer.getRenderOutput();
};

describe('<GeneralWarning />', () => {
  test('shows the message it is given', () => {
    expect(
      render({
        status: 200,
        headers: textHeaders,
        payload: 'InterPro will be unavailable on Sunday.',
      }),
    ).toMatchSnapshot();
  });

  test('shows nothing for an empty file', () => {
    expect(render({ status: 200, headers: textHeaders, payload: '  \n' })).toBe(
      null,
    );
  });

  test('shows nothing when the request failed', () => {
    expect(
      render({ status: 404, headers: textHeaders, payload: 'Not Found' }),
    ).toBe(null);
  });

  // The SPA fallback answers 200 with index.html for any unknown path, so a
  // missing warning file used to render a whole HTML document as the banner.
  test('shows nothing when served the app shell instead of the file', () => {
    expect(
      render({
        status: 200,
        headers: htmlHeaders,
        payload: '<!doctype html><html lang="en-GB"><head>…</head></html>',
      }),
    ).toBe(null);
  });

  test('shows nothing for markup served without a content type', () => {
    expect(
      render({
        status: 200,
        headers: new Headers(),
        payload: '<!doctype html><html lang="en-GB"></html>',
      }),
    ).toBe(null);
  });

  test('shows nothing for a body too long to be a banner', () => {
    expect(
      render({
        status: 200,
        headers: textHeaders,
        payload: 'a'.repeat(MAX_MESSAGE_LENGTH + 1),
      }),
    ).toBe(null);
  });
});
