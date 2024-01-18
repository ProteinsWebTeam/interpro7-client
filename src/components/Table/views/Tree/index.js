/* eslint-disable react/prop-types */
// @flow
import React, { Component, PureComponent } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import { goToCustomLocation } from 'actions/creators';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

// $FlowFixMe
import Tree from 'components/Tree';
import NumberComponent from 'components/NumberComponent';
import abbreviateNumber from 'components/NumberComponent/utils/number-to-display-text';

// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';
// $FlowFixMe
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Tip from 'components/Tip';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import { cloneDeep } from 'lodash-es';

const f = foundationPartial(ebiGlobalStyles, styles, fonts);
const ANIMATION_DURATION = 0.3;

const mapStateToUrlFor = createSelector(
  (taxID) => taxID,
  (taxID) =>
    createSelector(
      (state) => state.settings.api,
      (state) => state.customLocation.description,
      ({ protocol, hostname, port, root }, description) => {
        if (
          (description.main.key === 'entry' && description.entry.accession) ||
          (description.main.key === 'taxonomy' && description.entry.db)
        ) {
          const query = description.entry.accession
            ? {
                filter_by_entry: description.entry.accession,
              }
            : {
                filter_by_entry_db: description.entry.db,
              };
          return format({
            protocol,
            hostname,
            port,
            pathname:
              root +
              descriptionToPath({
                main: { key: 'taxonomy' },
                taxonomy: {
                  db: 'uniprot',
                  accession: taxID,
                },
              }),
            query,
          });
        }
        return format({
          protocol,
          hostname,
          port,
          pathname:
            root +
            descriptionToPath({
              ...description,
              [description.main.key]: {
                ...description[description.main.key],
                isFilter: description.main.key !== 'taxonomy',
              },
              main: { key: 'taxonomy' },
              taxonomy: {
                db: 'uniprot',
                accession: taxID,
              },
            }),
          search: 'with_names',
        });
      },
    ),
);
/*::
  type Names = {
    [string]: {
      short: string,
      name: string,
    }
  }
type Payload = {
  metadata: Object,
  children: CountersMap,
  names: Names,
};
type Props = {
  taxID: string,
  data: {
    loading: boolean,
    payload: Object
  },
  sendData: function
};
*/
class DataProvider extends PureComponent /*:: <Props> */ {
  /*::
   _sent: boolean;
   */

  componentDidMount() {
    this._sendDataUpIfAny();
  }

  componentDidUpdate({ data: { payload } }) {
    if (this.props.data.payload !== payload) this._sendDataUpIfAny();
  }

  _sendDataUpIfAny = () => {
    if (this._sent) return;
    const {
      taxID,
      data: { loading, payload },
      sendData,
    } = this.props;
    if (!loading && payload) {
      this._sent = true;
      sendData(taxID, payload);
    }
  };

  render() {
    return null;
  }
}

/*::
  type Node =  {
    id: string,
    children?: Array<any>,
    lineage?: string,
    counters?: Counters;
    rank?: string;
    hitcount?: number;
    name: string
  };
  type Counters = {
    proteins: number,
    proteoms: number,
    structures: number,
  };
  type CountersMap = {
    [string]: Counters,
  }
  type Metadata = {
    accession: string,
    lineage?: string,
    counters?: Counters;
    rank?: string;
    children: Array<string>,
  }
 */
const findNodeWithId = (
  id /*: string */,
  node /*: Node */,
) /*: void | Node */ => {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNodeWithId(id, child);
    if (found) return found;
  }
};

const addNodesFromLineage = (
  update /*: Node */,
  root /*: Node */,
  names /*: Names */,
) => {
  const lineage = (update.lineage || '').trim().split(' ');
  lineage.splice(-1);
  const parentId = lineage.splice(-1)?.[0];
  let parent = findNodeWithId(parentId, root);
  if (!parent) {
    parent = addNodesFromLineage(
      {
        name: names[parentId]?.short || parentId,
        id: parentId,
        lineage: [...lineage, parentId].join(' '),
      },
      root,
      names,
    );
  }

  if (!parent.children) parent.children = [];
  parent.children.push(update);
  return update;
};

const mergeData = (
  root /*: Node */,
  update /*: Metadata */,
  names /*: Names */,
  childrenCounters /*: CountersMap */,
) => {
  let toUpdate = findNodeWithId(update.accession, root);
  if (!toUpdate) {
    toUpdate = addNodesFromLineage(
      {
        id: update.accession,
        name: names[update.accession].short,
        lineage: update.lineage,
      },
      root,
      names,
    );
  }
  toUpdate.lineage = update.lineage;
  toUpdate.counters = update.counters;
  toUpdate.rank = update.rank;
  toUpdate.hitcount = abbreviateNumber(update?.counters?.proteins, true);
  if (!toUpdate.children || (update.children && update.children.length)) {
    toUpdate.children = update.children.map((id) => ({
      name: names[id].short || names[id].name,
      id,
      hitcount: abbreviateNumber(childrenCounters?.[id]?.proteins, true),
    }));
  }
  return root;
};
/*:: type TreeViewProps = {
  customLocation: {
    description: Object,
  },
  dataTable: Array<Object>,
  goToCustomLocation: function,
  showTreeToast: boolean,
  addToast: function,
  changeSettingsRaw: function,
  onFocusChanged: function,
};*/

/*:: type State = {
  data: Node,
  focused: string,
  entryDB: Object,
  exactMatch: Object,
}; */
class TreeView extends Component /*:: <TreeViewProps, State> */ {
  /*::
  _CDPMap: Map<string, Object>;
  _lineageNames: Map<string,*>;
  _initialLoad: boolean;
  */

  constructor(props /*: TreeViewProps */) {
    super(props);
    this.state = {
      data: { name: 'root', id: '1' },
      focused: '1',
      entryDB: props.customLocation.description.entry.db,
      exactMatch: props.dataTable.find((x) => x?.metadata?.exact_match),
    };
    this._CDPMap = new Map();
    this._lineageNames = new Map();
    this._initialLoad = true; // Automatically opens the tree until it finds a branch of children when it loads the first time
  }

  static getDerivedStateFromProps(
    {
      customLocation: {
        description: {
          entry: { db: newDB },
        },
      },
      dataTable,
    },
    { entryDB: oldDB, exactMatch },
  ) {
    if (newDB !== oldDB) {
      return {
        focused: '1',
        entryDB: newDB,
      };
    }
    const newMatch = dataTable?.find((x) => x?.metadata?.exact_match);
    if (exactMatch?.metadata.accession !== newMatch?.metadata.accession) {
      return {
        entryDB: oldDB,
        exactMatch: newMatch,
      };
    }
    return null;
  }

  shouldComponentUpdate(
    nextProps /*: TreeViewProps */,
    nextState /*: State */,
  ) {
    const {
      customLocation: {
        description: {
          entry: { db: newDB },
        },
      },
    } = nextProps;
    const {
      customLocation: {
        description: {
          entry: { db: oldDB },
        },
      },
    } = this.props;
    if (newDB !== oldDB) this._CDPMap.clear();
    return nextProps !== this.props || nextState !== this.state;
  }

  componentWillUnmount() {
    this._CDPMap.clear();
  }
  _handleNewSearchData = (taxID /*: string */, payload /*: Payload */) => {
    this._handleNewData(taxID, payload);
    this._handleNewFocus(taxID);
  };
  _handleNewData = (taxID /*: string */, payload /*: Payload */) => {
    if (payload?.metadata?.children) {
      const c = payload.metadata.children.length;
      if (c === 1 && this._initialLoad) {
        this._handleNewFocus(payload.metadata.children[0]);
      } else {
        this._initialLoad = false;
      }
    }
    if (payload.metadata) {
      this.setState(({ data } /*: {data: Node} */) => ({
        data: {
          ...mergeData(data, payload.metadata, payload.names, payload.children),
        },
      }));
    }
  };

  _handleNewFocus = (taxID /*: string */) => {
    if (taxID) {
      this.setState({ focused: taxID });
      if (this.props.onFocusChanged) {
        this.props.onFocusChanged(taxID);
      }
    }
  };
  _handleLabelClick = (taxID /*: string */) => {
    this.props.goToCustomLocation({
      description: {
        main: { key: 'taxonomy' },
        taxonomy: {
          db: 'UniProt',
          accession: taxID,
        },
      },
    });
  };

  _storeLineageNames = (focused /*: string */, data /*: Node */) => {
    if (focused === data.id) {
      this._lineageNames.set(focused, data.name);
    } else {
      data?.children?.forEach((child) => {
        this._storeLineageNames(focused, child);
      });
    }
  };

  render() {
    const { focused, data, exactMatch } = this.state;
    let ConnectedDataProvider = this._CDPMap.get(focused);
    if (!ConnectedDataProvider) {
      ConnectedDataProvider = loadData(mapStateToUrlFor(focused))(DataProvider);
      this._CDPMap.set(focused, ConnectedDataProvider);
      this._storeLineageNames(focused, data);
    }
    let ConnectedDataProviderSearch = null;
    if (exactMatch) {
      ConnectedDataProviderSearch = this._CDPMap.get(
        exactMatch.metadata.accession,
      );
      if (!ConnectedDataProviderSearch) {
        ConnectedDataProviderSearch = loadData(
          mapStateToUrlFor(exactMatch.metadata.accession),
        )(DataProvider);
        this._CDPMap.set(
          exactMatch.metadata.accession,
          ConnectedDataProviderSearch,
        );
      }
    }
    const currentNode = findNodeWithId(focused, data);
    const {
      customLocation: { description },
    } = this.props;
    const mainEndpoint = description.main.key;
    const countersToShow = {
      entry: ['entries', description.entry?.db || 'all'],
      protein: ['proteins', 'uniprot'],
      structure: ['structures', 'pdb'],
      proteome: ['proteomes', 'uniprot'],
    };
    return (
      <>
        {this.props.showTreeToast ? (
          <Tip
            body="Arrow keys can be used to navigate the tree"
            toastID="tree"
            settingsName="showTreeToast"
          />
        ) : null}
        <div className={f('node-details')}>
          <div className={f('node-info')}>
            <header>
              <Tooltip title="[Tax ID]: [Tax Name]">
                <span
                  className={f('small', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                  aria-label="Tax ID: Tax Name"
                />
              </Tooltip>{' '}
              <Link
                to={{
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: { db: 'uniprot', accession: focused },
                  },
                }}
              >
                {currentNode?.id}: {currentNode?.name}
              </Link>
            </header>
            {currentNode?.rank?.toLowerCase() !== 'no rank' && (
              <div>
                <Tooltip title="Rank.">
                  <span
                    className={f('small', 'icon', 'icon-common')}
                    data-icon="&#xf129;"
                    aria-label="Rank."
                  />
                </Tooltip>{' '}
                <i>{currentNode?.rank}</i>
              </div>
            )}
            {currentNode?.lineage && (
              <DropDownButton label="Lineage" fontSize="12px">
                <ul>
                  {Array.from(this._lineageNames.keys()).map((key) => (
                    <li key={key}>
                      <Link
                        to={{
                          description: {
                            main: { key: 'taxonomy' },
                            taxonomy: { db: 'uniprot', accession: key },
                          },
                        }}
                      >
                        {`${
                          this._lineageNames
                            ?.get(key)
                            ?.charAt(0)
                            ?.toUpperCase() || ''
                        }${this._lineageNames.get(key)?.slice(1) || ''}`}
                      </Link>
                    </li>
                  ))}
                </ul>
              </DropDownButton>
            )}
          </div>
          <div className={f('node-links')}>
            {currentNode?.counters ? (
              <ul>
                {
                  // prettier-ignore
                  (Object.entries(countersToShow)/*: any */)
                    .map(([endpoint, [plural, db]]/*: [string, [string, number]] */) => {
                      if (
                        endpoint === mainEndpoint ||
                        typeof currentNode?.counters?.[plural] === 'undefined'
                      )
                        return null;
                      const to = {
                        ...cloneDeep(description),
                        [endpoint]: {
                          isFilter: true,
                          db,
                          order: 1,
                        },
                      };

                      if (description.main.key === 'taxonomy') {
                        to.taxonomy.accession = this.state.focused;
                        if (endpoint !== 'entry')
                          to.entry.order = 2;
                      } else {
                        to.taxonomy = {
                          db: 'uniprot',
                          isFilter: true,
                          order: 2,
                          accession: this.state.focused,
                        };
                      }
                      return (
                        <li key={endpoint}>
                          <Link
                            className={f('no-decoration', {
                              disable: !currentNode?.counters?.[plural],
                            })}
                            to={{
                              description: to,
                            }}
                          >
                            <NumberComponent duration={ANIMATION_DURATION}>
                              {currentNode?.counters?.[plural]}
                            </NumberComponent>{' '}
                            {plural}
                          </Link>{' '}
                          -
                        </li>
                      );
                    })
                    .filter(Boolean)
                }
              </ul>
            ) : (
              <Loading inline={true} />
            )}
          </div>
        </div>
        <ConnectedDataProvider sendData={this._handleNewData} taxID={focused} />
        {ConnectedDataProviderSearch && (
          <ConnectedDataProviderSearch
            sendData={this._handleNewSearchData}
            taxID={exactMatch.metadata.accession}
          />
        )}
        <Tree
          data={data}
          focused={focused}
          changeFocus={this._handleNewFocus}
          data-testid="data-tree"
        />
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.notifications.showTreeToast,
  (showTreeToast) => ({ showTreeToast }),
);

export default React.memo(
  connect(mapStateToProps, { goToCustomLocation })(TreeView),
);
