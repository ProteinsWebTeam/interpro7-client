import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';

import { goToNewLocation } from 'actions/creators';

import Title from 'components/Title';
import Accession from 'components/Accession';
import Lineage from 'components/Organism/Lineage';
import Children from 'components/Organism/Children';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';
import { ProteomeLink } from 'components/ExtLink';

import TaxonomyVisualisation from 'taxonomy-visualisation';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import { getUrlForApi } from 'higherOrder/loadData/defaults';
import loadData from 'higherOrder/loadData';

const f = foundationPartial(ebiStyles);

/*:: type Props = {
  data: {
    metadata: Object,
  },
  goToNewLocation: function,
}; */

class SummaryTaxonomy extends PureComponent /*:: <Props> */ {
  /*::
    _vis: any;
    _tree: ?HTMLElement;
    _focus: ?HTMLElement;
  */
  static propTypes = {
    data: T.shape({
      payload: T.shape({
        metadata: T.object.isRequired,
        names: T.object,
      }).isRequired,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
  };

  constructor(props) {
    super(props);
    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
    });
    this._vis.addEventListener('focus', this._handleFocus);
  }

  componentDidMount() {
    this._vis.tree = this._tree;
    this._vis.focus = this._focus;
    this.loadingVis = true;
    this._populateData(this.props.data.payload);
    this.loadingVis = false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.loadingVis = true;
      this._populateData(nextProps.data.payload);
      this.loadingVis = false;
    }
  }

  _handleFocus = ({ detail: { id } }) => {
    if (!this.loadingVis)
      this.props.goToNewLocation({
        description: {
          mainType: 'organism',
          mainDB: 'taxonomy',
          mainAccession: id,
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
          <Title metadata={metadata} mainType={'organism'} />
          <Accession accession={metadata.accession} id={metadata.id} />
          {metadata.rank && <div>Rank: {metadata.rank}</div>}
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
            <svg ref={node => (this._tree = node)} style={{ flex: '1' }} />
            <div ref={node => (this._focus = node)} style={{ height: '5em' }} />
          </div>
        </div>
      </div>
    );
  }
}

class SummaryProteome extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
    goToNewLocation: T.func.isRequired,
  };

  render() {
    const { data: { metadata } } = this.props;
    return (
      <div className={f('row')}>
        <div className={f('medium-10', 'columns')}>
          <Title metadata={metadata} mainType={'organism'} />
          {metadata.is_reference ? (
            <div className={f('tag', 'secondary', 'margin-bottom-large')}>
              Reference Proteome
            </div>
          ) : null}
          <div>
            <Accession accession={metadata.accession} id={metadata.id} />
          </div>
          <div>Strain: {metadata.strain}</div>
          <div>
            Taxonomy:{' '}
            <Metadata
              endpoint={'organism'}
              db={'taxonomy'}
              accession={metadata.taxonomy}
              key={metadata.taxonomy}
            >
              <TaxIdOrName accession={metadata.taxonomy} />
            </Metadata>
          </div>
        </div>
        <div className={f('medium-2', 'columns')}>
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
  };

  render() {
    if (this.props.loading || !this.props.data || !this.props.data.payload) {
      return (
        <div className={f('row')}>
          <div className={f('columns')}>Loading…</div>
        </div>
      );
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
export default loadData((...args) => `${getUrlForApi(...args)}?with_names`)(
  connect(null, { goToNewLocation })(SummaryOrganism),
);
