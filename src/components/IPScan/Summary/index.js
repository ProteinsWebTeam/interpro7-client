import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';
import { DomainOnProteinWithoutMergedData } from 'components/Related/DomainsOnProtein';
import Actions from 'components/IPScan/Actions';

import flattenDeep from 'lodash-es/flattenDeep';

import f from 'styles/foundation';

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
  ['GENE3D', 'cathgene3d'],
  ['COILS', 'cathgene3d'],
]);

class SummaryIPScanJob extends PureComponent /*:: <Props> */ {
  static propTypes = {
    accession: T.string.isRequired,
    localID: T.string,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }),
  };

  render() {
    const {
      data: {
        payload: {
          results: [payload],
        },
      },
      accession,
      localID,
    } = this.props;
    const metadata = {
      accession,
      length: payload.sequence.length,
      sequence: payload.sequence,
      name: {
        name: 'InterProScan Search',
        short: payload.xref[0].name,
      },
    };

    const goTerms = new Map();
    for (const match of payload.matches) {
      for (const { id, category, name } of (match.signature.entry || {})
        .goXRefs || []) {
        goTerms.set(id, {
          category: {
            name: category.toLowerCase(),
            code: category[0],
          },
          name,
          identifier: id,
        });
      }
    }

    const mergedData = { unintegrated: [] };
    let integrated = new Map();
    for (const match of payload.matches) {
      const { library } = match.signature.signatureLibraryRelease;
      const processedMatch = {
        accession: match.signature.accession,
        name: match.signature.name,
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
          name: match.signature.entry.name,
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
            <div className={f('medium-12', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType="protein" />
              <Accession accession={accession} title="Job ID" />
              <Length metadata={metadata} />
              {localID && <Actions localID={localID} withTitle />}
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

const jobMapSelector = state => state.jobs;
const accessionSelector = state =>
  state.customLocation.description.job.accession;

const jobSelector = createSelector(
  accessionSelector,
  jobMapSelector,
  (accession, jobMap) =>
    Object.values(jobMap).find(job => job.metadata.remoteID === accession),
);

const mapStateToProps = createSelector(
  accessionSelector,
  jobSelector,
  (accession, job) => ({
    accession,
    localID: (job || { metadata: {} }).metadata.localID,
  }),
);

export default connect(mapStateToProps)(SummaryIPScanJob);
