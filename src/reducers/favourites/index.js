import {
  SET_INITIAL_FAVOURITES,
  MARK_FAVOURITE,
  UNMARK_FAVOURITE,
} from 'actions/types';
import getTableAccess, { FavEntries } from 'storage/idb';
import { askNotificationPermission } from 'utils/browser-notifications';

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
      askNotificationPermission();

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
    default:
      return state;
  }
};
