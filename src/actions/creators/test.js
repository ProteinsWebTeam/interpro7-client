// @flow
import * as actions from '.';
import * as types from '../types';

describe('actions', () => {
  describe('custom location', () => {
    const customLocation = { description: { main: { key: 'entry' } } };
    test('should create an action to go to new location', () => {
      const expected1 = {
        type: types.NEW_CUSTOM_LOCATION,
        customLocation,
        replace: false,
      };
      const expected2 = {
        type: types.NEW_CUSTOM_LOCATION,
        customLocation,
        replace: true,
      };
      expect(actions.goToCustomLocation(customLocation)).toEqual(expected1);
      expect(actions.goToCustomLocation(customLocation, false)).toEqual(
        expected1,
      );
      expect(actions.goToCustomLocation(customLocation, true)).toEqual(
        expected2,
      );
    });

    test('should create an action to go to new location (processed)', () => {
      const expected = {
        type: types.NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation,
      };
      expect(actions.customLocationChangeFromHistory(customLocation)).toEqual(
        expected,
      );
    });
  });

  describe('UI', () => {
    describe('EMBL map', () => {
      test('should create an action to toggle EMBL map nav', () => {
        const expected = {
          type: types.TOGGLE_EMBL_MAP_NAV,
        };
        expect(actions.toggleEMBLMapNav()).toEqual(expected);
      });

      test('should create an action to open EMBL map nav', () => {
        const expected = {
          type: types.TOGGLE_EMBL_MAP_NAV,
          status: 'open',
        };
        expect(actions.openEMBLMapNav()).toEqual(expected);
      });

      test('should create an action to close EMBL map nav', () => {
        const expected = {
          type: types.TOGGLE_EMBL_MAP_NAV,
          status: 'close',
        };
        expect(actions.closeEMBLMapNav()).toEqual(expected);
      });
    });

    describe('side nav', () => {
      test('should create an action to toggle side nav', () => {
        const expected = {
          type: types.TOGGLE_SIDE_NAV,
        };
        expect(actions.toggleSideNav()).toEqual(expected);
      });

      test('should create an action to open side nav', () => {
        const expected = {
          type: types.TOGGLE_SIDE_NAV,
          status: 'open',
        };
        expect(actions.openSideNav()).toEqual(expected);
      });

      test('should create an action to close side nav', () => {
        const expected = {
          type: types.TOGGLE_SIDE_NAV,
          status: 'close',
        };
        expect(actions.closeSideNav()).toEqual(expected);
      });
    });

    test('should create an action to close everything', () => {
      const expected = {
        type: types.CLOSE_EVERYTHING,
      };
      expect(actions.closeEverything()).toEqual(expected);
    });

    describe('sticky header', () => {
      test('should create an action to stick the header', () => {
        const expected = {
          type: types.STUCK,
        };
        expect(actions.stick()).toEqual(expected);
      });

      test('should create an action to unstick the header', () => {
        const expected = {
          type: types.UNSTUCK,
        };
        expect(actions.unstick()).toEqual(expected);
      });
    });
  });

  describe('settings', () => {
    test('should create an action to change page size', () => {
      const expected = {
        type: types.CHANGE_SETTINGS,
        category: 'pagination',
        key: 'pageSize',
        value: 40,
      };
      expect(actions.changePageSize('40')).toEqual(expected);
      // eslint-disable-next-line no-magic-numbers
      expect(actions.changePageSize(40)).toEqual(expected);
    });

    test('should create an action to change settings', () => {
      const category = 'my-category';
      const name = 'my-name';
      const value = 'my-value';
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.value = value;
      input.name = name;
      form.dataset.category = category;
      form.appendChild(input);
      const expected = {
        type: types.CHANGE_SETTINGS,
        category,
        key: name,
        value,
      };
      expect(actions.changeSettings({ target: input })).toEqual(expected);
    });

    test('should create an action to reset settings', () => {
      const defaultSettings = { whatever: 'value' };
      const expectedwithValue = {
        type: types.RESET_SETTINGS,
        value: defaultSettings,
      };
      const expectedwithoutValue = { type: types.RESET_SETTINGS };
      expect(actions.resetSettings(defaultSettings)).toEqual(expectedwithValue);
      expect(actions.resetSettings()).toEqual(expectedwithoutValue);
    });
  });

  describe('data progress', () => {
    test('should create an action to add/update progress information', () => {
      const PROGRESS = 0.5;
      expect(actions.dataProgressInfo('id1', PROGRESS, 1)).toEqual({
        type: types.PROGRESS_DATA,
        key: 'id1',
        progress: PROGRESS,
        weight: 1,
      });
    });
    test('should create an action to remove progress information', () => {
      expect(actions.dataProgressUnload('id1')).toEqual({
        type: types.UNLOAD_DATA,
        key: 'id1',
      });
    });
  });

  describe('toast messages', () => {
    const id = '12345';

    test('should create an action to add a toast', () => {
      const toast = { whatever: 'info' };
      const expected = {
        type: types.ADD_TOAST,
        id,
        toast,
      };
      expect(actions.addToast(toast, id)).toEqual(expected);
    });

    test('should create an action to remove a toast', () => {
      const expected = {
        type: types.REMOVE_TOAST,
        id,
      };
      expect(actions.removeToast(id)).toEqual(expected);
    });
  });
});
