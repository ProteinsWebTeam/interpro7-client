import React, { useState } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import config from 'config';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { toPlural } from 'utils/pages';

import { NOT_MEMBER_DBS } from 'menuConfig';
import Link from 'components/generic/Link';
import NumberComponent from 'components/NumberComponent';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import style from './style.css';
const f = foundationPartial(style, ebiStyles);

const comparisonFunction = (a, b) => {
  if (a.canonical < b.canonical) return -1;
  if (b.canonical < a.canonical) return 1;
  return 0;
};

const getDBs = (databases) => {
  const _dbs = new Map();
  if (databases.payload) {
    _dbs.set('interpro', databases.payload.databases.interpro);
    const dbs = Object.values(databases.payload.databases).sort(
      comparisonFunction,
    );
    for (const db of dbs) {
      if (
        db.type === 'entry' &&
        db.canonical !== 'interpro' &&
        !NOT_MEMBER_DBS.has(db.canonical)
      ) {
        _dbs.set(db.canonical, db);
      }
    }
  }
  return _dbs;
};

const getNewLocation = (customLocation, db) => {
  const description = { ...customLocation.description };
  // 'all' is only available for endpoints different to 'entry'
  if (db === 'all') {
    description.entry = {};
  } else {
    description.entry = {
      isFilter: description.main.key !== 'entry',
      db,
    };
  }
  // resets the filter (un)reviewed
  if (description.main.key === 'protein') {
    description.protein.db = 'uniprot';
  }
  // resets the taxonomy filter
  if (description.taxonomy.isFilter) description.taxonomy.isFilter = false;

  const { search } = customLocation.search;
  return {
    ...customLocation,
    description,
    search: { search },
  };
};

const MemberDBTabs = ({ dataDB, dataDBCount, entryDB, main }) => {
  const [isOffLeft, setOffLeft] = useState(false);
  const [isOffRight, setOffRight] = useState(true);
  if (!dataDB || dataDB.loading) return null;
  const dbs = getDBs(dataDB);
  const handleScroll = (event) => {
    setOffLeft(event.target.scrollLeft > 0);
    setOffRight(
      event.target.scrollLeft !==
        event.target.scrollWidth - event.target.offsetWidth,
    );
  };
  console.log(dataDBCount.payload);
  return (
    <div className={f('row')}>
      <div className={f('column')}>
        <div
          className={f('container', {
            'off-right': isOffRight,
            'off-left': isOffLeft,
          })}
        >
          <div className={f('scrollbox')} onScroll={handleScroll}>
            <ul
              className={f('tabs', 'main-style')}
              style={{
                '--colors-tab-border': config.colors.get(
                  (entryDB || 'black').toLowerCase(),
                ),
              }}
            >
              {Array.from(dbs.values()).map((db) => {
                const loading = dataDBCount.loading;
                const count =
                  (db.canonical === 'interpro'
                    ? dataDBCount?.payload?.entries?.interpro
                    : dataDBCount?.payload?.entries?.member_databases?.[
                        db.canonical
                      ]) || 0;
                const active = db.canonical === (entryDB || '').toLowerCase();
                return (
                  <li
                    className={f('tabs-label', { active })}
                    key={db.canonical}
                  >
                    <Link
                      to={(currentLocation) =>
                        getNewLocation(currentLocation, db.canonical)
                      }
                    >
                      <div
                        className={f('db-tag')}
                        style={{
                          background: config.colors.get(db.canonical),
                        }}
                      ></div>
                      {db.name}{' '}
                      <NumberComponent
                        loading={loading}
                        className={f('label')}
                        titleType={toPlural(main, (!loading && count) || 0)}
                        style={{
                          background: active && config.colors.get(db.canonical),
                        }}
                        abbr
                      >
                        {!loading && count}
                      </NumberComponent>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={f('shadow', 'shadow-left')} aria-hidden="true"></div>
          <div className={f('shadow', 'shadow-right')} aria-hidden="true"></div>
        </div>
      </div>
    </div>
  );
};

const getUrlForMemberDBCount = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  ({ protocol, hostname, port, root }, description) => {
    let output = format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    });
    if (description.main.key && description.main.key !== 'entry') {
      output += `/${description.main.key}/${
        description[description.main.key].db
      }`;
      if (description.main.key === 'protein') {
        output = output.replace(/(un)?reviewed/i, 'UniProt');
      }
    }
    return output;
  },
);

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.main.key,
  (state) => state.customLocation.description.entry.db,
  (main, entryDB) => ({ main, entryDB }),
);

export default loadData({
  getUrl: getUrlForMemberDBCount,
  propNamespace: 'DBCount',
})(
  loadData({
    getUrl: getUrlForMeta,
    propNamespace: 'DB',
    mapStateToProps,
  })(MemberDBTabs),
);
