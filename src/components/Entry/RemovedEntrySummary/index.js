import React from 'react';
import T from 'prop-types';

import Title from 'components/Title';
import EdgeCase from 'components/EdgeCase';
import SummaryEntry from 'components/Entry/Summary';
import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';

const f = foundationPartial(ebiGlobalStyles, fonts);

const RemovedEntrySummary = ({ detail, accession, date, history, dbInfo }) => {
  const metadata = {
    accession: accession.toUpperCase(),
    name: { name: history.names?.[0] || '???' },
    source_database: 'Removed',
    type: 'unknown',
    member_databases: history.signatures,
    description: [
      `<b>Removed</b>: ${date}`,
      '<b>Used names</b>:',
      ...(history.names || []).map(n => ` * ${n}`),
    ],
  };
  const regex = /ipr[0-9]{6}/gi;
  const detailF = (detail || '').replace(regex, accession.toUpperCase());
  return (
    <div className={f('row')}>
      <div className={f('medium-12', 'large-12', 'columns')}>
        <EdgeCase text={detailF} status={410} shouldRedirect={false} />
        <Title metadata={metadata} mainType="entry" />
        <SummaryEntry
          data={{ metadata: { ...metadata, source_database: 'interpro' } }}
          loading={false}
          dbInfo={dbInfo}
        />
      </div>
    </div>
  );
};

RemovedEntrySummary.propTypes = {
  detail: T.string,
  accession: T.string,
  date: T.string,
  history: T.shape({
    signatures: T.arrayOf(T.object),
    names: T.arrayOf(T.string),
  }),
  dbInfo: T.object,
};

export default RemovedEntrySummary;
