import React, { PureComponent } from 'react';
import T from 'prop-types';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';
import ebiStyles from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';

const f = foundationPartial(ipro, fonts, ebiStyles, local);

const ReferenceItem = (
  { url, accession } /*: {url: string, accession: string} */,
) => (
  <li>
    <Link href={url} className={f('ext')}>
      {accession}
    </Link>
  </li>
);
ReferenceItem.propTypes = {
  url: T.string.isRequired,
  accession: T.string.isRequired,
};

const ReferenceSection = (
  {
    accessions,
    name,
    description,
  } /*: {accessions: Array<Object>, name: string, description: string} */,
) =>
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
ReferenceSection.propTypes = {
  accessions: T.array.isRequired,
  name: T.string.isRequired,
  description: T.string.isRequired,
};

export default class CrossReferences extends PureComponent /*:: <{xRefs: Object}> */ {
  static propTypes = {
    xRefs: T.object.isRequired,
  };

  render() {
    const databases = Object.entries(this.props.xRefs).sort(
      ([a], [b]) => a.rank - b.rank,
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
              ),
            )}
          </AnimatedEntry>
        </div>
      </div>
    );
  }
}
