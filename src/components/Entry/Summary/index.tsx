import React, { PureComponent } from 'react';
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
import OverlappingEntries from './OverlappingEntries';
import Wikipedia from './Wikipedia';

import cssBinder from 'styles/cssBinder';

import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import local from './style.css';

const css = cssBinder(ebiGlobalStyles, local);

type OtherSectionsProps = {
  metadata: EntryMetadata;
  citations: {
    included: [string, Reference][];
    extra: [string, Reference][];
  };
};

const OtherSections = ({
  metadata,
  citations: { included, extra },
}: OtherSectionsProps) => (
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
        <div className={css('vf-grid')}>
          <h4>References</h4>
        </div>
        <Literature included={included} extra={extra} />
      </section>
    ) : null}

    {Object.keys(metadata.cross_references || {}).length ? (
      <section id="cross_references" data-testid="entry-crossreferences">
        <div className={css('vf-grid')}>
          <h4>Cross References</h4>
        </div>
        <CrossReferences xRefs={metadata.cross_references} />
      </section>
    ) : null}
  </>
);

type HierarchyProps = {
  hierarchy: InterProHierarchyType;
  type: string;
  accession: string;
};

const Hierarchy = ({ hierarchy, type, accession }: HierarchyProps) =>
  hierarchy?.children?.length ? (
    <div className={css('margin-bottom-large')}>
      <h4 className={css('first-letter-cap')}>
        {type.replace('_', ' ').toLowerCase()} relationships
      </h4>
      <InterProHierarchy accession={accession} hierarchy={hierarchy} />
    </div>
  ) : null;

type SummaryEntryProps = {
  data: {
    metadata: EntryMetadata;
  };
  loading: boolean;
  dbInfo: DBInfo;
};

class SummaryEntry extends PureComponent<SummaryEntryProps> {
  render() {
    const {
      data: { metadata },
      dbInfo,
    } = this.props;

    if (this.props.loading || !metadata) return <Loading />;
    const citations = getLiteratureIdsFromDescription(metadata.description);
    const [included, extra] = partition(
      Object.entries(metadata.literature || {}),
      ([id]: [string]) => citations.includes(id)
    );
    const desc = (metadata.description || []).reduce((e, acc) => e + acc, '');
    included.sort((a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]));
    return (
      <div className={css('sections')}>
        <section className={css('vf-grid')}>
          <div className={css('vf-stack', 'vf-grid__col--span-3')}>
            <MemberDBSubtitle metadata={metadata} dbInfo={dbInfo} />
            {metadata?.source_database?.toLowerCase() === 'interpro' &&
              metadata?.accession !== metadata?.name?.short && (
                <p data-testid="entry-shortname">
                  Short name:&nbsp;
                  <i className={css('shortname')}>{metadata.name.short}</i>
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
                    literature={included as Array<[string, Reference]>}
                    accession={metadata.accession}
                  />
                </>
              ) : null
            }
          </div>
          <div className={css('vf-stack')}>
            <SidePanel metadata={metadata} dbInfo={dbInfo} />
          </div>
        </section>
        <OtherSections
          metadata={metadata}
          citations={
            { included, extra } as {
              included: Array<[string, Reference]>;
              extra: Array<[string, Reference]>;
            }
          }
        />
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
