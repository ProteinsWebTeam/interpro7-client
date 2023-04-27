import { createBrowserHistory as createHistory } from 'history';

import getInitialState from '.';

describe('getInitialState', () => {
  let history;

  beforeEach(() => {
    history = createHistory();
  });

  test('home', () => {
    expect(
      getInitialState({ history, basename: '/interpro/' }),
    ).toMatchSnapshot();
  });

  describe('browse', () => {
    test('entries', () => {
      history.replace('/entry/');
      expect(
        getInitialState({ history, basename: '/interpro/' }),
      ).toMatchSnapshot();
    });

    test('proteins', () => {
      history.replace('/protein/');
      expect(
        getInitialState({ history, basename: '/interpro/' }),
      ).toMatchSnapshot();
    });
  });

  describe('summary', () => {
    test('entry', () => {
      history.replace('/entry/InterPro/IPR000001/');
      expect(
        getInitialState({ history, basename: '/interpro/' }),
      ).toMatchSnapshot();
    });

    test('protein', () => {
      history.replace('/protein/reviewed/A0A023GPI8/');
      expect(
        getInitialState({ history, basename: '/interpro/' }),
      ).toMatchSnapshot();
    });
  });

  test('about', () => {
    history.replace('/about/');
    expect(
      getInitialState({ history, basename: '/interpro/' }),
    ).toMatchSnapshot();
  });
});
