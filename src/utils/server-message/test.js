// @flow
import ShallowRenderer from 'react-test-renderer/shallow';

import getServerMessage from '.';

const renderer = new ShallowRenderer();

describe('server-message', () => {
  test('should render', () => {
    for (const status of [204, 400, 404, 408, 500]) {
      expect(getServerMessage(status)).toMatchSnapshot();
    }
  });

  // `undefined` if OK, or not a valid status
  test("shouldn't render", () => {
    for (const status of [200, 999]) {
      expect(getServerMessage(status)).toBeUndefined();
    }
  });
});
