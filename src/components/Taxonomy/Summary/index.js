import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import TaxonomyVisualisation from 'taxonomy-visualisation';
import MemberDBSelector from 'components/MemberDBSelector';
import Loading from 'components/SimpleCommonComponents/Loading';
import loadable from 'higherOrder/loadable';

import Accession from 'components/Accession';
import Lineage from 'components/Taxonomy/Lineage';
import Children from 'components/Taxonomy/Children';

import global from 'styles/global.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
import memberSelectorStyle from 'components/Table/TotalNb/style.css';
import { foundationPartial } from 'styles/foundation';
import { createSelector } from 'reselect';
import { format } from 'url';
import { goToCustomLocation } from 'actions/creators';
import loadData from 'higherOrder/loadData';
import descriptionToPath from 'utils/processDescription/descriptionToPath';

const f = foundationPartial(ebiStyles, global, memberSelectorStyle);

export const parentRelationship = ({ taxId, name = null }) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  additionalType: 'http://semanticscience.org/resource/SIO_000095',
  name: 'is member of',
  value: {
    '@type': ['Organism', 'StructuredValue', 'BioChemEntity'],
    identifier: taxId,
    name,
  },
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Props = {
  data: {
    metadata: Object,
  },
  goToCustomLocation: function,
}; */

class SummaryTaxonomy extends PureComponent /*:: <Props> */ {
  /*::
    _vis: any;
    _ref: { current: ?HTMLElement };
  */
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.object.isRequired,
        names: T.object,
      }).isRequired,
    }).isRequired,
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
    });
    this._vis.addEventListener('focus', this._handleFocus);

    this._ref = React.createRef();
  }

  componentDidMount() {
    this._vis.tree = this._ref.current;
    this.loadingVis = true;
    this._populateData(this.props.data.payload);
    this.loadingVis = false;
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (prevProps.data !== this.props.data) {
      this.loadingVis = true;
      this._populateData(this.props.data.payload);
      this.loadingVis = false;
    }
  }

  _handleFocus = ({ detail: { id } }) => {
    if (!this.loadingVis)
      this.props.goToCustomLocation({
        description: {
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession: id },
        },
      });
  };

  _populateData = ({ metadata: data, names }) => {
    const lineage = data.lineage.trim().split(/\s+/);
    let root;
    let currentNode;
    for (const node of lineage) {
      const newNode = {
        name: names[node].short,
        id: node,
      };
      if (currentNode) {
        currentNode.children = [newNode];
      } else {
        root = newNode;
      }
      currentNode = newNode;
    }
    currentNode.name = data.name.short || data.name.name || data.accession;
    if (data.children) {
      currentNode.children = data.children.map(id => ({
        name: names[id].short,
        id,
      }));
    }
    this._vis.data = root;
    this._vis.focusNodeWithID(`${data.accession}`);
  };

  _handleChange = ({ target: { value } }) => {
    const {
      customLocation: { description },
    } = this.props;
    this.props.goToCustomLocation({
      search: {
        entry_db: value,
      },
      description,
    });
  };
  _isSelected = currentDB => {
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;
    return (db || 'all').toLowerCase() === currentDB.canonical.toLowerCase();
  };

  render() {
    if (this.props.data.loading) return <Loading />;
    const { metadata, names } = this.props.data.payload;
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;

    return (
      <div className={f('row')}>
        <div className={f('medium-12', 'columns')}>
          <MemberDBSelector
            contentType="taxonomy"
            filterType="entry"
            onChange={this._handleChange}
            isSelected={this._isSelected}
            hideCounters={true}
          >
            {open => (
              <span
                className={f('header-total-results', {
                  selector: typeof open === 'boolean',
                  open,
                })}
              >
                Entry Database: {db || 'All'}
              </span>
            )}
          </MemberDBSelector>
          <Accession
            accession={metadata.accession}
            id={metadata.id}
            title="Tax ID"
          />
          {metadata.rank && <div>Rank: {metadata.rank}</div>}
          {metadata.parent && (
            <SchemaOrgData
              data={{
                taxId: metadata.parent,
                name: names[metadata.parent] && names[metadata.parent].name,
              }}
              processData={parentRelationship}
            />
          )}
          <Lineage lineage={metadata.lineage} names={names} />
          <Children taxChildren={metadata.children} names={names} />
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
            <svg ref={this._ref} style={{ flex: '1' }} />
          </div>
        </div>
      </div>
    );
  }
}

const getUrl = createSelector(
  state => state.settings.api,
  state => state.customLocation.description,
  state => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    const { entry_db: db, ..._search } = search;
    const hasFilters = Object.values(description).some(
      endpoint => endpoint.isFilter,
    );
    _search.with_names = true;
    const newDescription =
      hasFilters || !db || db === 'all'
        ? description
        : {
            ...description,
            entry: {
              isFilter: true,
              db,
            },
          };
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(newDescription),
      query: _search,
    });
  },
);

export default loadData(getUrl)(
  connect(null, { goToCustomLocation })(SummaryTaxonomy),
);
