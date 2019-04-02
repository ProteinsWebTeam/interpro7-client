import React, { Component, PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import { goToCustomLocation } from 'actions/creators';
import { connect } from 'react-redux';

import Link from 'components/generic/Link';
import Tree from 'components/Tree';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import styles from './style.css';

const f = foundationPartial(styles);

const mapStateToUrlFor = createSelector(
  taxID => taxID,
  taxID =>
    createSelector(
      state => state.settings.api,
      state => state.customLocation.description,
      ({ protocol, hostname, port, root }, description) =>
        format({
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
        }),
    ),
);

class DataProvider extends PureComponent {
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

const mergeData = (root, update, names) => {
  const toUpdate = findNodeWithId(update.accession, root);
  if (!toUpdate.children || (update.children && update.children.length)) {
    toUpdate.children = update.children.map(id => ({
      name: names[id].short || names[id].name,
      id,
    }));
  }
  return root;
};

class TreeView extends Component {
  static propTypes = {
    customLocation: T.shape({
      description: T.object,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: { name: 'root', id: '1' },
      focused: '1',
      entryDB: props.customLocation.description.entry.db,
    };
    this._CDPMap = new Map();
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

  _handleNewData = (taxID, payload) =>
    this.setState(({ data }) => ({
      data: { ...mergeData(data, payload.metadata, payload.names) },
    }));

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

  render() {
    const { focused, data } = this.state;
    let ConnectedDataProvider = this._CDPMap.get(focused);
    if (!ConnectedDataProvider) {
      ConnectedDataProvider = loadData(mapStateToUrlFor(focused))(DataProvider);
      this._CDPMap.set(focused, ConnectedDataProvider);
    }
    return (
      <>
        <div>
          <Link
            className={f('button', 'hollow')}
            to={{
              description: {
                main: { key: 'taxonomy' },
                taxonomy: { db: 'uniprot', accession: focused },
              },
            }}
          >
            Go to taxonomy page for “{findNodeWithId(focused, data).name}”
          </Link>
        </div>
        <ConnectedDataProvider sendData={this._handleNewData} taxID={focused} />
        <Tree
          data={data}
          focused={focused}
          changeFocus={this._handleNewFocus}
          labelClick={this._handleLabelClick}
        />
      </>
    );
  }
}

export default connect(
  null,
  { goToCustomLocation },
)(TreeView);
