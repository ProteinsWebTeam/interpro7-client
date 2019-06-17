/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';

import DOMPurify from 'dompurify';

import { transformFormatted } from 'utils/text';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';

import ebiStyles from 'ebi-framework/css/ebi-global.css';
import styles from './style.css';
import theme from 'styles/theme-interpro.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const f = foundationPartial(ebiStyles, styles, theme, fonts);

const TAG_REGEX = /(\[\w+:\w+])/;
const TAG_REGEX_KV = /\[(\w+):(\w+)]/;
const CITATION_REGEX = '\\[cite:(PUB\\d+)\\](, )?';
const CITATIONS_REGEX = `(\\[(${CITATION_REGEX})+\\])`;

const Citations = ({ text, literature = [], withoutIDs, accession }) => (
  <sup>
    [
    {text.split(',').map((cita, i) => {
      const pubId = cita.match(CITATION_REGEX)[1];
      const refCounter = literature.map(d => d[0]).indexOf(pubId) + 1;
      return (
        <Link
          key={cita}
          id={withoutIDs ? null : `description-${refCounter}`}
          className={f('text-high')}
          to={customLocation => {
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
const ENTRY_DBS = [
  'panther',
  'pfam',
  'cathgene3d',
  'ssf',
  'cdd',
  'profile',
  'smart',
  'tigrfams',
  'prosite',
  'prints',
  'hamap',
  'pirsf',
  'sfld',
  'interpro',
];
const xReferenceURL = {
  cazy: 'http://www.cazy.org/fam/{}.html',
  cog: 'http://www.ncbi.nlm.nih.gov/COG/new/release/cow.cgi?cog={}',
  intenz: 'http://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec={}',
  genprop: 'https://www.ebi.ac.uk/interpro/genomeproperties/#{}',
};

export const Paragraph = ({ p, literature = [], accession, withoutIDs }) => {
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
      {parts.map(part => {
        if (part.match(CITATIONS_REGEX))
          return (
            <Citations
              text={part}
              key={part}
              literature={literature}
              accession={accession}
              withoutIDs={withoutIDs}
            />
          );
        const tagMatch = part.match(TAG_REGEX_KV);
        if (tagMatch) {
          const [_, tagType, tagValue] = tagMatch;
          let type = tagType.toLowerCase();
          if (type === 'superfamily') type = 'ssf';
          if (ENTRY_DBS.indexOf(type) >= 0) {
            return (
              <Link
                key={part}
                to={{
                  description: {
                    main: { key: 'entry' },
                    entry: { db: tagType, accession: tagValue },
                  },
                }}
              >
                {tagValue}
              </Link>
            );
          }
          if (type === 'swissprot') {
            return (
              <Link
                key={part}
                to={{
                  description: {
                    main: { key: 'protein' },
                    entry: { db: 'reviewed', accession: tagValue },
                  },
                }}
              >
                {tagValue}
              </Link>
            );
          }
          if (type === 'pdbe') {
            return (
              <Link
                key={part}
                to={{
                  description: {
                    main: { key: 'structure' },
                    entry: { db: 'pdb', accession: tagValue },
                  },
                }}
              >
                {tagValue}
              </Link>
            );
          }
          if (type in xReferenceURL) {
            return (
              <Link
                href={xReferenceURL[type].replace('{}', tagValue)}
                target="_blank"
                className={f('ext')}
                key={part}
              >
                {tagValue}
              </Link>
            );
          }
        }
        // TODO: change the way descriptions work from the backend side.
        return (
          <div
            className={styles.inline}
            key={part}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                part
                  .replace(/\[$/, ' ')
                  .replace(/^]/, ' ')
                  .replace(/<li>/g, '&nbsp;• ')
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
  literature?: Array,
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
    const paragraphs = textBlocks.reduce((acc, e) => {
      transformFormatted(e).forEach(p => acc.push(p));
      return acc;
    }, []);
    return (
      <div className={f('margin-bottom-large')} data-testid="description">
        {paragraphs.map((p, i) => (
          <Paragraph
            key={i}
            p={p}
            literature={literature}
            accession={accession}
            withoutIDs={withoutIDs}
          />
        ))}
      </div>
    );
  }
}

export class DescriptionReadMore extends PureComponent {
  static propTypes = {
    text: T.string,
    minNumberOfCharToShow: T.number,
    patternToRemove: T.string,
  };
  constructor(props) {
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
