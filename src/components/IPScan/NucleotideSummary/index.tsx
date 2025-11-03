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
        <section className={f('summary-row')}>
          <header>DNA Sequence ID</header>
          <section>{nPayload.crossReferences[0].id}</section>
        </section>
        <section className={f('summary-row')}>
          <header>Open Reading Frame</header>
          <section>
            <select onChange={handleORFChange} value={orf}>
              {nPayload.openReadingFrames.map((frame, i) => (
                <option key={i} value={i}>
                  {frame.strand}: {frame.start} - {frame.end}
                </option>
              ))}
            </select>
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
