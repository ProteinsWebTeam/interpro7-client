import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { flattenDeep } from 'lodash-es';

import Redirect from 'components/generic/Redirect';
import Loading from 'components/SimpleCommonComponents/Loading';

import GoTerms from 'components/GoTerms';
import Length from 'components/Protein/Length';
import Accession from 'components/Accession';
import Title from 'components/Title';
import { DomainOnProteinWithoutMergedData } from 'components/Related/DomainsOnProtein';
import Actions from 'components/IPScan/Actions';

import { Exporter } from 'components/Table';
import { NOT_MEMBER_DBS } from 'menuConfig';

import f from 'styles/foundation';
import Link from 'components/generic/Link';

/*:: type Props = {
  accession: string,
  localID: string,
  remoteID?: string,
  status: string,
  data: {
    payload: {
      results: Array<Object>,
    },
  },
  localPayload: ?Object,
}; */

// TODO: have consistent data to eventually remove this
const LUT = new Map([
  ['TIGRFAM', 'tigrfams'],
  ['PROSITE_PROFILES', 'profile'],
  ['PROSITE_PATTERNS', 'patterns'],
  ['SUPERFAMILY', 'ssf'],
  ['GENE3D', 'cathgene3d'],
]);

class SummaryIPScanJob extends PureComponent /*:: <Props, State> */ {
  static propTypes = {
    accession: T.string.isRequired,
    localID: T.string.isRequired,
    remoteID: T.string,
    status: T.string.isRequired,
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        results: T.array,
      }),
    }),
    localPayload: T.object,
  };

  render() {
    const {
      accession,
      localID,
      remoteID,
      status,
      data,
      localPayload,
    } = this.props;
    if (remoteID && remoteID !== accession) {
      return (
        <Redirect
          to={customLocation => ({
            ...customLocation,
            description: {
              ...customLocation.description,
              job: { ...customLocation.description.job, accession: remoteID },
            },
          })}
        />
      );
    }
    const payload = data.payload ? data.payload.results[0] : localPayload;

    if (!payload) return <Loading />;

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

    const mergedData = { unintegrated: [], predictions: [] };
    let integrated = new Map();
    for (const match of payload.matches) {
      const { library } = match.signature.signatureLibraryRelease;
      const processedMatch = {
        accession: match.signature.accession,
        name: match.signature.name,
        source_database: LUT.get(library) || library,
        protein_length: payload.sequenceLength,
        locations: match.locations.map(loc => ({
          ...loc,
          fragments:
            loc['location-fragments'] && loc['location-fragments'].length
              ? loc['location-fragments']
              : [{ start: loc.start, end: loc.end }],
        })),
        score: match.score,
      };
      if (NOT_MEMBER_DBS.has(library)) {
        processedMatch.accession += ` (${mergedData.predictions.length + 1})`;
        mergedData.predictions.push(processedMatch);
      } else if (match.signature.entry) {
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
            <div className={f('medium-9', 'columns', 'margin-bottom-large')}>
              <Title metadata={metadata} mainType="protein" />
              <Accession accession={accession} title="Job ID" />
              <Length metadata={metadata} />
              {localID && <Actions localID={localID} withTitle />}
              <span>Status: {status}</span>
            </div>
            <div className={f('medium-3', 'columns', 'margin-bottom-large')}>
              {status === 'finished' && (
                <Exporter includeSettings={false} left={false}>
                  <ul>
                    {['tsv', 'json', 'xml', 'gff', 'svg', 'sequence'].map(
                      type => (
                        <li key={type}>
                          <Link
                            target="_blank"
                            href={data.url.replace('json', type)}
                            download={`InterProScan.${type}`}
                          >
                            {type.toUpperCase()}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </Exporter>
              )}
            </div>
          </div>
        </section>
        {status === 'finished' && (
          <>
            <DomainOnProteinWithoutMergedData
              mainData={{ metadata }}
              dataMerged={mergedData}
            />
            <GoTerms terms={Array.from(goTerms.values())} type="protein" />
          </>
        )}
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
  (accession, jobMap) => {
    return Object.values(jobMap || {}).find(
      job =>
        job.metadata.remoteID === accession ||
        job.metadata.localID === accession,
    );
  },
);

const mapStateToProps = createSelector(
  accessionSelector,
  jobSelector,
  (accession, { metadata: { localID, remoteID, status } }) => ({
    accession,
    localID,
    remoteID,
    status,
  }),
);

export default connect(mapStateToProps)(SummaryIPScanJob);
