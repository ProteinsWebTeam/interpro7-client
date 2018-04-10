// @flow
import loadResource from '.';

describe('loadResource', () => {
  const url = '//www.example.com/script.js';
  let resource;

  test('first time', async () => {
    resource = loadResource(url);
    expect(resource).toBeInstanceOf(Promise);
    if (document.head) {
      expect(document.head.innerHTML).toMatch(
        `<script type="text/javascript" src="${url}"></script>`,
      );
    }
  });

  test('second time', async () => {
    const resource2ndLoad = loadResource(url);
    expect(resource2ndLoad).toBe(resource);
  });
});
