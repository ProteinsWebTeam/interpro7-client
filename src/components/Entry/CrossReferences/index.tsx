import React, { PureComponent } from 'react';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

import cssBinder from 'styles/cssBinder';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const css = cssBinder(fonts, local);

type ReferenceData = {
  url: string;
  accession: string;
};
const ReferenceItem = ({ url, accession }: ReferenceData) => (
  <li>
    <Link href={url} className={css('ext')}>
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
  name !== 'pdb' ? (
    <li className={css('xref-section', 'small')}>
      <h5 className={css('text-up')}>
        {name}{' '}
        <Tooltip title={description}>
          <span
            className={css('font-s', 'icon', 'icon-common')}
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
  ) : null;

type Props = {
  xRefs: Record<string, CrossReference>;
};
export default class CrossReferences extends PureComponent<Props> {
  render() {
    const databases = Object.entries(this.props.xRefs).sort(
      ([_, a], [__, b]) => a.rank - b.rank
    );
    return (
      <div className={css('vf-grid')}>
        <AnimatedEntry
          className={css('list', 'margin-left-none')}
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
    );
  }
}
