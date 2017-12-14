import * as actions from '.';
import * as types from '../types';

describe('actions', () => {
  describe('location', () => {
    test('should create an action to go to new location', () => {
      const expected = {
        type: types.NEW_NEW_LOCATION,
        location: 'new_location',
        replace: false,
      };
      expect(actions.goToNewLocation('new_location')).toEqual(expected);
    });

    test('should create an action to go to new location (processed)', () => {
      const newLocation = { description: { mainType: 'entry' } };
      const expected = {
        type: types.NEW_PROCESSED_NEW_LOCATION,
        newLocation,
      };
      expect(actions.newLocationChangeFromHistory(newLocation)).toEqual(
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

    // TODO: check problem. It seems like jsdom is not accepting "dataset" atm.
    test.skip('should create an action to change settings', () => {
      const category = 'my-category';
      const name = 'my-name';
      const value = 'my-value';
      const form = document.createElement('form');
      const input = document.createElement('input');
      input.value = value;
      input.name = name;
      console.log(form);
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

  describe('data', () => {
    const key = 'my-unique-url-as-key';
    const payload = { whatever: 'value' };

    test('should create an action to mark data as loading', () => {
      const expected = {
        type: types.LOADING_DATA,
        key,
      };
      expect(actions.loadingData(key)).toEqual(expected);
    });

    test('should create an action to mark data as loaded', () => {
      const status = 200;
      const ok = true;
      const expected = {
        type: types.LOADED_DATA,
        key,
        payload,
        status,
        ok,
      };
      expect(actions.loadedData(key, { payload, status, ok })).toEqual(
        expected,
      );
    });

    test('should create an action to mark progress data', () => {
      const progress = 0.5;
      const expected = {
        type: types.PROGRESS_DATA,
        key,
        progress,
      };
      expect(actions.progressData(key, progress)).toEqual(expected);
    });

    test('should create an action to unload data', () => {
      const expected = {
        type: types.UNLOADING_DATA,
        key,
      };
      expect(actions.unloadingData(key)).toEqual(expected);
    });

    test('should create an action to mark data as failed', () => {
      const error = new Error('A problem happened when loading data');
      const expected = {
        type: types.FAILED_LOADING_DATA,
        key,
        error,
      };
      expect(actions.failedLoadingData(key, error)).toEqual(expected);
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
