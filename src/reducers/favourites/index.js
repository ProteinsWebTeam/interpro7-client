import {
  SET_INITIAL_FAVOURITES,
  MARK_FAVOURITE,
  UNMARK_FAVOURITE,
  VERSION_CHANGED,
} from 'actions/types';
import getTableAccess, { FavEntries } from 'storage/idb';
import { isEqual, sortBy } from 'lodash-es';
import { createNotification } from 'utils/browser-notifications';

const favTA = getTableAccess(FavEntries);

const deleteEntryInDB = async (id) => {
  const favT = await favTA;
  favT.delete(id);
};

const createEntryInDB = async (id, content) => {
  try {
    // add entry to idb
    const favT = await favTA;
    await favT.set(content, id);
  } catch {
    // cleanup if anything bad happens
    await deleteEntryInDB(id);
  }
};

const compare = (stored, fetched) => {
  const diff = [];
  const keys = [
    'type',
    'name',
    'description',
    'member_databases',
    'literature',
    'go_terms',
  ];
  keys.forEach((k) => {
    if (
      ['name', 'type', 'description', 'member_databases'].includes(k) &&
      !isEqual(stored[k], fetched[k])
    )
      diff.push(k);

    if (k === 'literature') {
      Object.entries(stored[k]).forEach(([key, value]) => {
        stored[k][key] = { ...value, authors: value.authors.sort() };
      });
      Object.entries(fetched[k]).forEach(([key, value]) => {
        fetched[k][key] = { ...value, authors: value.authors.sort() };
      });
      if (!isEqual(stored[k], fetched[k])) diff.push(k);
    }

    if (k === 'go_terms') {
      if (
        !isEqual(
          sortBy(stored[k], 'identifier'),
          sortBy(fetched[k], 'identifier'),
        )
      )
        diff.push(k);
    }
  });
  return diff;
};

const checkContents = async () => {
  const favTable = await favTA;
  const storedContent = await favTable.getAll();
  const entries = Object.entries(storedContent);
  entries.forEach(([key, value]) => {
    fetch(`https://www.ebi.ac.uk/interpro/api/entry/interpro/${key}`).then(
      (response) => {
        if (response.ok) {
          response.json().then((json) => {
            const differences = compare(value.metadata, json.metadata);
            if (differences.length > 0) {
              const notification = createNotification(
                'InterPro',
                `There has been changes detected in your favourite entry ${key} in the new version of InterPro data`,
              );

              notification.onclick = () => {
                window.open(
                  `${window.location.origin}/interpro/entry/InterPro/${key}/`,
                  '_blank',
                );
              };
            }

            /* Updating the IndexedDB content anyway because the favourite entries in home page use the IDB data. If there
            are changes in counters, it will be misleading to show old data from previous version.
             */
            favTable.update(key, (prev) => ({ ...prev, ...json }));
          });
        }
      },
    );
  });
};

const initialFavState = {
  entries: [],
};

export default (
  state /*: Object */ = initialFavState,
  action /*: Object */,
) => {
  switch (action.type) {
    case SET_INITIAL_FAVOURITES:
      return {
        ...state,
        entries: [...action.favourites],
      };
    case MARK_FAVOURITE:
      createEntryInDB(action.id, action.content);
      return {
        ...state,
        entries: [...state.entries, action.id],
      };
    case UNMARK_FAVOURITE:
      deleteEntryInDB(action.id);
      return {
        ...state,
        entries: [...state.entries.filter((item) => item !== action.id)],
      };
    case VERSION_CHANGED:
      checkContents();
      return state;
    default:
      return state;
  }
};
