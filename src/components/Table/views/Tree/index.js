import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Link from 'components/generic/Link';

import TaxonomyVisualisation from 'taxonomy-visualisation';

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
              main: { key: 'organism' },
              organism: {
                db: 'taxonomy',
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

class GraphicalView extends PureComponent {
  static propTypes = {
    data: T.object.isRequired,
    focused: T.string.isRequired,
    changeFocus: T.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
    });
    this._vis.addEventListener('focus', this._handleFocus);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._vis.tree = this._ref.current;
    this._loadingVis = true;
    this._populateData(this.props.data, this.props.focused);
    this._loadingVis = false;
  }

  componentDidUpdate({ data, focused }) {
    if (data !== this.props.data) {
      this._loadingVis = true;
      this._populateData(this.props.data, this.props.focused);
      this._loadingVis = false;
    }
    if (focused !== this.props.focused) {
      this._vis.focusNodeWithID(this.props.focused);
    }
  }

  componentWillUnmount() {
    this._vis.cleanup();
  }

  _handleFocus = ({ detail: { id } }) => {
    if (!this._loadingVis) this.props.changeFocus(id);
  };

  _populateData = (data, focused) => {
    this._vis.data = data;
    this._vis.focusNodeWithID(focused);
  };

  render() {
    return (
      <div
        style={{
          width: '100%',
          height: '50vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        <svg className={f('container')} ref={this._ref} style={{ flex: '1' }} />
      </div>
    );
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

class TreeView extends PureComponent {
  static propTypes = {
    customLocation: T.shape({
      description: T.object,
    }).isRequired,
  };
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
  constructor(props) {
    super(props);
    this.state = {
      data: { name: 'root', id: '1' },
      focused: '1',
      entryDB: props.customLocation.description.entry.db,
    };
    this._CDPMap = new Map();
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

  render() {
    const { focused, data } = this.state;
    let ConnectedDataProvider = this._CDPMap.get(focused);
    if (!ConnectedDataProvider) {
      ConnectedDataProvider = loadData(mapStateToUrlFor(focused))(DataProvider);
      this._CDPMap.set(focused, ConnectedDataProvider);
    }
    return (
      <Fragment>
        <div>
          <Link
            className={f('button', 'hollow')}
            to={{
              description: {
                main: { key: 'organism' },
                organism: { db: 'taxonomy', accession: focused },
              },
            }}
          >
            Go to taxonomy page for “{findNodeWithId(focused, data).name}”
          </Link>
        </div>
        <ConnectedDataProvider sendData={this._handleNewData} taxID={focused} />
        <GraphicalView
          data={data}
          focused={focused}
          changeFocus={this._handleNewFocus}
        />
      </Fragment>
    );
  }
}

export default TreeView;
