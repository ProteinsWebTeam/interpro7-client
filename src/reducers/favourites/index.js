import {
  SET_INITIAL_FAVOURITES,
  MARK_FAVOURITE,
  UNMARK_FAVOURITE,
  VERSION_CHANGED,
} from 'actions/types';
import getTableAccess, { FavEntries } from 'storage/idb';
import { isEqual, omit } from 'lodash-es';
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

const checkContents = async () => {
  const favTable = await favTA;
  const storedContent = await favTable.getAll();
  const entries = Object.entries(storedContent);
  entries.forEach(([key, value]) => {
    fetch(`https://www.ebi.ac.uk/interpro/api/entry/interpro/${key}`).then(
      (response) => {
        if (response.ok) {
          response.json().then((json) => {
            // TODO exclude counters
            const check = isEqual(
              omit(value, ['counters', 'overlaps_with', 'cross_references']),
              omit(json, ['counters', 'overlaps_with', 'cross_references']),
            );
            if (!isEqual(value, json)) {
              createNotification(
                'InterPro',
                `Your favourite entry ${key} has got new changes since the last version`,
              );
              // favTable.set(json, key);

              // notification.onclick = () => {
              //   window.open(
              //     `${window.location.origin}/interpro/result/InterProScan/${
              //       meta.remoteID || ''
              //     }`,
              //     '_blank',
              //   );
              // };
            }
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
