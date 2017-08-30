import React, { PureComponent } from 'react';
import T from 'prop-types';

import AnimatedEntry from 'components/AnimatedEntry';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import local from './styles.css';

const f = foundationPartial(local);

const ReferenceItem = ({ url, accession }) => (
  <li>
    <Link href={url}>{accession}</Link>
  </li>
);
ReferenceItem.propTypes = {
  url: T.string.isRequired,
  accession: T.string.isRequired,
};

const ReferenceSection = ({ accessions, name, description }) => (
  <li className={f('xref-section')}>
    <h5>{name}</h5>
    <div>{description}</div>
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

export default class CrossReferences extends PureComponent {
  static propTypes = {
    xRefs: T.object.isRequired,
  };

  render() {
    const databases = Object.entries(this.props.xRefs).sort(
      ([a], [b]) => a.rank - b.rank
    );
    return (
      <div className={f('row')}>
        <div className={f('large-12', 'columns')}>
          <AnimatedEntry className={f('list')} itemDelay={100} duration={500}>
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
