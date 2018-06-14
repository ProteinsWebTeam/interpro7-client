// @flow
import ShallowRenderer from 'react-test-renderer/shallow';

import getServerMessage from '.';

describe('server-message', () => {
  test('should render', () => {
    // eslint-disable-next-line no-magic-numbers
    for (const status of [204, 400, 404, 408, 500]) {
      expect(getServerMessage(status)).toMatchSnapshot();
    }
  });

  // `undefined` if OK, or not a valid status
  test("shouldn't render", () => {
    // eslint-disable-next-line no-magic-numbers
    for (const status of [200, 999]) {
      expect(getServerMessage(status)).toBeUndefined();
    }
  });
});
