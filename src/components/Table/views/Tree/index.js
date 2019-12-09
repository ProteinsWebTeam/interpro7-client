import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import {
  goToCustomLocation,
  addToast,
  changeSettingsRaw,
} from 'actions/creators';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import Tree from 'components/Tree';
import NumberComponent from 'components/NumberComponent';
import abbreviateNumber from 'components/NumberComponent/utils/number-to-display-text';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, styles, fonts);
const ANIMATION_DURATION = 0.3;

const mapStateToUrlFor = createSelector(
  taxID => taxID,
  taxID =>
    createSelector(
      state => state.settings.api,
      state => state.customLocation.description,
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
/*:: type Props = {
  taxID: string,
  data: {
    loading: boolean,
    payload: Object
  },
  sendData: function
};*/
class DataProvider extends PureComponent /*:: <Props> */ {
  static propTypes = {
    taxID: T.string.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.object,
    }).isRequired,
    sendData: T.func.isRequired,
  };

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

const findNodeWithId = (id, node) => {
  if (node.id === id) return node;
  for (const child of node.children || []) {
    const found = findNodeWithId(id, child);
    if (found) return found;
  }
};

const mergeData = (root, update, names, childrenCounters) => {
  const toUpdate = findNodeWithId(update.accession, root);
  toUpdate.lineage = update.lineage;
  toUpdate.counters = update.counters;
  toUpdate.rank = update.rank;
  toUpdate.hitcount = abbreviateNumber(update?.counters?.proteins, true);
  if (!toUpdate.children || (update.children && update.children.length)) {
    toUpdate.children = update.children.map(id => ({
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
  goToCustomLocation: function,
  showTreeToast: boolean,
  addToast: function,
  changeSettingsRaw: function,
};*/

/*:: type State = {
  data: {name: string, id: string},
  focused: string,
  entryDB: Object,
}; */
class TreeView extends Component /*:: <TreeViewProps, State> */ {
  /*:: _CDPMap: Map<string, Object>*/
  static propTypes = {
    customLocation: T.shape({
      description: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    showTreeToast: T.bool,
    addToast: T.func,
    changeSettingsRaw: T.func,
  };

  constructor(props /*: TreeViewProps */) {
    super(props);

    this.state = {
      data: { name: 'root', id: '1' },
      focused: '1',
      entryDB: props.customLocation.description.entry.db,
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
    },
    { entryDB: oldDB },
  ) {
    // componentDidUpdate({customLocation: {description: {entry: {db: oldDB}}}}) {
    //   const {customLocation: {description: {entry: {db: newDB}}}} = this.props;
    if (newDB !== oldDB) {
      // this._CDPMap.clear();
      return {
        focused: '1',
        entryDB: newDB,
      };
    }
    return null;
  }

  updateToastSettings(context) {
    context.props.changeSettingsRaw('tips', 'showTreeToast', false);
  }

  componentDidMount() {
    if (this.props.showTreeToast) {
      this.props.addToast(
        {
          title: '💡 Tip',
          body: 'Arrow keys can be used to navigate the tree',
          action: {
            text: 'Do not show again',
            fn: () => this.updateToastSettings(this),
          },
          ttl: 10000,
        },
        'tip',
      );
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
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

  _handleNewData = (taxID, payload) => {
    if (payload?.metadata?.children) {
      const c = payload.metadata.children.length;
      if (c === 1 && this._initialLoad) {
        this._handleNewFocus(payload.metadata.children[0]);
      } else {
        this._initialLoad = false;
      }
    }
    this.setState(({ data }) => ({
      data: {
        ...mergeData(data, payload.metadata, payload.names, payload.children),
      },
    }));
  };

  _handleNewFocus = taxID => {
    if (taxID) this.setState({ focused: taxID });
  };
  _handleLabelClick = taxID => {
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

  _storeLineageNames = (focused, data) => {
    if (focused === data.id) {
      this._lineageNames.set(focused, data.name);
    } else {
      data?.children?.forEach(child => {
        this._storeLineageNames(focused, child);
      });
    }
  };

  render() {
    const { focused, data } = this.state;
    let ConnectedDataProvider = this._CDPMap.get(focused);
    if (!ConnectedDataProvider) {
      ConnectedDataProvider = loadData(mapStateToUrlFor(focused))(DataProvider);
      this._CDPMap.set(focused, ConnectedDataProvider);
      this._storeLineageNames(focused, data);
    }
    const currentNode = findNodeWithId(focused, data);
    const {
      customLocation: { description },
    } = this.props;
    const mainEndpoint = description.main.key;
    const countersToShow = {
      entry: ['entries', 'all'],
      protein: ['proteins', 'uniprot'],
      structure: ['structures', 'pdb'],
      proteome: ['proteomes', 'uniprot'],
    };
    return (
      <>
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
                {currentNode.id}: {currentNode.name}
              </Link>
            </header>
            {currentNode.rank && currentNode.rank.toLowerCase() !== 'no rank' && (
              <div>
                <Tooltip title="Rank.">
                  <span
                    className={f('small', 'icon', 'icon-common')}
                    data-icon="&#xf129;"
                    aria-label="Rank."
                  />
                </Tooltip>{' '}
                <i>{currentNode.rank}</i>
              </div>
            )}
            {currentNode.lineage && (
              <DropDownButton label="Lineage" fontSize="12px">
                <ul>
                  {Array.from(this._lineageNames.keys()).map(key => (
                    <li key={key}>
                      <Link
                        to={{
                          description: {
                            main: { key: 'taxonomy' },
                            taxonomy: { db: 'uniprot', accession: key },
                          },
                        }}
                      >
                        {this._lineageNames
                          .get(key)
                          .charAt(0)
                          .toUpperCase() + this._lineageNames.get(key).slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </DropDownButton>
            )}
          </div>
          {currentNode.counters && (
            <div className={f('node-links')}>
              <ul>
                {Object.entries(countersToShow)
                  .map(([endpoint, [plural, db]]) => {
                    if (
                      endpoint === mainEndpoint ||
                      typeof currentNode.counters[plural] === 'undefined'
                    )
                      return null;

                    const to = {
                      ...description,
                      [endpoint]: {
                        db,
                        isFilter: true,
                        order: 1,
                      },
                    };
                    if (description.main.key !== 'taxonomy') {
                      to.taxonomy = {
                        db: 'uniprot',
                        isFilter: true,
                        order: 2,
                      };
                    }

                    return (
                      <li key={endpoint}>
                        <Link
                          className={f('no-decoration', {
                            disable: !currentNode.counters[plural],
                          })}
                          to={{
                            description: to,
                          }}
                        >
                          <NumberComponent duration={ANIMATION_DURATION}>
                            {currentNode.counters[plural]}
                          </NumberComponent>{' '}
                          {plural}
                        </Link>{' '}
                        -
                      </li>
                    );
                  })
                  .filter(Boolean)}
              </ul>
            </div>
          )}
        </div>
        <ConnectedDataProvider sendData={this._handleNewData} taxID={focused} />
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
  state => state.settings.tips.showTreeToast,
  showTreeToast => ({ showTreeToast }),
);

export default connect(
  mapStateToProps,
  { goToCustomLocation, addToast, changeSettingsRaw },
)(TreeView);
