import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToCustomLocation } from 'actions/creators';

import Accession from 'components/Accession';
import Lineage from 'components/Organism/Lineage';
import Children from 'components/Organism/Children';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';
import { ProteomeLink } from 'components/ExtLink';
import Loading from 'components/SimpleCommonComponents/Loading';

import TaxonomyVisualisation from 'taxonomy-visualisation';

import { foundationPartial } from 'styles/foundation';

import global from 'styles/global.css';
import ebiStyles from 'ebi-framework/css/ebi-global.scss';

import { getUrlForApi } from 'higherOrder/loadData/defaults';
import loadData from 'higherOrder/loadData';
import loadable from 'higherOrder/loadable';

const f = foundationPartial(ebiStyles, global);

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
          main: { key: 'organism' },
          organism: { db: 'taxonomy', accession: id },
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

  render() {
    // const { data: { metadata } } = this.props;
    const { metadata, names } = this.props.data.payload;
    return (
      <div className={f('row')}>
        <div className={f('medium-12', 'columns')}>
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

class SummaryProteome extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.object.isRequired,
      }),
    }).isRequired,
  };
  render() {
    const { data: { payload: { metadata } } } = this.props;
    return (
      <div className={f('row')}>
        <div className={f('medium-9', 'columns')}>
          {
            // metadata.is_reference ? (
            // <div className={f('tag', 'secondary', 'margin-bottom-large')}>
            //  Reference Proteome
            // </div>
            // ) : null
          }
          <div>
            <Accession
              id={metadata.id}
              accession={metadata.proteomeAccession || metadata.accession}
              title="Proteome ID"
            />
          </div>
          <div>Strain: {metadata.strain}</div>
          <div>
            Taxonomy:{' '}
            <Metadata
              endpoint="organism"
              db="taxonomy"
              accession={metadata.taxonomy}
              key={metadata.taxonomy}
            >
              <TaxIdOrName accession={metadata.taxonomy} />
            </Metadata>
          </div>
        </div>
        <div className={f('medium-3', 'columns')}>
          <div className={f('panel')}>
            <h5>External Links</h5>
            <ul className={f('no-bullet')}>
              <li>
                <ProteomeLink id={metadata.accession} className={f('ext')}>
                  View this proteome in UniProt
                </ProteomeLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class SummaryOrganism extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.object.isRequired,
      }),
    }).isRequired,
    loading: T.bool.isRequired,
    isStale: T.bool.isRequired,
  };

  render() {
    if (
      this.props.loading ||
      !this.props.data ||
      !this.props.data.payload ||
      this.props.isStale
    ) {
      return <Loading />;
    }
    const { metadata: { source_database: db } } = this.props.data.payload;
    return (
      <div className={f('sections')}>
        {db === 'taxonomy' ? <SummaryTaxonomy {...this.props} /> : null}
        {db === 'proteome' ? <SummaryProteome {...this.props} /> : null}
      </div>
    );
  }
}

export default loadData((...args) => {
  const url = getUrlForApi(...args);
  return `${url}${url.includes('?') ? '&' : '?'}with_names`;
})(connect(null, { goToCustomLocation })(SummaryOrganism));
