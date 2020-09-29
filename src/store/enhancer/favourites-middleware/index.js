import { MARK_FAVOURITE, UNMARK_FAVOURITE } from 'actions/types';
import getTableAccess, { FavEntries } from 'storage/idb';

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

const middleware /*: Middleware<*, *, *> */ = () => {
  return (next) => async (action) => {
    switch (action.type) {
      case MARK_FAVOURITE:
        await createEntryInDB(action.id, action.content);
        break;
      case UNMARK_FAVOURITE:
        await deleteEntryInDB(action.id);
        break;
      default:
        break;
    }
    return next(action);
  };
};

export default middleware;
