// @flow
import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';
import { createSelector } from 'reselect';
import { customLocationSelector } from 'reducers/custom-location';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import DomainButton from './DomainButton';
import IdaEntry from './IdaEntry';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import interproTheme from 'styles/theme-interpro.css';
import local from './style.css';
import search from 'components/IPScan/Search/style.css';

/*:: import type { CustomLocation } from 'actions/creators'; */
const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const f = foundationPartial(interproTheme, ipro, local, search);

const PanelIDA = (
  {
    entryList,
    ignoreList,
    isOrdered,
    removeEntryHandler,
    changeEntryHandler,
    changeIgnoreHandler,
    removeIgnoreHandler,
    mergeResults,
    options,
    markerBeforeEntry = null,
    markerAfterEntry = null,
    handleMoveMarker,
    handleMoveEntry,
  } /*: {
  entryList: Array<string>,
  ignoreList: Array<string>,
  isOrdered: boolean,
  removeEntryHandler: function,
  changeEntryHandler: function,
  changeIgnoreHandler: function,
  removeIgnoreHandler: function,
  mergeResults: function,
  options: {},
  markerBeforeEntry: ?string,
  markerAfterEntry: ?string,
  handleMoveMarker: function,
  handleMoveEntry: function,
  } */,
) => (
  <div className={f('panels')}>
    <div className={f('ida-panel')}>
      <header>Architectures must include</header>
      <div>
        <ul className={f('ida-list', { ordered: isOrdered })}>
          {entryList &&
            entryList.map((e, i) => (
              <Fragment key={i}>
                {markerBeforeEntry === e && <div>|</div>}
                <li>
                  <IdaEntry
                    position={i}
                    entry={e}
                    active={true}
                    draggable={isOrdered}
                    handleMoveMarker={handleMoveMarker(i)}
                    handleMoveEntry={handleMoveEntry(i)}
                    removeEntryHandler={() => removeEntryHandler(i)}
                    changeEntryHandler={(name) => changeEntryHandler(i, name)}
                    mergeResults={mergeResults}
                    options={options}
                  />
                </li>
                {markerAfterEntry === e && <div>|</div>}
              </Fragment>
            ))}
        </ul>
      </div>
    </div>
    <div className={f('ida-ignore')}>
      <header>
        Architectures must <u>not</u> include
      </header>
      <ul className={f('ida-list', 'ignore')}>
        {ignoreList &&
          ignoreList.map((e, i) => (
            <li key={i}>
              <IdaEntry
                position={i}
                entry={e}
                active={true}
                removeEntryHandler={() => removeIgnoreHandler(i)}
                changeEntryHandler={(name) => changeIgnoreHandler(i, name)}
                mergeResults={mergeResults}
                options={options}
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
  markerBeforeEntry: T.string,
  markerAfterEntry: T.string,
  handleMoveMarker: T.func,
  handleMoveEntry: T.func,
  mergeResults: T.func,
  options: T.object,
};

/*:: type Props = {
  customLocation: CustomLocation,
  goToCustomLocation: goToCustomLocation,
}; */
/*:: type State = {
  markerBeforeEntry: ?string,
  markerAfterEntry: ?string,
  options: {},
}; */

/*:: type SearchProps = {
  ida_search?: string,
  ida_ignore?: string,
  ordered?: boolean,
  exact?: boolean,
}; */
export class SearchByIDA extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    customLocation: T.shape({
      description: T.object.isRequired,
      search: T.object.isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };
  state = {
    markerBeforeEntry: null,
    markerAfterEntry: null,
    options: {},
  };
  _handleSubmit = ({ entries, order, exact = false, ignore }) => {
    const search /*: SearchProps */ = {
      ida_search: entries.join(','),
    };
    if (order) {
      search.ordered = true;
      if (exact) search.exact = true;
    }
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
  _handleMoveMarker = (entries) => (pos) => (delta) => {
    if (delta === null) {
      this.setState({ markerBeforeEntry: null, markerAfterEntry: null });
      return;
    }
    const newPos = Math.max(0, Math.min(entries.length, pos + delta));
    if (newPos === entries.length) {
      this.setState({
        markerBeforeEntry: null,
        markerAfterEntry: entries[newPos - 1],
      });
    } else {
      this.setState({
        markerBeforeEntry: entries[newPos],
        markerAfterEntry: null,
      });
    }
  };
  _handleMoveEntry = (currentEntries, ignore) => (pos) => (delta) => {
    const newPos = Math.max(
      0,
      Math.min(currentEntries.length - 1, pos + delta),
    );

    const entries = [...currentEntries];
    entries.splice(pos, 1);
    entries.splice(newPos, 0, currentEntries[pos]);

    this._handleSubmit({ entries, order: true, ignore });
  };

  _mergeResults = (data) => {
    if (!data || !data.ok) return;
    const options = { ...this.state.options };
    for (const e of data.payload.results) {
      if (
        e.metadata.source_database === 'interpro' &&
        e.metadata.type === 'domain'
      )
        options[e.metadata.accession] = e.metadata;
      else if (e.metadata.source_database === 'pfam')
        options[e.metadata.accession] = e.metadata;
    }
    this.setState({ options });
  };

  render() {
    const {
      ida_search: searchFromURL,
      ordered,
      exact,
      ida_ignore: ignoreFromURL,
    } = this.props.customLocation.search;
    const entries = searchFromURL ? searchFromURL.split(',') : [];
    if (searchFromURL !== undefined && searchFromURL.trim() === '')
      entries.push('');
    const order = !!ordered;
    const _exact = !!exact;
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
            <SchemaOrgData
              data={{
                name: 'Search By Domain Architecture IDA',
                description:
                  'Search proteins which match a domain architecture',
              }}
              processData={schemaProcessDataPageSection}
            />
            <div className={f('row')}>
              <div className={f('large-12', 'columns', 'search-input')}>
                <h3 className={f('light')}>
                  Search for proteins with a specific domain architecture
                </h3>
                <div className={f('description')}>
                  <p>
                    Domain architectures are derived from matches to Pfam
                    models. You can select domains to either be included or
                    excluded from your search results. The results will include
                    all proteins which match the domain architecture selected
                    below. Domains can be selected using either a Pfam
                    accession, or an InterPro accession, where that InterPro
                    entry includes a Pfam model.
                  </p>
                </div>
                <div className={f('ida-workspace')}>
                  <PanelIDA
                    entryList={entries}
                    ignoreList={ignore}
                    isOrdered={order}
                    markerBeforeEntry={this.state.markerBeforeEntry}
                    markerAfterEntry={this.state.markerAfterEntry}
                    handleMoveMarker={this._handleMoveMarker(entries)}
                    handleMoveEntry={this._handleMoveEntry(entries, ignore)}
                    mergeResults={this._mergeResults}
                    options={this.state.options}
                    removeEntryHandler={(n) =>
                      this._handleSubmit({
                        entries: entries
                          .slice(0, n)
                          .concat(entries.slice(n + 1)),
                        order,
                        ignore,
                      })
                    }
                    removeIgnoreHandler={(n) =>
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
                    <span>Add Domain to include</span>
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
                    <span>Add Domain to exclude</span>
                  </button>
                  <div className={f('options')}>
                    <div className={f('switch', 'tiny')}>
                      <label htmlFor="ordered">
                        <input
                          className={f('switch-input')}
                          type="checkbox"
                          id="ordered"
                          checked={order}
                          onChange={(event) =>
                            this._handleSubmit({
                              order: event.target.checked,
                              entries,
                              ignore,
                            })
                          }
                        />{' '}
                        Order of domain matters:{' '}
                        <span className={f('switch-paddle')}>
                          <span
                            className={f('switch-active')}
                            aria-hidden="true"
                          >
                            Yes
                          </span>
                          <span
                            className={f('switch-inactive')}
                            aria-hidden="true"
                          >
                            No
                          </span>
                        </span>
                      </label>
                    </div>
                    <div
                      className={f('switch', 'tiny', { disabled: !ordered })}
                    >
                      <label htmlFor="exact">
                        <input
                          className={f('switch-input')}
                          type="checkbox"
                          id="exact"
                          disabled={!order}
                          checked={_exact}
                          onChange={(event) =>
                            this._handleSubmit({
                              exact: event.target.checked,
                              order: true,
                              entries,
                              ignore,
                            })
                          }
                        />{' '}
                        Exact match:{' '}
                        <span className={f('switch-paddle')}>
                          <span
                            className={f('switch-active')}
                            aria-hidden="true"
                          >
                            Yes
                          </span>
                          <span
                            className={f('switch-inactive')}
                            aria-hidden="true"
                          >
                            No
                          </span>
                        </span>
                      </label>
                    </div>
                  </div>
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
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(SearchByIDA);
