// @flow
import React from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

import Loading from 'components/SimpleCommonComponents/Loading';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import summary from 'styles/summary.css';
const f = foundationPartial(summary, ebiGlobalStyles, fonts);

/*::
  type Props = {
    payload?: {
      group?: string,
      orf?: {
        dnaSequence: string,
        strand: string,
        start: number,
        end: number,
      },
    },
  }
*/
const hasNucleotideData = (payload) =>
  !!(payload?.group && payload?.orf?.dnaSequence);

const NucleotideSummary = ({ payload } /*: Props */) => {
  if (!payload) return <Loading inline={true} />;
  if (hasNucleotideData(payload)) {
    return (
      <>
        <div className={f('callout', 'secondary', 'withicon')}>
          <b>Nucleotide Sequence</b>
          <p>
            This analysis was the result of an InterProScan execution over a
            nucleotide sequence <code>ID: {payload.group}</code>. The data in
            this page correspond to a single ORF from such sequence.
          </p>
        </div>
        <section className={f('summary-row')}>
          <header>DNA Sequence ID</header>
          <section>{payload.group}</section>
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
                    hash: 'nucleotides',
                  })}
                >
                  {payload.orf?.start}-{payload.orf?.end}
                </Link>
              </section>
            </section>
            <section className={f('summary-row')}>
              <header>Strand</header>
              <section>{payload.orf?.strand}</section>
            </section>
          </section>
        </section>
      </>
    );
  }
  return null;
};
NucleotideSummary.propTypes = {
  payload: T.shape({
    group: T.string,
    orf: T.object,
  }),
};
export default NucleotideSummary;
