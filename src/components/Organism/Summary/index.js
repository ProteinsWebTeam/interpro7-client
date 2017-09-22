// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import Title from 'components/Title';
import Accession from 'components/Protein/Accession';
import Lineage from 'components/Organism/Lineage';
import Children from 'components/Organism/Children';
import Metadata from 'wrappers/Metadata';
import TaxIdOrName from 'components/Organism/TaxIdOrName';
import { TaxLink, ProteomeLink } from 'components/ExtLink';
import f from 'styles/foundation';
import uniprotLogo from 'images/uniprot.png';
import enaLogo from 'images/ena_small.png';

/*:: type Props = {
  data: {
    metadata: Object,
  },
}; */
const SummaryTaxonomy = ({metadata}) => (
  <div className={f('row')}>
    <div className={f('medium-8', 'large-8', 'columns')}>
      <Title metadata={metadata} mainType={'organism'} />
      <Accession metadata={metadata} />
      {metadata.rank && <div>Rank: {metadata.rank}</div>}
      <Lineage lineage={metadata.lineage} />
      <Children taxChildren={metadata.children} />
    </div>
    <div className={f('medium-4', 'large-4', 'columns')}>
      <div className={f('panel')}>
        <h5>External Links</h5>
        <ul className={f('chevron')}>
          <li>
            <TaxLink id={metadata.accession}><img src={enaLogo} alt="ENA" /></TaxLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);
const SummaryProteome = ({metadata}) => (
  <div className={f('row')}>
    <div className={f('medium-8', 'large-8', 'columns')}>
      <Title metadata={metadata} mainType={'organism'} />
      { metadata.is_reference ?
        <div className={f('tag')}>Reference Proteome</div> :
        null
      }
      <Accession metadata={metadata} />
      <div>Strain: {metadata.strain}</div>
      <div> Taxonomy:
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
    <div className={f('medium-4', 'large-4', 'columns')}>
      <div className={f('panel')}>
        <h5>External Links</h5>
        <ul className={f('chevron')}>
          <li>
            <ProteomeLink id={metadata.accession}><img src={uniprotLogo} alt="Uniprot" /></ProteomeLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

class SummaryOrganism extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
  };

  render() {
    const { data: { metadata }, location: {description} } = this.props;
    return (
      <div className={f('sections')}>
        <section>
          { description.mainDB === 'taxonomy' ?
            <SummaryTaxonomy metadata={metadata} /> :
            <SummaryProteome metadata={metadata} />
          }
        </section>
      </div>
    );
  }
}
const mapStateToProps = createSelector(
  state => state.newLocation,
  location => ({ location })
);
export default connect(mapStateToProps)(SummaryOrganism);
