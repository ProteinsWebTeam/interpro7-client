import React, { PureComponent } from 'react';
import T from 'prop-types';
import { partition } from 'lodash-es';

import Link from 'components/generic/Link';
import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import Integration from 'components/Entry/Integration';
import ContributingSignatures from 'components/Entry/ContributingSignatures';
import InterProHierarchy from 'components/Entry/InterProHierarchy';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import Loading from 'components/SimpleCommonComponents/Loading';

import getUrlFor from 'utils/url-patterns';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, local);

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
              className={f('small', 'icon', 'icon-common')}
              data-icon="&#xf129;"
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
    {metadata.source_database.toLowerCase() !== 'interpro' && (
      <section>
        <h5>External Links</h5>
        <ul className={f('no-bullet')}>
          <li>
            <Link
              className={f('ext')}
              target="_blank"
              href={getUrlFor(metadata.source_database)(
                metadata.accession.toUpperCase(),
              )}
            >
              View {metadata.accession.toUpperCase()} in{' '}
              {metadata.source_database}
            </Link>
          </li>
          {false &&
            metadata.wikipedia && (
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
  <>
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
  </>
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
      metadata: T.object,
    }).isRequired,
    loading: T.bool.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = { showAllOverlappingEntries: false };
  }
  render() {
    const {
      data: { metadata },
    } = this.props;
    if (this.props.loading || !metadata) return <Loading />;
    const MAX_NUMBER_OF_OVERLAPPING_ENTRIES = 5;
    const citations = description2IDs(metadata.description);
    const desc = metadata.description.reduce((e, acc) => e + acc, '');
    const [included, extra] = partition(
      Object.entries(metadata.literature),
      ([id]) => citations.includes(id),
    );
    included.sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));
    let overlaps = metadata.overlaps_with;
    if (metadata.overlaps_with) {
      metadata.overlaps_with.sort((a, b) => {
        if (a.type > b.type) return 1;
        if (a.type < b.type) return -1;
        return a.accession > b.accession ? 1 : -1;
      });
      if (!this.state.showAllOverlappingEntries)
        overlaps = metadata.overlaps_with.slice(
          0,
          MAX_NUMBER_OF_OVERLAPPING_ENTRIES,
        );
    }
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
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
              {overlaps && Object.keys(overlaps).length ? (
                <div>
                  <h4 className={f('first-letter-capital')}>
                    {metadata.type === 'homologous_superfamily'
                      ? 'Overlapping entries'
                      : 'Overlapping homologous superfamilies'}
                  </h4>
                  {overlaps.map(ov => (
                    <div key={ov.accession} style={{ paddingLeft: '1.5em' }}>
                      <interpro-type
                        type={ov.type.replace('_', ' ')}
                        dimension="1.2em"
                      />
                      <Link
                        to={{
                          description: {
                            main: { key: 'entry' },
                            entry: {
                              db: 'InterPro',
                              accession: ov.accession,
                            },
                          },
                        }}
                      >
                        {ov.name}
                      </Link>{' '}
                      ({ov.accession.toUpperCase()})
                    </div>
                  ))}
                  {Object.keys(metadata.overlaps_with).length >
                    MAX_NUMBER_OF_OVERLAPPING_ENTRIES && (
                    <button
                      className={f('button')}
                      style={{ marginLeft: '1.5em' }}
                      onClick={() =>
                        this.setState({
                          showAllOverlappingEntries: !this.state
                            .showAllOverlappingEntries,
                        })
                      }
                    >
                      Show{' '}
                      {this.state.showAllOverlappingEntries ? 'Less' : 'More'}
                    </button>
                  )}
                  <br />
                </div>
              ) : null}
              {metadata.hierarchy &&
              Object.keys(metadata.hierarchy).length &&
              metadata.hierarchy.children &&
              metadata.hierarchy.children.length ? (
                <div>
                  <h4 className={f('first-letter-capital')}>
                    {metadata.type.replace('_', ' ').toLowerCase()}{' '}
                    relationships
                  </h4>
                  <InterProHierarchy
                    accession={metadata.accession}
                    hierarchy={metadata.hierarchy}
                  />
                </div>
              ) : null}

              {// doesn't work for some HAMAP as they have enpty <P> tag
              Object.keys(metadata.description).length ? (
                <>
                  <h4>Description</h4>
                  <Description
                    textBlocks={metadata.description}
                    literature={included}
                    accession={metadata.accession}
                  />
                </>
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
