// @flow
import idb from 'idb';
/*:: import type { DB } from 'idb'; */

let initialized = false;
let dbPromise;
let tableAccesses;

export const IPScanJobsMeta = 'IPScan-jobs-meta';
export const IPScanJobsData = 'IPScan-jobs-data';

const init = () => {
  dbPromise = idb.open('InterPro', 1, upgradeDb => {
    // do not put 'break;', keep fall-through,
    // it is to apply all the updates, one after the other
    // eslint-disable-next-line default-case
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore(IPScanJobsMeta, { autoIncrement: true });
        upgradeDb.createObjectStore(IPScanJobsData, { autoIncrement: true });
    }
  });
  tableAccesses = new Map();
  initialized = true;
};

class TableAccess {
  /*::
    _table: string;
    _db: DB;
  */
  constructor(table, db) {
    this._table = table;
    this._db = db;
  }

  async get(key) {
    return this._db
      .transaction(this._table)
      .objectStore(this._table)
      .get(key);
  }

  async set(value, key) {
    const tr = this._db.transaction(this._table, 'readwrite');
    const dbKey = await tr.objectStore(this._table).put(value, key);
    await tr.complete;
    return dbKey;
  }

  async update(key, updater) {
    const before = await this.get(key);
    return this.set(updater(before), key);
  }

  async delete(key) {
    const tr = this._db.transaction(this._table, 'readwrite');
    tr.objectStore(this._table).delete(key);
    return tr.complete;
  }

  async clear() {
    const tr = this._db.transaction(this._table, 'readwrite');
    tr.objectStore(this._table).clear();
    return tr.complete;
  }

  async getAll() {
    const tr = this._db.transaction(this._table);
    const objectStore = tr.objectStore(this._table);

    const values = [];
    const keys = [];
    (objectStore.iterateKeyCursor || objectStore.iterateCursor).call(
      objectStore,
      cursor => {
        if (!cursor) return;
        values.push(objectStore.get(cursor.key));
        keys.push(cursor.key);
        cursor.continue();
      },
    );

    await tr.complete;
    const output = {};
    for (let i = 0; i < keys.length; i++) {
      output[keys[i]] = await values[i];
    }
    return output;
  }

  async keys() {
    const tr = this._db.transaction(this._table);
    const objectStore = tr.objectStore(this._table);

    const keys = [];
    (objectStore.iterateKeyCursor || objectStore.iterateCursor).call(
      objectStore,
      cursor => {
        if (!cursor) return;
        keys.push(cursor.key);
        cursor.continue();
      },
    );

    await tr.complete;
    return keys;
  }
}

export default async (table /*: string */) => {
  if (!initialized) init();
  if (tableAccesses.has(table)) {
    return tableAccesses.get(table);
  }
  // the tableAccess is not initialized
  // checks if the table exists
  const db = await dbPromise;
  if (!db.objectStoreNames.contains(table)) {
    throw new Error(`table ${table} does not exist`);
  }
  const tableAccess = new TableAccess(table, db);
  tableAccesses.set(table, tableAccess);
  return tableAccess;
};
