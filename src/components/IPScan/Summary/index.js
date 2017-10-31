// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';

import loadable from 'higherOrder/loadable';

import flattenDeep from 'lodash-es/flattenDeep';

import f from 'styles/foundation';

const DomainArchitectureWithoutData = loadable({
  loader: () =>
    import(/* webpackChunkName: "domain-architecture-subpage" */ 'components/Protein/DomainArchitecture'),
});

const goCategoryMap = new Map([
  ['BIOLOGICAL_PROCESS', 'Biological Process'],
  ['MOLECULAR_FUNCTION', 'Molecular Function'],
  ['CELLULAR_COMPONENT', 'Cellular Component'],
]);

class DomainArchitecture extends PureComponent {
  static propTypes = {
    payload: T.object.isRequired,
  };

  render() {
    const { payload } = this.props;
    const protein = {
      length: payload.sequenceLength,
    };
    // massage data to make it look like what is needed for
    // a standard domain architecture subpage
    const data = {
      integrated: new Map(),
      unintegrated: [],
    };
    for (const match of payload.matches) {
      const processedMatch = {
        accession: match.signature.accession,
        source_database: match.signature.signatureLibraryRelease.library,
        protein_length: payload.sequenceLength,
        coordinates: [match.locations.map(l => [l.start, l.end])],
        score: match.score,
      };
      if (match.signature.entry) {
        const accession = match.signature.entry.accession;
        const entry = data.integrated.get(accession) || {
          accession,
          source_database: 'InterPro',
          children: [],
        };
        entry.children.push(processedMatch);
        data.integrated.set(accession, entry);
      } else {
        data.unintegrated.push(processedMatch);
      }
    }
    data.integrated = Array.from(data.integrated.values()).map(m => {
      const coordinates = flattenDeep(m.children.map(s => s.coordinates));
      return {
        ...m,
        coordinates: [[[Math.min(...coordinates), Math.max(...coordinates)]]],
      };
    });
    data.unintegrated.sort((m1, m2) => m2.score - m1.score);
    return <DomainArchitectureWithoutData protein={protein} data={data} />;
  }
}

/*:: type Props = {
  accession: string,
  data: {
    payload: {
      results: Array<Object>,
    },
  },
}; */

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
        <DomainArchitecture payload={payload} />
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
