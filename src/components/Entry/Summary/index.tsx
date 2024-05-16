import React, { useState, useEffect } from 'react';

import GoTerms from 'components/GoTerms';
import Description, {
  hasLLMParagraphs,
  getDescriptionText,
} from 'components/Description';
import DescriptionFromIntegrated from 'components/Description/DescriptionFromIntegrated';
import LLMCallout from 'components/Entry/LLMCallout';
import Literature, {
  getLiteratureIdsFromDescription,
  splitCitations,
} from 'components/Entry/Literature';
import CrossReferences from 'components/Entry/CrossReferences';
import Loading from 'components/SimpleCommonComponents/Loading';

import MemberDBSubtitle from './MemberDBSubtitle';
import SidePanel from './SidePanel';
import Wikipedia from './Wikipedia';

import cssBinder from 'styles/cssBinder';

import ipro from 'styles/interpro-vf.css';
import summary from 'styles/summary.css';
import local from './style.css';
import InterProSubtitle from './InterProSubtitle';

const css = cssBinder(local, ipro, summary);

type OtherSectionsProps = {
  metadata: EntryMetadata;
  citations: {
    included: [string, Reference][];
    extra: [string, Reference][];
  };
  hasIntegratedCitations: boolean;
};

const OtherSections = ({
  metadata,
  citations: { included, extra },
  hasIntegratedCitations,
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
      <section id="references">
        <div className={css('vf-grid')}>
          <h4>
            {hasIntegratedCitations ? 'Supplementary References' : 'References'}
          </h4>
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

type SummaryEntryProps = {
  data: {
    metadata: EntryMetadata;
  };
  headerText?: string;
  loading: boolean;
  dbInfo: DBInfo;
};

const SummaryEntry = ({
  data: { metadata },
  headerText,
  dbInfo,
  loading,
}: SummaryEntryProps) => {
  const [integratedCitations, setIntegratedCitations] = useState<string[]>([]);
  const [hasIntegratedLLM, setHasIntegratedLLM] = useState(false);
  useEffect(() => {
    setIntegratedCitations([]);
  }, [metadata]);

  if (loading || !metadata) return <Loading />;
  const citations = getLiteratureIdsFromDescription(metadata.description);
  const filterIntegratedCites = Object.fromEntries(
    Object.keys(metadata.literature || {})
      .filter((cite) => !integratedCitations.includes(cite))
      .map((cite) => [cite, metadata.literature[cite]]),
  );
  const [included, extra] = splitCitations(filterIntegratedCites, citations);

  const desc = (metadata.description || []).reduce(
    (e, acc) => getDescriptionText(e) + acc,
    '',
  ) as string;
  (included as Array<[string, Reference]>).sort(
    (a, b) => desc.indexOf(a[0]) - desc.indexOf(b[0]),
  );

  const selectDescriptionComponent = (hasLLM: boolean) => {
    if ((metadata.description || []).length) {
      return (
        <>
          <h4>{headerText || 'Description'}</h4>
          <Description
            textBlocks={metadata.description}
            literature={included as Array<[string, Reference]>}
            showBadges={hasLLM}
          />
        </>
      );
    } else if (metadata.integrated) {
      return (
        <DescriptionFromIntegrated
          integrated={metadata.integrated}
          setIntegratedCitations={setIntegratedCitations}
          headerText={headerText || 'Description'}
          handleLLMParagraphs={setHasIntegratedLLM}
        />
      );
    }
    return null;
  };
  const hasLLM = hasLLMParagraphs(metadata.description || []);
  return (
    <div className={css('vf-stack', 'vf-stack--400')}>
      <section className={css('vf-grid', 'summary-grid')}>
        <div className={css('vf-stack')}>
          {hasLLM || hasIntegratedLLM || metadata?.is_llm ? (
            <LLMCallout accession={metadata.accession} />
          ) : null}
          {metadata?.source_database?.toLowerCase() === 'interpro' ? (
            <InterProSubtitle metadata={metadata} hasLLM={metadata?.is_llm} />
          ) : (
            <MemberDBSubtitle
              metadata={metadata}
              dbInfo={dbInfo}
              hasLLM={metadata?.is_llm}
            />
          )}

          <section className={css('vf-stack')}>
            {selectDescriptionComponent(hasLLM)}
          </section>
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
        hasIntegratedCitations={integratedCitations?.length > 0}
      />
      <section>
        {metadata.source_database === 'pfam' &&
          (metadata.wikipedia || []).map((wiki) => (
            <Wikipedia
              title={wiki.title}
              extract={wiki.extract}
              thumbnail={wiki.thumbnail}
            />
          ))}
      </section>
    </div>
  );
};

export default SummaryEntry;
