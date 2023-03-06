import React from 'react';
import DOMPurify from 'dompurify';

import { ENTRY_DBS } from 'utils/url-patterns';

import Link from 'components/generic/Link';

import Citations, { CITATION_REGEX } from '../Citations';

import cssBinder from 'styles/cssBinder';

import styles from '../style.css';

const css = cssBinder(styles);

const TAG_REGEX = /(\[\w+:[\w.-]+\])/;
const TAG_REGEX_KV = /\[(\w+):([\w.-]+)]/;
const CITATIONS_REGEX = `(\\[(${CITATION_REGEX})+\\])`;
const REMOVE_TRAILING_COMMA_REGEX = /,\s*(?=\])/;

const xReferenceURL = {
  cazy: 'http://www.cazy.org/fam/{}.html',
  cog: 'https://ftp.ncbi.nih.gov/pub/COG/COG2014/static/byCOG/{}.html',
  intenz: 'http://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec={}',
  genprop: 'https://www.ebi.ac.uk/interpro/genomeproperties/#{}',
  superfamily: 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid={}',
};

type Props = {
  p: string;
  literature?: Array<[string, Reference]>;
  accession?: string;
  withoutIDs?: boolean;
};
export const Paragraph = ({
  p,
  literature = [],
  accession,
  withoutIDs,
}: Props) => {
  let text = p;
  let match = null;
  const parts = [];
  while ((match = text.match(CITATIONS_REGEX))) {
    parts.push(...text.slice(0, match.index).split(TAG_REGEX));
    parts.push(match[0]);
    text = text.slice(match.index + match[0].length);
  }
  parts.push(...text.split(TAG_REGEX));
  return (
    <div>
      {parts.map((part, i) => {
        if (part.match(CITATIONS_REGEX)) {
          const text = part.replace(REMOVE_TRAILING_COMMA_REGEX, '');
          return (
            <Citations
              text={text}
              key={i}
              literature={literature}
              accession={accession}
              withoutIDs={withoutIDs}
            />
          );
        }
        const tagMatch = part.match(TAG_REGEX_KV);
        if (tagMatch) {
          const [_, tagType, tagValue] = tagMatch;
          const type = tagType.toLowerCase();
          let value = tagValue;
          if (type === 'cathgene3d') value = `G3DSA:${tagValue}`;
          if (ENTRY_DBS.indexOf(type) >= 0) {
            return (
              <Link
                key={i}
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: type, accession: value },
                  },
                }}
              >
                {value}
              </Link>
            );
          }
          if (type === 'swissprot') {
            return (
              <Link
                key={i}
                to={{
                  description: {
                    main: { key: 'protein' },
                    protein: { db: 'uniprot', accession: value },
                  },
                }}
              >
                {value}
              </Link>
            );
          }
          if (type === 'pdbe') {
            return (
              <Link
                key={i}
                to={{
                  description: {
                    main: { key: 'structure' },
                    structure: { db: 'pdb', accession: value },
                  },
                }}
              >
                {value}
              </Link>
            );
          }
          if (type in xReferenceURL) {
            return (
              <Link
                href={xReferenceURL[type].replace('{}', tagValue)}
                target="_blank"
                className={css('ext')}
                key={i}
              >
                {tagValue}
              </Link>
            );
          }
        }
        // TODO: change the way descriptions work from the backend side.
        return (
          <div
            className={css('inline')}
            key={i}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                part
                  .replace(/\[$/, ' ')
                  .replace(/^]/, ' ')
                  .replace(/<li>/g, '&nbsp;* ')
                  .replace(/<\/li>/g, '<br>')
                  .replace(/<ul>/g, '<br>')
                  .replace(/<\/ul>/g, '<br>')
                  .replace(/<\/li>/g, '')
              ),
            }}
          />
        );
      })}
    </div>
  );
};

export default Paragraph;
