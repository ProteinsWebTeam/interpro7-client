// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import Accession from 'components/Protein/Accession';
import Lineage from 'components/Organism/Lineage';
import Children from 'components/Organism/Children';
import { TaxLink } from 'components/ExtLink';
import f from 'styles/foundation';

/*:: type Props = {
  data: {
    metadata: Object,
  },
}; */

class SummaryOrganism extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }).isRequired,
  };

  render() {
    const { data: { metadata } } = this.props;
    return (
      <div className={f('sections')}>
        <section>
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
                    <TaxLink id={metadata.accession}>ENA Link</TaxLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default SummaryOrganism;
