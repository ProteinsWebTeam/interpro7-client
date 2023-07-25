// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

// $FlowFixMe
import Accession from 'components/Accession';
// $FlowFixMe
import Species from 'components/Protein/Species';
// $FlowFixMe
import ProteomeLink from 'components/ExtLink/ProteomeLink';
import Loading from 'components/SimpleCommonComponents/Loading';
import SarsCov2 from 'components/Proteome/SarsCov2';

import { foundationPartial } from 'styles/foundation';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import memberSelectorStyle from 'components/Table/TotalNb/style.css';

const f = foundationPartial(ebiStyles, memberSelectorStyle);

/*:: type Props = {
  data: {
    metadata: Object
  },
  loading: boolean
}; */
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
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-9', 'columns')}>
              <table className={f('light', 'table-sum')}>
                <tbody>
                  <tr>
                    <td>Proteome ID</td>
                    <td data-testid="proteome-accession">
                      <Accession
                        accession={
                          metadata.proteomeAccession || metadata.accession
                        }
                        title="Proteome ID"
                      />
                    </td>
                  </tr>
                  {metadata.strain && (
                    <tr>
                      <td>Strain</td>
                      <td>{metadata.strain}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Species</td>
                    <td data-testid="proteome-species">
                      <Species
                        fullName={metadata.name.name}
                        taxID={metadata.taxonomy}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Proteome type</td>
                    <td data-testid="proteome-type">
                      {metadata.is_reference ? 'Reference' : 'Non-reference'}{' '}
                      proteome
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className={f('medium-3', 'columns')}>
              <div className={f('panel')}>
                <h5>External Links</h5>
                <ul className={f('no-bullet')}>
                  <li data-testid="proteome-external-links">
                    <ProteomeLink id={metadata.accession} className={f('ext')}>
                      View {metadata.accession} in UniProt
                    </ProteomeLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        {metadata.accession === 'UP000464024' && (
          <SarsCov2 metadata={metadata} />
        )}
      </div>
    );
  }
}

export default SummaryProteome;
