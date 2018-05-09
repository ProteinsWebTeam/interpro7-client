import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';
import Link from 'components/generic/Link';
import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import InterProHierarchy from 'components/Entry/InterProHierarchy';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import partition from 'lodash-es/partition';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(fonts, local);

const description2IDs = description =>
  description.reduce(
    (acc, part) => [
      ...acc,
      ...(part.match(/"(PUB\d+)"/gi) || []).map(t =>
        t.replace(/(^")|("$)/g, ''),
      ),
    ],
    [],
  );

const MemberDBSubtitle = ({ metadata }) => {
  if (
    !metadata.source_database ||
    metadata.source_database.toLowerCase() === 'interpro'
  ) {
    return null;
  }

  return (
    <div className={f('md-hlight')}>
      <h5>
        Member database:&nbsp;
        <Link
          to={{
            description: {
              mainType: 'entry',
              mainDB: metadata.source_database,
            },
          }}
        >
          {metadata.source_database}{' '}
          <Tooltip title={metadata.source_database}>
            <span
              className={f('small', 'icon', 'icon-generic')}
              data-icon="i"
            />
          </Tooltip>
        </Link>
      </h5>
      <p className={f('margin-bottom-medium')}>
        {metadata.source_database} type:{' '}
        {metadata.type.replace('_', ' ').toLowerCase()}
      </p>
      {metadata.name.short &&
        metadata.accession !== metadata.name.short && (
          <p>
            Short name:&nbsp;
            <i className={f('shortname')}>{metadata.name.short}</i>
          </p>
        )}
    </div>
  );
};
MemberDBSubtitle.propTypes = {
  metadata: T.object.isRequired,
};

const SidePanel = ({ metadata }) => (
  <div className={f('medium-4', 'large-4', 'columns')}>
    {metadata.integrated && <Integration intr={metadata.integrated} />}
    {metadata.integrated && (
      <section>
        <h5>External Links</h5>
        <ul className={f('no-bullet')}>
          <li>
            <Link className={f('ext')} to={{ description: {} }}>
              {metadata.source_database} website
            </Link>
          </li>
          {metadata.wikipedia && (
            <li>
              <Link
                className={f('ext')}
                target="_blank"
                href={`https://en.wikipedia.org/wiki/${metadata.wikipedia}`}
              >
                Wikipedia article
              </Link>
            </li>
          )}
        </ul>
      </section>
    )}
    {metadata.member_databases &&
    Object.keys(metadata.member_databases).length ? (
      <ContributingSignatures contr={metadata.member_databases} />
    ) : null}
  </div>
);
SidePanel.propTypes = {
  metadata: T.object.isRequired,
};

const OtherSections = ({ metadata, citations: { included, extra } }) => (
  <Fragment>
    {!Object.keys(metadata.go_terms).length ||
    metadata.source_database.toLowerCase() !== 'interpro' ? null : (
      <GoTerms
        terms={metadata.go_terms}
        type="entry"
        db={metadata.source_database}
      />
    )}
    {Object.keys(metadata.literature).length ? (
      <section id="references">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>References</h4>
          </div>
        </div>
        <Literature included={included} extra={extra} />
      </section>
    ) : null}

    {Object.keys(metadata.cross_references || {}).length ? (
      <section id="cross_references">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>Cross References</h4>
          </div>
        </div>
        <CrossReferences xRefs={metadata.cross_references} />
      </section>
    ) : null}
  </Fragment>
);
OtherSections.propTypes = {
  metadata: T.object.isRequired,
  citations: T.shape({
    included: T.array,
    extra: T.array,
  }),
};

/* :: type Props = {
    data: {
      metadata: {
        accession: string,
        name: {name: string, short: ?string},
        source_database: string,
        type: string,
        gene?: string,
        experiment_type?: string,
        source_organism?: Object,
        release_date?: string,
        chains?: Array<string>,
        integrated: string,
        member_databases?: Object,
        go_terms: Object,
        description: Array<string>,
        literature: Object,
      }
    },
    location: {description: {mainType: string}},
  };
*/

class SummaryEntry extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object.isRequired,
    }),
  };

  render() {
    const {
      data: { metadata },
    } = this.props;
    const citations = description2IDs(metadata.description);
    const desc = metadata.description.reduce((e, acc) => e + acc, '');
    const [included, extra] = partition(
      Object.entries(metadata.literature),
      ([id]) => citations.includes(id),
    );
    included.sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));

    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              {metadata.hierarchy && Object.keys(metadata.hierarchy).length ? (
                <div>
                  <h4>{metadata.type} Relationships</h4>
                  <InterProHierarchy
                    accession={metadata.accession}
                    hierarchy={metadata.hierarchy}
                  />
                </div>
              ) : null}

              <MemberDBSubtitle metadata={metadata} />
              {metadata.source_database &&
                metadata.source_database.toLowerCase() === 'interpro' &&
                metadata.name.short &&
                metadata.accession !== metadata.name.short && (
                  <p>
                    Short name:&nbsp;
                    <i className={f('shortname')}>{metadata.name.short}</i>
                  </p>
                )}
              {// doesn't work for some HAMAP as they have enpty <P> tag
              Object.keys(metadata.description).length ? (
                <Fragment>
                  <h4>Description</h4>
                  <Description
                    textBlocks={metadata.description}
                    literature={included}
                  />
                </Fragment>
              ) : null}
            </div>
            <SidePanel metadata={metadata} />
          </div>
        </section>
        <OtherSections metadata={metadata} citations={{ included, extra }} />
      </div>
    );
  }
}

export default SummaryEntry;
