import React, { Component } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';
import { cloneDeep } from 'lodash-es';

import { goToCustomLocation } from 'actions/creators';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';

import Tree from 'components/Tree';
import NumberComponent from 'components/NumberComponent';
import abbreviateNumber from 'components/NumberComponent/utils/number-to-display-text';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Tip from 'components/Tip';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadData from 'higherOrder/loadData/ts';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import DataProvider, { DataProviderLoadedProps } from './DataProvider';

const css = cssBinder(styles, fonts);

const ANIMATION_DURATION = 0.3;

const mapStateToUrlFor = (taxID: string) =>
  createSelector(
    (state: GlobalState) => state.settings.api,
    (state: GlobalState) => state.customLocation.description,
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
  );

type Names = Record<string, NameObject>;
type CountersMap = Record<string, TaxonomyCounters>;

const findNodeWithId = (id: string, node: TaxNode): TaxNode | undefined => {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNodeWithId(id, child);
    if (found) return found;
  }
  return undefined;
};

const addNodesFromLineage = (update: TaxNode, root: TaxNode, names: Names) => {
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
  root: TaxNode,
  update: TaxonomyMetadata,
  names: Names,
  childrenCounters?: CountersMap,
) => {
  let toUpdate = findNodeWithId(update.accession, root);
  if (!toUpdate) {
    toUpdate = addNodesFromLineage(
      {
        id: update.accession,
        name: names[update.accession].short || '',
        lineage: update.lineage,
      },
      root,
      names,
    );
  }
  toUpdate!.lineage = update.lineage;
  toUpdate!.counters = update.counters;
  toUpdate!.rank = update.rank;
  toUpdate!.hitcount = abbreviateNumber(update?.counters?.proteins, true);
  if (!toUpdate.children || (update.children && update.children.length)) {
    toUpdate.children = update.children.map((id) => ({
      name: names[id].short || names[id].name,
      id,
      hitcount: abbreviateNumber(childrenCounters?.[id]?.proteins, true),
    }));
  }
  return root;
};
type Props = {
  customLocation: InterProLocation;
  dataTable: Array<TaxonommyTreePayload>;
  goToCustomLocation: typeof goToCustomLocation;
  showTreeToast?: boolean;
  onFocusChanged: (taxID: string) => void;
};

type State = {
  data: TaxNode;
  focused: string;
  entryDB: string | null;
  exactMatch?: TaxonommyTreePayload;
};

type Provider = React.ComponentType<
  DataProviderLoadedProps<TaxonommyTreePayload>
>;

class TreeView extends Component<Props, State> {
  _CDPMap: Map<string, Provider>;
  _lineageNames: Map<string, string>;
  _initialLoad: boolean;
  _breadcrumbs: TaxNode[];

  constructor(props: Props) {
    super(props);
    this.state = {
      data: { name: 'root', id: '1' },
      focused: '1',
      entryDB: props.customLocation.description.entry.db,
      exactMatch: props.dataTable.find((x) => x?.metadata?.exact_match),
    };
    this._CDPMap = new Map();
    this._lineageNames = new Map();
    this._initialLoad = true;
    this._breadcrumbs = []; // Automatically opens the tree until it finds a branch of children when it loads the first time
  }

  static getDerivedStateFromProps(
    {
      customLocation: {
        description: {
          entry: { db: newDB },
        },
      },
      dataTable,
    }: Props,
    { entryDB: oldDB, exactMatch }: State,
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
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
  _handleNewSearchData = (taxID: string, payload: TaxonommyTreePayload) => {
    this._handleNewData(taxID, payload);
    this._handleNewFocus(taxID);
  };
  _handleNewData = (taxID: string, payload: TaxonommyTreePayload) => {
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

  _handleNewFocus = (taxID: string) => {
    /* Recomputing the lineage.
       This handles the case of going back to one of the already open taxons.
       E.g Tree is at Root -> Virus -> AnelloViridae and the desired action is Root -> Virus
    
    for (let i = 0; i < this._breadcrumbs.length; i++){
      if (this._breadcrumbs[i].id == taxID){
        this._storeLineageNames(this._breadcrumbs[i].id, this._breadcrumbs[i])
        break
      }
    }*/

    if (taxID) {
      this.setState({ focused: taxID });
      if (this.props.onFocusChanged) {
        this.props.onFocusChanged(taxID);
      }
    }
  };

  _handleLabelClick = (taxID: string) => {
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

  // Find the parent of a node among the ones already added to the breadcrumb
  _parent = (node: TaxNode, breadcrumbs: TaxNode[]) => {
    for (let i = breadcrumbs.length - 1; i >= 0; i--) {
      let taxObj = breadcrumbs[i];
      if (taxObj.children !== undefined) {
        for (let j = 0; j < taxObj.children?.length; j++) {
          if (taxObj.children[j].id == node.id) {
            return taxObj;
          }
        }
      }
    }
  };

  _storeLineageNames = (focused: string, data: TaxNode) => {
    if (focused === data.id) {
      // Updating breadcrumb object and recreating lineage
      /*
      this._breadcrumbs.push(data)
      let parentNode: TaxNode = data
      let localBreadcrumbs: TaxNode[] = [data]
      
      while (parentNode.name != "root"){
        parentNode = this._parent(parentNode as TaxNode, this._breadcrumbs) as TaxNode
        console.log(parentNode)
        localBreadcrumbs.push(parentNode)
      }

      localBreadcrumbs.reverse()

      this._lineageNames.clear()
      localBreadcrumbs.map((taxon) => {*/
      // Adding the right tuple (id, name) to lineageNames */
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
      ConnectedDataProvider = loadData<TaxonommyTreePayload>(
        mapStateToUrlFor(focused) as LoadDataParameters,
      )(DataProvider<TaxonommyTreePayload>);
      this._CDPMap.set(focused, ConnectedDataProvider);
      this._storeLineageNames(focused, data);
    }
    let ConnectedDataProviderSearch: Provider | null | undefined = null;
    if (exactMatch) {
      ConnectedDataProviderSearch = this._CDPMap.get(
        exactMatch.metadata.accession,
      );
      if (!ConnectedDataProviderSearch) {
        ConnectedDataProviderSearch = loadData<TaxonommyTreePayload>(
          mapStateToUrlFor(exactMatch.metadata.accession) as LoadDataParameters,
        )(DataProvider<TaxonommyTreePayload>);
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
        <div className={css('node-details')}>
          <div className={css('node-info')}>
            <header>
              <Link
                to={{
                  description: {
                    main: { key: 'taxonomy' },
                    taxonomy: { db: 'uniprot', accession: focused },
                  },
                }}
              >
                {currentNode?.name}
              </Link>
            </header>
            {currentNode?.rank?.toLowerCase() !== 'no rank' && (
              <div>
                <p>{currentNode?.rank}</p>
              </div>
            )}
            {currentNode?.lineage && (
              <nav className={'breadcrumbs'}>
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
              </nav>
            )}
          </div>
          <div className={css('node-links')}>
            {currentNode?.counters ? (
              <ul>
                {Object.entries(countersToShow)
                  .map(([endpoint, [plural, db]]) => {
                    if (
                      endpoint === mainEndpoint ||
                      !(plural in currentNode.counters!)
                    )
                      return null;
                    const to: InterProPartialDescription = {
                      ...cloneDeep(description),
                      [endpoint]: {
                        isFilter: true,
                        db,
                        order: 1,
                      },
                    };

                    if (description.main.key === 'taxonomy') {
                      to!.taxonomy!.accession = this.state.focused;
                      if (endpoint !== 'entry') to!.entry!.order = 2;
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
                          className={css('no-decoration', {
                            disable:
                              !currentNode?.counters?.[
                                plural as keyof TaxonomyCounters
                              ],
                          })}
                          to={{
                            description: to,
                          }}
                        >
                          <NumberComponent duration={ANIMATION_DURATION}>
                            {
                              currentNode?.counters?.[
                                plural as keyof TaxonomyCounters
                              ]
                            }
                          </NumberComponent>{' '}
                          {plural}
                        </Link>{' '}
                        -
                      </li>
                    );
                  })
                  .filter(Boolean)}
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
            taxID={exactMatch?.metadata.accession}
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
  (state: GlobalState) => state.settings.notifications.showTreeToast,
  (showTreeToast) => ({ showTreeToast }),
);

export default React.memo(
  connect(mapStateToProps, { goToCustomLocation })(TreeView),
);
