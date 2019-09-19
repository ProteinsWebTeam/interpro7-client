// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';
import { createSelector } from 'reselect';
import { customLocationSelector } from 'reducers/custom-location';

import DomainButton from './DomainButton';
import IdaEntry from './IdaEntry';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';

/*:: import type { CustomLocation } from 'actions/creators'; */

const f = foundationPartial(interproTheme, ipro, local);

const PanelIDA = (
  {
    entryList,
    ignoreList,
    isOrdered,
    removeEntryHandler,
    changeEntryHandler,
    changeIgnoreHandler,
    removeIgnoreHandler,
  } /*: {
  entryList: Array<string>,
  ignoreList: Array<string>,
  isOrdered: boolean,
  removeEntryHandler: function,
  changeEntryHandler: function,
  changeIgnoreHandler: function,
  removeIgnoreHandler: function
  } */,
) => (
  <div className={f('panels')}>
    <div className={f('ida-panel')}>
      <header>IDA</header>
      <div>
        <ul className={f('ida-list', { ordered: isOrdered })}>
          {entryList &&
            entryList.map((e, i) => (
              <li key={i}>
                <IdaEntry
                  position={i}
                  entry={e}
                  active={true}
                  removeEntryHandler={() => removeEntryHandler(i)}
                  changeEntryHandler={name => changeEntryHandler(i, name)}
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
    <div className={f('ida-ignore')}>
      <header>Ignore</header>
      <ul className={f('ida-list', 'ignore')}>
        {ignoreList &&
          ignoreList.map((e, i) => (
            <li key={i}>
              <IdaEntry
                position={i}
                entry={e}
                active={true}
                removeEntryHandler={() => removeIgnoreHandler(i)}
                changeEntryHandler={name => changeIgnoreHandler(i, name)}
              />
            </li>
          ))}
      </ul>
    </div>
  </div>
);
PanelIDA.propTypes = {
  entryList: T.arrayOf(T.string),
  ignoreList: T.arrayOf(T.string),
  isOrdered: T.bool,
  removeEntryHandler: T.func,
  removeIgnoreHandler: T.func,
  changeEntryHandler: T.func,
  changeIgnoreHandler: T.func,
  goToCustomLocation: T.func,
};

/*:: type Props = {
  customLocation: CustomLocation,
  goToCustomLocation: goToCustomLocation,
}; */

/*:: type SearchProps = {
  ida_search?: string,
  ida_ignore?: string,
  ordered?: boolean,
}; */
export class SearchByIDA extends PureComponent /*:: <Props> */ {
  static propTypes = {
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };
  _handleSubmit = ({ entries, order, ignore }) => {
    const search /*: SearchProps */ = {
      ida_search: entries.join(','),
    };
    if (order) search.ordered = true;
    if (ignore && ignore.length) search.ida_ignore = ignore.join(',');

    this.props.goToCustomLocation({
      ...this.props.customLocation,
      description: {
        main: { key: 'search' },
        search: { type: 'ida' },
      },
      search,
    });
  };
  render() {
    const {
      ida_search: searchFromURL,
      ordered,
      ida_ignore: ignoreFromURL,
    } = this.props.customLocation.search;
    const entries = searchFromURL ? searchFromURL.split(',') : [];
    if (searchFromURL !== undefined && searchFromURL.trim() === '')
      entries.push('');
    const order = !!ordered;
    const ignore = ignoreFromURL ? ignoreFromURL.split(',') : [];
    if (ignoreFromURL !== undefined && ignoreFromURL.trim() === '')
      ignore.push('');
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns', 'margin-bottom-medium')}>
          <div
            className={f(
              'secondary',
              'callout',
              'border',
              'margin-bottom-none',
            )}
          >
            <div className={f('row')}>
              <div className={f('large-12', 'columns', 'search-input')}>
                <h3 className={f('light')}>
                  Search for proteins with a specific domain architecture
                </h3>
                <div className={f('ida-workspace')}>
                  <PanelIDA
                    entryList={entries}
                    ignoreList={ignore}
                    isOrdered={order}
                    removeEntryHandler={n =>
                      this._handleSubmit({
                        entries: entries
                          .slice(0, n)
                          .concat(entries.slice(n + 1)),
                        order,
                        ignore,
                      })
                    }
                    removeIgnoreHandler={n =>
                      this._handleSubmit({
                        ignore: ignore.slice(0, n).concat(ignore.slice(n + 1)),
                        entries,
                        order,
                      })
                    }
                    changeEntryHandler={(n, name) => {
                      const tmp = [...entries];
                      tmp[n] = name;
                      this._handleSubmit({
                        entries: tmp,
                        ignore,
                        order,
                      });
                    }}
                    changeIgnoreHandler={(n, name) => {
                      const tmp = [...ignore];
                      tmp[n] = name;
                      this._handleSubmit({
                        ignore: tmp,
                        entries,
                        order,
                      });
                    }}
                  />
                </div>
                <div className={f('ida-controls')}>
                  <button
                    className={f('button', 'secondary')}
                    onClick={() =>
                      this._handleSubmit({
                        entries: entries.concat(''),
                        ignore,
                        order,
                      })
                    }
                  >
                    <DomainButton label="➕" fill="#75bf40" stroke="#75bf40" />{' '}
                    <span>Add Entry</span>
                  </button>
                  <button
                    className={f('button', 'secondary')}
                    onClick={() =>
                      this._handleSubmit({
                        ignore: ignore.concat(''),
                        entries,
                        order,
                      })
                    }
                  >
                    <DomainButton label="✖️️" fill="#bf4540" stroke="#bf4540" />{' '}
                    <span>Ignore Entry</span>
                  </button>
                  <label htmlFor="ordered">
                    <input
                      type="checkbox"
                      id="ordered"
                      checked={order}
                      onChange={event =>
                        this._handleSubmit({
                          order: event.target.checked,
                          entries,
                          ignore,
                        })
                      }
                    />{' '}
                    Order sensitivity
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  customLocationSelector,
  customLocation => ({ customLocation }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation },
)(SearchByIDA);
