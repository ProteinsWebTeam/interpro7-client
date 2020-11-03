/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';

import DOMPurify from 'dompurify';

import { transformFormatted } from 'utils/text';
import { ENTRY_DBS } from 'utils/url-patterns';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import styles from './style.css';
import theme from 'styles/theme-interpro.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiStyles, styles, theme, fonts);

const TAG_REGEX = /(\[\w+:[\w\.]+])/;
const TAG_REGEX_KV = /\[(\w+):([\w\.]+)]/;
const CITATION_REGEX = '\\[cite:(PUB\\d+)\\](,\\s+)?';
const CITATIONS_REGEX = `(\\[(${CITATION_REGEX})+\\])`;
const REMOVE_TRAILING_COMMA_REGEX = /,\s*(?=\])/;

const Citations = (
  {
    text,
    literature = [],
    withoutIDs,
    accession,
  } /*: {text: string, literature?: Array<string>, accession: string, withoutIDs: boolean} */,
) => (
  <sup>
    [
    {text.split(',').map((cita, i) => {
      const citMatch = cita.match(CITATION_REGEX);
      if (!citMatch || citMatch.length < 2) {
        return null;
      }
      const pubId = citMatch[1];
      const refCounter = literature.map((d) => d[0]).indexOf(pubId) + 1;
      return (
        <Link
          key={cita}
          id={withoutIDs ? null : `description-${refCounter}`}
          className={f('text-high')}
          to={(customLocation) => {
            const key = customLocation.description.main.key;
            return {
              ...customLocation,
              description: {
                main: { key },
                [key]: {
                  db: customLocation.description[key].db,
                  accession,
                },
              },
              hash: pubId,
            };
          }}
        >
          {refCounter}
          {i + 1 < text.split(',').length && ', '}
        </Link>
      );
    })}
    ]
  </sup>
);
Citations.propTypes = {
  text: T.string.isRequired,
  literature: T.array,
  accession: T.string,
  withoutIDs: T.bool,
};

const xReferenceURL = {
  cazy: 'http://www.cazy.org/fam/{}.html',
  cog: 'https://ftp.ncbi.nih.gov/pub/COG/COG2014/static/byCOG/{}.html',
  intenz: 'http://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec={}',
  genprop: 'https://www.ebi.ac.uk/interpro/genomeproperties/#{}',
  superfamily: 'http://supfam.org/SUPERFAMILY/cgi-bin/scop.cgi?ipid={}',
};

export const Paragraph = (
  {
    p,
    literature = [],
    accession,
    withoutIDs,
  } /*: {p: string, literature?: Array<string>, accession?: string, withoutIDs?: boolean} */,
) => {
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
                    protein: { db: 'reviewed', accession: value },
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
                className={f('ext')}
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
            className={f('inline')}
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
                  .replace(/<\/li>/g, ''),
              ),
            }}
          />
        );
      })}
    </div>
  );
};
Paragraph.propTypes = {
  p: T.string.isRequired,
  literature: T.array,
  accession: T.string,
  withoutIDs: T.bool,
};

/* :: type Props = {
  textBlocks: Array<string> ,
  literature?: Array<string>,
  accession?: string,
  withoutIDs?: boolean
}; */
class Description extends PureComponent /*:: <Props> */ {
  static propTypes = {
    textBlocks: T.arrayOf(T.string).isRequired,
    literature: T.array,
    accession: T.string,
    withoutIDs: T.bool,
  };

  render() {
    const { textBlocks, literature, accession, withoutIDs } = this.props;
    const sections = textBlocks.map((e) => {
      return transformFormatted(e);
    });

    return (
      <div
        className={f('margin-bottom-large', 'description')}
        data-testid="description"
      >
        {sections
          .map((section, i) =>
            section
              .map((p, j) => (
                <Paragraph
                  key={`${i}.${j}`}
                  p={p}
                  literature={literature || []}
                  accession={accession}
                  withoutIDs={withoutIDs}
                />
              ))
              .reduce(
                (prev, curr, key) => [
                  ...prev,
                  prev.length ? <br key={key} /> : null,
                  curr,
                ],
                [],
              ),
          )
          .reduce(
            (prev, curr, key) => [
              ...prev,
              prev.length ? (
                <hr key={key} style={{ border: '1px solid transparent' }} />
              ) : null,
              curr,
            ],
            [],
          )}
      </div>
    );
  }
}

/* :: type DescriptionReadMoreProps = {|
  text: string,
  minNumberOfCharToShow: number,
  patternToRemove?: string
|}; */

/* :: type State = {| showMore: boolean |}; */
export class DescriptionReadMore extends PureComponent /*:: <DescriptionReadMoreProps, State> */ {
  static propTypes = {
    text: T.string,
    minNumberOfCharToShow: T.number,
    patternToRemove: T.string,
  };
  constructor(props /*: DescriptionReadMoreProps */) {
    super(props);
    this.state = { showMore: false };
  }
  render() {
    const {
      text = '',
      minNumberOfCharToShow = Infinity,
      patternToRemove,
    } = this.props;
    const { showMore } = this.state;
    let textToShow = text;
    if (patternToRemove) {
      textToShow = textToShow.replace(new RegExp(patternToRemove, 'g'), '');
    }
    textToShow =
      showMore || minNumberOfCharToShow > textToShow.length
        ? textToShow
        : `${textToShow.slice(0, minNumberOfCharToShow)}...`;
    return (
      <>
        <Description textBlocks={[textToShow]} {...this.props} />
        {minNumberOfCharToShow < text.length && (
          <button
            className={f('button', 'hollow', 'secondary', 'margin-bottom-none')}
            onClick={() => this.setState({ showMore: !showMore })}
          >
            Show{' '}
            {showMore ? (
              <span>
                Less{' '}
                <i
                  className={f('icon', 'icon-common', 'font-sm')}
                  data-icon="&#xf102;"
                />
              </span>
            ) : (
              <span>
                More{' '}
                <i
                  className={f('icon', 'icon-common', 'font-sm')}
                  data-icon="&#xf103;"
                />
              </span>
            )}
          </button>
        )}
      </>
    );
  }
}

export default Description;
