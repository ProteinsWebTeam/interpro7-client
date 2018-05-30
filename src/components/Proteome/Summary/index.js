import React, { PureComponent } from 'react';
import T from 'prop-types';

import Accession from 'components/Accession';
import TaxIdOrName from 'components/Taxonomy/TaxIdOrName';
import { ProteomeLink } from 'components/ExtLink';
import Loading from 'components/SimpleCommonComponents/Loading';

import global from 'styles/global.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
import memberSelectorStyle from 'components/Table/TotalNb/style.css';
import { foundationPartial } from 'styles/foundation';

const f = foundationPartial(ebiStyles, global, memberSelectorStyle);

class SummaryProteome extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    loading: T.bool.isRequired,
  };
  render() {
    if (this.props.loading || !this.props.data.metadata) return <Loading />;
    const {
      data: { metadata },
    } = this.props;
    return (
      <div className={f('row')}>
        <div className={f('medium-9', 'columns')}>
          <div>
            <Accession
              id={metadata.id}
              accession={metadata.proteomeAccession || metadata.accession}
              title="Proteome ID"
            />
          </div>
          <div>Strain: {metadata.strain}</div>
          <div>
            Taxonomy: <TaxIdOrName accession={metadata.taxonomy} />
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

export default SummaryProteome;
