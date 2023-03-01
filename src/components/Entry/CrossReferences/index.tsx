import React, { PureComponent } from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro, fonts, ebiStyles, local);

type ReferenceData = {
  url: string;
  accession: string;
};
const ReferenceItem = ({ url, accession }: ReferenceData) => (
  <li>
    <Link href={url} className={f('ext')}>
      {accession}
    </Link>
  </li>
);

type SectionProps = {
  accessions: Array<ReferenceData>;
  name: string;
  description: string;
};
const ReferenceSection = ({ accessions, name, description }: SectionProps) =>
  name !== 'pdb' && (
    <li className={f('xref-section', 'small')}>
      <h5 className={f('text-up')}>
        {name}{' '}
        <Tooltip title={description}>
          <span
            className={f('small', 'icon', 'icon-common')}
            data-icon="&#xf129;"
          />
        </Tooltip>
      </h5>

      <ul>
        {accessions.map(({ accession, url }) => (
          <ReferenceItem key={accession} accession={accession} url={url} />
        ))}
      </ul>
    </li>
  );

type Props = {
  xRefs: Record<string, CrossReference>;
};
export default class CrossReferences extends PureComponent<Props> {
  render() {
    const databases = Object.entries(this.props.xRefs).sort(
      ([_, a], [__, b]) => a.rank - b.rank
    );
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <AnimatedEntry
            className={f('list', 'margin-left-none')}
            itemDelay={100}
            duration={500}
          >
            {databases.map(
              ([database, { displayName, description, accessions }]) => (
                <ReferenceSection
                  key={database}
                  name={displayName}
                  description={description}
                  accessions={accessions}
                />
              )
            )}
          </AnimatedEntry>
        </div>
      </div>
    );
  }
}
