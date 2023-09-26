import React from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import EdgeCase from 'components/EdgeCase';
import SummaryEntry from 'components/Entry/Summary';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

const RemovedEntrySummary = ({
  accession,
  source_database,
  type,
  name,
  short_name,
  date,
  history,
  dbInfo,
}) => {
  const allNames = (history?.names || []).concat(history?.short_names || []);
  const formerNames = allNames.filter((n) => n !== name && n !== short_name);
  const listWrap = (n) => `<li>${n}</li>`;
  const metadata = {
    accession: accession.toUpperCase(),
    name: {
      name: name,
      short: short_name,
    },
    source_database: source_database,
    type: type,
    member_databases: history?.signatures,
    description:
      formerNames.length !== 0
        ? ['Former names:', `<ul>${formerNames.map(listWrap).join('')}</ul>`]
        : [],
  };
  const message = `${metadata.accession} has been retired in ${date}.`;
  return (
    <div className={f('row')}>
      <div className={f('medium-12', 'large-12', 'columns')}>
        <EdgeCase text={message} status={410} shouldRedirect={false} />
        <Title metadata={metadata} mainType="entry" />
        <SummaryEntry
          data={{ metadata: metadata }}
          loading={false}
          dbInfo={dbInfo}
        />
      </div>
    </div>
  );
};

RemovedEntrySummary.propTypes = {
  accession: T.string,
  source_database: T.string,
  type: T.string,
  name: T.string,
  short_name: T.string,
  date: T.string,
  history: T.shape({
    names: T.arrayOf(T.string),
    short_names: T.arrayOf(T.string),
    signatures: T.object,
  }),
  dbInfo: T.object,
};

export default RemovedEntrySummary;
