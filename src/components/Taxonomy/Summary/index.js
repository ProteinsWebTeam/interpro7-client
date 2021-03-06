import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';
import TaxonomyVisualisation from 'taxonomy-visualisation';

import MemberDBSelector from 'components/MemberDBSelector';
import Loading from 'components/SimpleCommonComponents/Loading';
import Accession from 'components/Accession';
import Lineage from 'components/Taxonomy/Lineage';
import Children from 'components/Taxonomy/Children';
import Tree from 'components/Tree';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';

import descriptionToPath from 'utils/processDescription/descriptionToPath';

import { goToCustomLocation } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import memberSelectorStyle from 'components/Table/TotalNb/style.css';

const f = foundationPartial(ebiStyles, memberSelectorStyle);

export const parentRelationship = (
  { taxId, name = null } /*: {taxId: string, name: string} */,
) => ({
  '@id': '@additionalProperty',
  '@type': 'PropertyValue',
  additionalType: 'http://semanticscience.org/resource/SIO_000095',
  name: 'is member of',
  value: {
    '@type': 'StructuredValue',
    additionalType: ['bio:Taxon', 'bio:BioChemEntity'],
    identifier: taxId,
    name,
  },
});

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Props = {
  dataNames: {
    payload: {
      metadata: Object,
      names: Object
    },
    loading: boolean,
  },
  goToCustomLocation: function,
  customLocation: Object
}; */

export class SummaryTaxonomy extends PureComponent /*:: <Props> */ {
  /*::
    _vis: any;
    _ref: { current: ?HTMLElement };
    loadingVis: boolean;
  */
  static propTypes = {
    dataNames: T.shape({
      payload: T.shape({
        metadata: T.object.isRequired,
        names: T.object,
      }),
      loading: T.bool,
    }),
    goToCustomLocation: T.func.isRequired,
    customLocation: T.object.isRequired,
  };

  constructor(props /*: Props */) {
    super(props);

    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
      fisheye: true,
    });
    this._vis.addEventListener('focus', this._handleFocus);

    this._ref = React.createRef();

    this.state = {};
  }

  componentDidMount() {
    this._vis.tree = this._ref.current;
    if (this.props.dataNames.payload) {
      this.loadingVis = true;
      this._populateData(this.props.dataNames.payload);
      this.loadingVis = false;
    }
  }

  componentDidUpdate(prevProps /*: Props */) {
    if (
      prevProps.dataNames !== this.props.dataNames &&
      this.props.dataNames.payload
    ) {
      this._vis.tree = this._ref.current;
      this.loadingVis = true;
      this._populateData(this.props.dataNames.payload);
      this.loadingVis = false;
    }
  }

  _handleFocus = (accession) => {
    if (!this.loadingVis)
      this.props.goToCustomLocation({
        description: {
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession },
        },
      });
  };

  _populateData = ({ metadata: data, names, children }) => {
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
    currentNode.hitcount = data?.counters?.proteins;

    if (data.children) {
      currentNode.children = data.children.map((id) => ({
        name: names[id].short,
        id,
        hitcount: children?.[id]?.proteins,
      }));
    }
    this.setState({ data: root, focused: `${data.accession}` });
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

  _isSelected = (currentDB) => {
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;
    return (db || 'all').toLowerCase() === currentDB.canonical.toLowerCase();
  };

  render() {
    if (
      this.props.dataNames.loading ||
      !this.props.dataNames.payload ||
      !this.props.dataNames.payload.metadata
    )
      return <Loading />;
    const { metadata, names } = this.props.dataNames.payload;
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;

    return (
      <div className={f('row')}>
        <div className={f('medium-12', 'columns')}>
          <table className={f('light', 'table-sum')}>
            <tbody>
              <tr>
                <td>Tax ID</td>
                <td data-testid="taxonomy-taxid">
                  <Accession accession={metadata.accession} title="Tax ID" />
                </td>
              </tr>
              {metadata.rank && (
                <tr>
                  <td>Rank</td>
                  <td className={f('text-up')} data-testid="taxonomy-rank">
                    {metadata.rank}
                  </td>
                </tr>
              )}

              {
                // SP: is this still working ?
                metadata.parent && (
                  <SchemaOrgData
                    data={{
                      taxId: metadata.parent,
                      name:
                        names[metadata.parent] && names[metadata.parent].name,
                    }}
                    processData={parentRelationship}
                  />
                )
              }

              <tr>
                <td>Lineage</td>
                <td className={f('ico-primary')} data-testid="taxonomy-lineage">
                  <Lineage lineage={metadata.lineage} names={names} />
                </td>
              </tr>
              <tr>
                <td>Children</td>
                <td data-testid="taxonomy-children">
                  <Children
                    taxChildren={metadata.children || []}
                    names={names}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <MemberDBSelector
            contentType="taxonomy"
            filterType="entry"
            onChange={this._handleChange}
            isSelected={this._isSelected}
            hideCounters={true}
          >
            {(open) => (
              <span
                className={f('header-total-results', 'margin-bottom-medium', {
                  selector: typeof open === 'boolean',
                  open,
                })}
              >
                Entry Database: {db || 'All'}
              </span>
            )}
          </MemberDBSelector>

          <Tree
            data={this.state.data}
            focused={this.state.focused}
            changeFocus={this._handleFocus}
          />
        </div>
      </div>
    );
  }
}

const getUrl = createSelector(
  (state) => state.settings.api,
  (state) => state.customLocation.description,
  (state) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    const { entry_db: db, ..._search } = search;
    const hasFilters = Object.values(description).some(
      (endpoint) => endpoint.isFilter,
    );
    if (hasFilters || !db || db === 'all') _search.with_names = true;
    else _search.filter_by_entry_db = db;
    return format({
      protocol,
      hostname,
      port,
      pathname: root + descriptionToPath(description),
      query: _search,
    });
  },
);

export default loadData({
  getUrl,
  propNamespace: 'Names',
  mapDispatchToProps: { goToCustomLocation },
})(SummaryTaxonomy);
