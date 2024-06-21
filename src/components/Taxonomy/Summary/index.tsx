import React, { PureComponent } from 'react';
import { createSelector } from 'reselect';
import { format } from 'url';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData/ts';

import descriptionToPath from 'utils/processDescription/descriptionToPath';
import { goToCustomLocation } from 'actions/creators';

import MemberDBSelector from 'components/MemberDBSelector';
import Loading from 'components/SimpleCommonComponents/Loading';
import Accession from 'components/Accession';
import Lineage from 'components/Taxonomy/Lineage';
import Children from 'components/Taxonomy/Children';
import Tree from 'components/Tree';
import BaseLink from 'components/ExtLink/BaseLink';

import cssBinder from 'styles/cssBinder';

import memberSelectorStyle from 'components/Table/TotalNb/style.css';
import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';

const css = cssBinder(memberSelectorStyle, summary, ipro);

export const parentRelationship = ({
  taxId,
  name = null,
}: {
  taxId: string;
  name: string | null;
}) => ({
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

type Props = {
  goToCustomLocation: typeof goToCustomLocation;
  customLocation: InterProLocation;
};
type Payload = { metadata: TaxonomyMetadata } & WithNames & WithTaxonomyFilters;

interface LoadedProps extends Props, LoadDataProps<Payload, 'Names'> {}

type State = { data?: TaxNode | null; focused?: string };

export class SummaryTaxonomy extends PureComponent<LoadedProps, State> {
  loadingVis = false;
  state: State = {};

  componentDidMount() {
    if (this.props.dataNames?.payload) {
      this.loadingVis = true;
      this._populateData(this.props.dataNames.payload);
      this.loadingVis = false;
    }
  }

  componentDidUpdate(prevProps: LoadedProps) {
    if (
      prevProps.dataNames !== this.props.dataNames &&
      this.props.dataNames?.payload
    ) {
      this.loadingVis = true;
      this._populateData(this.props.dataNames.payload);
      this.loadingVis = false;
    }
  }

  _handleFocus = (accession: string) => {
    if (!this.loadingVis)
      this.props.goToCustomLocation({
        description: {
          main: { key: 'taxonomy' },
          taxonomy: { db: 'uniprot', accession },
        },
      });
  };

  _populateData = ({ metadata: data, names, children }: Payload) => {
    const lineage = data.lineage.trim().split(/\s+/);
    let root: TaxNode | null = null;
    let currentNode: TaxNode | null = null;
    for (const node of lineage) {
      const newNode: TaxNode = {
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
    if (currentNode) {
      currentNode.name =
        (data.name as NameObject)?.short ||
        (data.name as NameObject)?.name ||
        data.accession;
      currentNode.hitcount = data?.counters?.proteins as number;

      if (data.children) {
        currentNode.children = data.children.map((id) => ({
          name: names[id].short,
          id,
          hitcount: children?.[id]?.proteins,
        }));
      }
      this.setState({ data: root, focused: `${data.accession}` });
    }
  };

  _handleChange = (event: React.FormEvent) => {
    const value = (event.target as HTMLSelectElement).value;
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

  _isSelected = (currentDB: DBInfo) => {
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;
    return (
      ((db as string) || 'all').toLowerCase() ===
      currentDB.canonical.toLowerCase()
    );
  };

  render() {
    if (
      this.props.dataNames?.loading ||
      !this.props.dataNames?.payload?.metadata
    )
      return <Loading />;
    const { metadata, names } = this.props.dataNames.payload;
    const {
      customLocation: {
        search: { entry_db: db },
      },
    } = this.props;

    return (
      <div className={css('vf-stack', 'vf-stack--400')}>
        <section className={css('vf-grid', 'summary-grid')}>
          <div className={css('vf-stack')}>
            <table className={css('vf-table', 'left-headers')}>
              <tbody>
                <tr>
                  <td style={{ maxWidth: '50%' }}>Taxon ID</td>
                  <td>
                    <Accession
                      accession={metadata.accession}
                      title="Taxon ID"
                    />
                  </td>
                </tr>
                {metadata.rank && (
                  <tr>
                    <td>Rank</td>
                    <td className={css('first-letter-cap')}>{metadata.rank}</td>
                  </tr>
                )}

                {metadata.parent && (
                  <SchemaOrgData
                    data={{
                      taxId: metadata.parent,
                      name:
                        names[metadata.parent] && names[metadata.parent].name,
                    }}
                    processData={parentRelationship}
                  />
                )}

                <tr>
                  <td>Lineage</td>
                  <td
                    className={css('ico-primary')}
                    data-testid="taxonomy-lineage"
                  >
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
          </div>
          <div className={css('vf-stack')}>
            <section>
              <h5>External Links</h5>
              <ul className={css('no-bullet')}>
                <li>
                  <BaseLink
                    id={metadata.accession}
                    target="_blank"
                    pattern="https://www.uniprot.org/taxonomy/{id}"
                    className={css('ext')}
                  >
                    UniProt
                  </BaseLink>
                </li>
              </ul>
            </section>
          </div>
        </section>
        <div>
          {
            // @ts-expect-error until MemberDB is migrated to TS
            <MemberDBSelector
              contentType="taxonomy"
              filterType="entry"
              onChange={this._handleChange}
              isSelected={this._isSelected}
              hideCounters={true}
            >
              {(open: string) => (
                <span
                  className={css(
                    'header-total-results',
                    'margin-bottom-medium',
                    {
                      selector: typeof open === 'boolean',
                      open,
                    },
                  )}
                >
                  Entry Database: {db || 'All'}
                </span>
              )}
            </MemberDBSelector>
          }
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
  (state: GlobalState) => state.settings.api,
  (state: GlobalState) => state.customLocation.description,
  (state: GlobalState) => state.customLocation.search,
  ({ protocol, hostname, port, root }, description, search) => {
    const { entry_db: db, ..._search } = search;
    const hasFilters = Object.values(description).some(
      (endpoint) => !!(endpoint as EndpointPartialLocation).isFilter,
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

export default loadData<{ metadata: TaxonomyMetadata } & WithNames, 'Names'>({
  getUrl,
  propNamespace: 'Names',
  mapDispatchToProps: { goToCustomLocation },
} as LoadDataParameters)(SummaryTaxonomy);
