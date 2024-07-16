import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import Link from 'components/generic/Link';

import Loading from 'components/SimpleCommonComponents/Loading';
import Callout from 'components/SimpleCommonComponents/Callout';

import cssBinder from 'styles/cssBinder';
import fonts from 'EBI-Icon-fonts/fonts.css';
import summary from 'styles/summary.css';
const f = cssBinder(summary, fonts);

type Props = {
  payload?: LocalPayload;
  orf?: number;
  goToCustomLocation?: typeof goToCustomLocation;
  customLocation?: InterProLocation;
};

const NucleotideSummary = ({
  payload,
  orf,
  customLocation,
  goToCustomLocation,
}: Props) => {
  if (!payload || !customLocation) return <Loading inline={true} />;
  const nPayload = payload as Iprscan5NucleotideResult;
  if (nPayload.openReadingFrames && typeof orf === 'number') {
    const currentORF = nPayload.openReadingFrames[orf];

    const handleORFChange = (event: React.FormEvent) => {
      const value = (event.target as HTMLSelectElement).value;
      goToCustomLocation?.({
        ...customLocation,
        search: {
          ...customLocation.search,
          orf: value,
        },
      });
    };
    return (
      <>
        <Callout type="info" showIcon icon="icon-dna">
          <b>Nucleotide Sequence</b>
          <p>
            This analysis was the result of an InterProScan execution over a
            nucleotide sequence. The data below correspond to a single ORF from
            such sequence.
          </p>
        </Callout>
        <section className={f('summary-row')}>
          <header>DNA Sequence ID</header>
          <section>{nPayload.crossReferences[0].name}</section>
        </section>
        <section className={f('summary-row')}>
          <header>Current ORF</header>
          <section>
            <select onChange={handleORFChange} value={orf}>
              {nPayload.openReadingFrames.map((frame, i) => (
                <option key={i} value={i}>
                  {i}: {frame.start}-{frame.end} ({frame.strand})
                </option>
              ))}
            </select>
          </section>
        </section>
        <section className={f('summary-row')}>
          <header>Open Reading Frame</header>

          <section>
            <section className={f('summary-row')}>
              <header>Location</header>
              <section>
                <Link
                  to={({ description }) => ({
                    description: {
                      ...description,
                      [description.main.key]: {
                        ...description[description.main.key],
                        detail: 'sequence',
                      },
                    },
                    search: { orf },
                    hash: 'nucleotides',
                  })}
                >
                  {currentORF.start}-{currentORF.end}
                </Link>
              </section>
            </section>
            <section className={f('summary-row')}>
              <header>Strand</header>
              <section>{currentORF.strand}</section>
            </section>
          </section>
        </section>
      </>
    );
  }
  return null;
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation,
  (customLocation) => ({ customLocation }),
);

export default connect(mapStateToProps, { goToCustomLocation })(
  NucleotideSummary,
);
