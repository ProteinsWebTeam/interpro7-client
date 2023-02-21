// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { partition } from 'lodash-es';

import GoTerms from 'components/GoTerms';
import Description from 'components/Description';
import Literature, {
  getLiteratureIdsFromDescription,
} from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import InterProHierarchy from 'components/Entry/InterProHierarchy';
import Loading from 'components/SimpleCommonComponents/Loading';

import MemberDBSubtitle from './MemberDBSubtitle';
import SidePanel from './SidePanel';
import OverlappingEntries from './OverlappingEntries/index.tsx';
import Wikipedia from './Wikipedia';

import { foundationPartial } from 'styles/foundation';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, local);

/*:: export type Metadata = {
        accession: string,
        name: {name: string, short: ?string},
        source_database: string,
        type: string,
        gene?: string,
        experiment_type?: string,
        source_organism?: Object,
        release_date?: string,
        chains?: Array<string>,
        integrated?: string,
        member_databases?: Object,
        go_terms: Object,
        description: Array<string>,
        literature: Object,
        hierarchy?: Object,
        overlaps_with: Object,
        cross_references: Object,
        wikipedia: Object,
        counters: Object,
        set_info?: {
          accession: string,
          name: string,
        }
      }
 */

const OtherSections = ({ metadata, citations: { included, extra } }) => (
  <>
    {!Object.keys(metadata.go_terms || []).length ||
    metadata.source_database.toLowerCase() !== 'interpro' ? null : (
      <GoTerms
        terms={metadata.go_terms || []}
        type="entry"
        db={metadata.source_database}
      />
    )}
    {Object.keys(metadata.literature || []).length ? (
      <section id="references" data-testid="entry-references">
        <div className={f('row')}>
          <div className={f('large-12', 'columns')}>
            <h4>References</h4>
          </div>
        </div>
        <Literature included={included} extra={extra} />
      </section>
    ) : null}

    {Object.keys(metadata.cross_references || {}).length ? (
      <section id="cross_references" data-testid="entry-crossreferences">
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

const Hierarchy = ({ hierarchy, type, accession }) =>
  hierarchy &&
  Object.keys(hierarchy).length &&
  hierarchy.children &&
  hierarchy.children.length ? (
    <div className={f('margin-bottom-large')}>
      <h4 className={f('first-letter-cap')}>
        {type.replace('_', ' ').toLowerCase()} relationships
      </h4>
      <InterProHierarchy accession={accession} hierarchy={hierarchy} />
    </div>
  ) : null;
Hierarchy.propTypes = {
  hierarchy: T.object,
  type: T.string,
  accession: T.string,
};

/*:: type Props = {
    data: {
      metadata: Metadata,
    },
    loading: boolean,
    dbInfo: Object,
  };
*/

class SummaryEntry extends PureComponent /*:: <Props> */ {
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    dbInfo: T.object.isRequired,
    loading: T.bool.isRequired,
  };

  render() {
    const {
      data: { metadata },
      dbInfo,
    } = this.props;

    if (this.props.loading || !metadata) return <Loading />;
    const citations = getLiteratureIdsFromDescription(metadata.description);
    const [included, extra] = partition(
      Object.entries(metadata.literature || {}),
      ([id]) => citations.includes(id),
    );
    const desc = (metadata.description || []).reduce((e, acc) => e + acc, '');
    included.sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));
    return (
      <div className={f('sections')}>
        <section>
          <div className={f('row')}>
            <div className={f('medium-8', 'large-8', 'columns')}>
              <MemberDBSubtitle metadata={metadata} dbInfo={dbInfo} />
              {metadata?.source_database?.toLowerCase() === 'interpro' &&
                metadata?.accession !== metadata?.name?.short && (
                  <p data-testid="entry-shortname">
                    Short name:&nbsp;
                    <i className={f('shortname')}>{metadata.name.short}</i>
                  </p>
                )}
              <OverlappingEntries metadata={metadata} />
              <Hierarchy
                hierarchy={metadata.hierarchy}
                accession={metadata.accession}
                type={metadata.type}
              />

              {
                // doesn't work for some HAMAP as they have enpty <P> tag
                (metadata.description || []).length ? (
                  <>
                    <h4>Description</h4>
                    <Description
                      textBlocks={metadata.description}
                      literature={included}
                      accession={metadata.accession}
                    />
                  </>
                ) : null
              }
            </div>
            <div className={f('medium-4', 'large-4', 'columns')}>
              <SidePanel metadata={metadata} dbInfo={dbInfo} />
            </div>
          </div>
        </section>
        <OtherSections metadata={metadata} citations={{ included, extra }} />
        <section>
          {metadata.source_database === 'pfam' && metadata.wikipedia ? (
            <Wikipedia
              title={metadata.wikipedia.title}
              extract={metadata.wikipedia.extract}
              thumbnail={metadata.wikipedia.thumbnail}
            />
          ) : null}
        </section>
      </div>
    );
  }
}

export default SummaryEntry;
