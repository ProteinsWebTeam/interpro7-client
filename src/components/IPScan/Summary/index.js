// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import GoTerms from 'components/GoTerms';
import Sequence from 'components/Protein/Sequence';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';

import f from 'styles/foundation';

/*:: type Props = {
  accession: string,
  data: {
    payload: {
      results: Array<Object>,
    },
  },
}; */

const goCategoryMap = new Map([
  ['BIOLOGICAL_PROCESS', 'Biological Process'],
  ['MOLECULAR_FUNCTION', 'Molecular Function'],
  ['CELLULAR_COMPONENT', 'Cellular Component'],
]);

class SummaryIPScanJob extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.string.isRequired,
    data: T.shape({
      payload: T.shape({
        results: T.array.isRequired,
      }),
    }).isRequired,
  };

  render() {
    const { data: { payload: { results: [payload] } }, accession } = this.props;
    const metadata = {
      accession: payload.crossReferences[0].identifier,
      length: payload.sequenceLength,
      name: {
        name: 'InterProScan Search',
        short: payload.crossReferences[0].name,
      },
    };
    const goTerms = new Map();
    for (const match of payload.matches) {
      for (const go of (match.signature.entry || {}).goXRefs || []) {
        goTerms.set(go.identifier, {
          category: goCategoryMap.get(go.category),
          name: go.name,
          identifier: go.identifier,
        });
      }
    }
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType={'protein'} />
              <Accession accession={accession} />
              <Length metadata={metadata} />
            </div>
          </div>
        </section>
        <Sequence accession={accession} sequence={payload.sequence} />
        <GoTerms terms={Array.from(goTerms.values())} type="protein" />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.newLocation.description.mainAccession,
  accession => ({ accession }),
);

export default connect(mapStateToProps)(SummaryIPScanJob);
