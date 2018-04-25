// @flow
import reducer, { descriptionSelector, mainDBLocationSelector } from '.';
import rootReducer from 'reducers';

import { NEW_PROCESSED_CUSTOM_LOCATION } from 'actions/types';
import getEmptyDescription from 'utils/processDescription/emptyDescription';

describe('reducer for location description', () => {
  let emptyDescription;

  beforeAll(() => (emptyDescription = getEmptyDescription()));

  test('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(emptyDescription);
  });

  test('should handle NEW_PROCESSED_CUSTOM_LOCATION action', () => {
    expect(
      reducer(emptyDescription, {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: { description: { main: { key: 'entry' } } },
      }),
    ).toEqual({ ...emptyDescription, main: { key: 'entry' } });
    expect(
      reducer(emptyDescription, {
        type: NEW_PROCESSED_CUSTOM_LOCATION,
        customLocation: { description: {} },
      }),
    ).toEqual(emptyDescription);
  });

  test('should ignore everything else', () => {
    expect(reducer(emptyDescription, {})).toBe(emptyDescription);
  });
});

describe('selectors', () => {
  describe('state selectors', () => {
    test('descriptionSelector', () => {
      const state = rootReducer(undefined, {});
      expect(descriptionSelector(state)).toBe(state.customLocation.description);
    });
  });

  describe('location selectors', () => {
    let emptyCustomLocation;

    beforeAll(() => {
      emptyCustomLocation = rootReducer(undefined, {}).customLocation;
    });

    beforeEach(() => {
      // need to do a shallow copy, so that the selector doesn't think it's the
      // same object in the different tests
      emptyCustomLocation = {
        ...emptyCustomLocation,
        description: getEmptyDescription(),
      };
    });

    test('should return null on home page', () => {
      expect(mainDBLocationSelector(emptyCustomLocation)).toBeNull();
    });

    test('should return null on about page', () => {
      emptyCustomLocation.description.other[0] = 'about';
      expect(mainDBLocationSelector(emptyCustomLocation)).toBeNull();
    });

    test('should return null on job page', () => {
      emptyCustomLocation.description.main.key = 'job';
      emptyCustomLocation.description.job.type = 'InterProScan';
      emptyCustomLocation.description.job.accession =
        'iprscan5-R12345678-123456-1234-12-es';
      expect(mainDBLocationSelector(emptyCustomLocation)).toBeNull();
    });

    test('should return the db on entry page', () => {
      const db = 'InterPro';
      emptyCustomLocation.description.main.key = 'entry';
      emptyCustomLocation.description.entry.db = db;
      emptyCustomLocation.description.entry.accession = 'IPR000001';
      expect(mainDBLocationSelector(emptyCustomLocation)).toBe(db);
    });

    test('should return the db on structure page', () => {
      const db = 'PDB';
      emptyCustomLocation.description.main.key = 'structure';
      emptyCustomLocation.description.structure.db = db;
      emptyCustomLocation.description.structure.accession = '2md0';
      expect(mainDBLocationSelector(emptyCustomLocation)).toBe(db);
    });
  });
});
