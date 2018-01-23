// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';
import { DomainOnProteinWithoutMergedData } from 'components/Related/DomainsOnProtein';

import flattenDeep from 'lodash-es/flattenDeep';

import f from 'styles/foundation';

const goCategoryMap = new Map([
  ['BIOLOGICAL_PROCESS', 'Biological Process'],
  ['MOLECULAR_FUNCTION', 'Molecular Function'],
  ['CELLULAR_COMPONENT', 'Cellular Component'],
]);

/*:: type Props = {
  accession: string,
  data: {
    payload: {
      results: Array<Object>,
    },
  },
}; */

// TODO: have consistent data to eventually remove this
const LUT = new Map([
  ['TIGRFAM', 'tigrfams'],
  ['PROSITE_PROFILES', 'profile'],
  ['PROSITE_PATTERNS', 'patterns'],
  ['SUPERFAMILY', 'ssf'],
  ['COILS', 'gene3d'],
]);

class SummaryIPScanJob extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.string.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }),
  };

  render() {
    const { data: { payload: { results: [payload] } }, accession } = this.props;
    const metadata = {
      accession: payload.crossReferences[0].identifier,
      length: payload.sequenceLength,
      sequence: payload.sequence,
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

    const mergedData = { unintegrated: [] };
    let integrated = new Map();
    for (const match of payload.matches) {
      const { library } = match.signature.signatureLibraryRelease;
      const processedMatch = {
        accession: match.signature.accession,
        source_database: LUT.get(library) || library,
        protein_length: payload.sequenceLength,
        locations: [
          {
            fragments: match.locations.map(l => ({
              start: l.start,
              end: l.end,
            })),
          },
        ],
        score: match.score,
      };
      if (match.signature.entry) {
        const accession = match.signature.entry.accession;
        const entry = integrated.get(accession) || {
          accession,
          source_database: 'InterPro',
          children: [],
          type: match.signature.entry.type.toLowerCase(),
        };
        entry.children.push(processedMatch);
        integrated.set(accession, entry);
      } else {
        mergedData.unintegrated.push(processedMatch);
      }
    }
    integrated = Array.from(integrated.values()).map(m => {
      const locations = flattenDeep(
        m.children.map(s =>
          s.locations.map(l => l.fragments.map(f => [f.start, f.end])),
        ),
      );
      return {
        ...m,
        locations: [
          {
            fragments: [
              { start: Math.min(...locations), end: Math.max(...locations) },
            ],
          },
        ],
      };
    });
    mergedData.unintegrated.sort((m1, m2) => m2.score - m1.score);
    for (const entry of integrated) {
      if (!mergedData[entry.type]) mergedData[entry.type] = [];
      mergedData[entry.type].push(entry);
    }

    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-10', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType="protein" />
              <Accession accession={accession} title="Job ID" />
              <Length metadata={metadata} />
            </div>
          </div>
        </section>
        <DomainOnProteinWithoutMergedData
          mainData={{ metadata }}
          dataMerged={mergedData}
        />
        <GoTerms terms={Array.from(goTerms.values())} type="protein" />
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.customLocation.description.job.accession,
  accession => ({ accession }),
);

export default connect(mapStateToProps)(SummaryIPScanJob);
