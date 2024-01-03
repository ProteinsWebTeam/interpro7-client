import React, { PureComponent } from 'react';

import { connect } from 'react-redux';
import { goToCustomLocation } from 'actions/creators';
import { createSelector } from 'reselect';

import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import DomainButton from './DomainButton';
import PanelIDA from './PanelIDA';
import ToggleSwitch from 'components/ToggleSwitch';

import cssBinder from 'styles/cssBinder';

import local from './style.css';
import search from 'components/IPScan/Search/style.css';

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

const css = cssBinder(local, search);

type Props = {
  customLocation: InterProLocation;
  goToCustomLocation: typeof goToCustomLocation;
};
type State = {
  markerBeforeEntry: string | null;
  markerAfterEntry: string | null;
  options: Record<string, EntryMetadata>;
};

type SearchProps = {
  ida_search?: string;
  ida_ignore?: string;
  ordered?: boolean;
  exact?: boolean;
};
export class SearchByIDA extends PureComponent<Props, State> {
  state = {
    markerBeforeEntry: null,
    markerAfterEntry: null,
    options: {},
  };
  _handleSubmit = ({
    entries,
    order,
    exact = false,
    ignore,
  }: {
    entries: Array<string>;
    order: boolean;
    exact?: boolean;
    ignore: Array<string>;
  }) => {
    const search: SearchProps = {
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
  _handleMoveMarker =
    (entries: Array<string>) => (pos: number) => (delta: number | null) => {
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
  _handleMoveEntry =
    (currentEntries: Array<string>, ignore: Array<string>) =>
    (pos: number) =>
    (delta: number) => {
      const newPos = Math.max(
        0,
        Math.min(currentEntries.length - 1, pos + delta),
      );

      const entries = [...currentEntries];
      entries.splice(pos, 1);
      entries.splice(newPos, 0, currentEntries[pos]);

      this._handleSubmit({ entries, order: true, ignore });
    };

  _mergeResults = (
    data: RequestedData<PayloadList<{ metadata: EntryMetadata }>>,
  ) => {
    if (!data || !data.ok) return;
    const options: Record<string, EntryMetadata> = { ...this.state.options };
    for (const e of data.payload?.results || []) {
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
    }: SearchProps = this.props.customLocation.search;
    const entries = searchFromURL ? searchFromURL.split(',') : [];
    if (searchFromURL !== undefined && searchFromURL.trim() === '')
      entries.push('');
    const order = !!ordered;
    const _exact = !!exact;
    const ignore = ignoreFromURL ? ignoreFromURL.split(',') : [];
    if (ignoreFromURL !== undefined && ignoreFromURL.trim() === '')
      ignore.push('');
    return (
      <div className={css('vf-stack', 'vf-stack--400')}>
        <div className={css('ida-search')}>
          <SchemaOrgData
            data={{
              name: 'Search By Domain Architecture IDA',
              description: 'Search proteins which match a domain architecture',
            }}
            processData={schemaProcessDataPageSection}
          />
          <div className={css('vf-stack', 'vf-stack--400')}>
            <div className={css('search-input')}>
              <h3 className={css('light')}>
                Search for proteins with a specific domain architecture
              </h3>
              <div className={css('description')}>
                <p>
                  Domain architectures are derived from matches to Pfam models.
                  You can select domains to either be included or excluded from
                  your search results. The results will include all proteins
                  which match the domain architecture selected below. Domains
                  can be selected using either a Pfam accession, or an InterPro
                  accession, where that InterPro entry includes a Pfam model.
                </p>
              </div>
              <div className={css('ida-workspace')}>
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
                      entries: entries.slice(0, n).concat(entries.slice(n + 1)),
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
              <div className={css('ida-controls')}>
                <button
                  className={css('button', 'secondary')}
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
                  className={css('button', 'secondary')}
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
                <div className={css('options')}>
                  <ToggleSwitch
                    switchCond={order}
                    name={'order'}
                    id={'ordered'}
                    size={'tiny'}
                    label={'Order of domain matters: '}
                    onValue={'Yes'}
                    offValue={'No'}
                    handleChange={(event) =>
                      this._handleSubmit({
                        order: (event?.target as HTMLFormElement).checked,
                        entries,
                        ignore,
                      })
                    }
                  />

                  <ToggleSwitch
                    switchCond={_exact}
                    name={'exact'}
                    id={'exact'}
                    disabled={!ordered}
                    size={'tiny'}
                    label={'Exact match:'}
                    onValue={'Yes'}
                    offValue={'No'}
                    handleChange={(event) =>
                      this._handleSubmit({
                        exact: (event?.target as HTMLFormElement).checked,
                        order: true,
                        entries,
                        ignore,
                      })
                    }
                  />
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
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(SearchByIDA);
