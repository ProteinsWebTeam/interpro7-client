import React, { PureComponent } from 'react';
import T from 'prop-types';

import Accession from 'components/Accession';
import Species from 'components/Protein/Species';
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
          <table className={f('light', 'table-sum')}>
            <tbody>
              <tr>
                <td>Proteome ID</td>
                <td>
                  <Accession
                    accession={metadata.proteomeAccession || metadata.accession}
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
                <td>
                  <Species
                    fullName={metadata.name.name}
                    taxID={metadata.taxonomy}
                  />
                </td>
              </tr>
              <tr>
                <td>Proteome type</td>
                <td>
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
              <li>
                <ProteomeLink id={metadata.accession} className={f('ext')}>
                  View {metadata.accession.toUpperCase()} in UniProt
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
