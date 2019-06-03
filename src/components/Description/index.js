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

export const ParagraphWithCites = ({
  p,
  literature = [],
  accession,
  withoutIDs,
}) => (
  <div className={styles.paragraph}>
    {p
      .split(/<cite id="([^"]+)" ?\/>,?/i /* /\[(PUB\d+)\]/i*/)
      .map((part, i) => {
        const refCounter = literature.map(d => d[0]).indexOf(part) + 1;
        return i % 2 ? (
          <sup key={i}>
            <Link
              className={f('text-high')}
              id={withoutIDs ? null : `description-${refCounter}`}
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
                  hash: part,
                };
              }}
            >
              [{refCounter}]
            </Link>
          </sup>
        ) : (
          <span key={i}>
            {part === ', ' ? (
              '\u00a0'
            ) : (
              <ParagraphWithTags>{part}</ParagraphWithTags>
            )}
          </span>
        );
      })}
  </div>
);
ParagraphWithCites.propTypes = {
  p: T.string.isRequired,
  literature: T.array,
  accession: T.string,
  withoutIDs: T.bool,
};

const _getAttributesFromStringTag = text =>
  text
    .split(/\s|\/|>/)
    .map(e => (e.indexOf('=') <= 0 ? null : e.split('=')))
    .filter(Boolean)
    .reduce((acc, e) => {
      acc[e[0]] = e[1].replace(/"/g, '');
      return acc;
    }, {});

const _getTextFromStringTag = text => text.split(/>([^<]+)/)[1];

const xReferenceURL = {
  intact: 'https://www.ebi.ac.uk/intact/interaction/{}',
  ec: 'http://www.ebi.ac.uk/intenz/query?cmd=SearchEC&ec={}',
  prositedoc: 'https://prosite.expasy.org/cgi-bin/prosite/prosite-search-ac?{}',
  cazy: 'http://www.cazy.org/{}.html',
  cog: 'ftp://ftp.ncbi.nih.gov/pub/COG/COG2014/static/byCOG/{}.html',
  tc: 'http://www.tcdb.org/search/result.php?tc={}',
};

const ParagraphWithTags = ({ children }) => (
  <>
    {// Checking for the TAG dbxref
    children.split(/(<dbxref [^>]+?\/>)/i).map((part, i) => {
      if (i % 2) {
        const attrs = _getAttributesFromStringTag(part);
        const mainType =
          attrs.db.toLowerCase() === 'swissprot' ? 'protein' : 'entry';
        const mainDB =
          attrs.db.toLowerCase() === 'swissprot'
            ? 'uniprot'
            : attrs.db.toLowerCase();
        if (mainDB in xReferenceURL) {
          return (
            <Link
              href={xReferenceURL[mainDB].replace('{}', attrs.id)}
              target="_blank"
              className={f('ext')}
              key={i}
            >
              {attrs.id}
            </Link>
          );
        }
        return (
          <Link
            to={{
              description: {
                main: { key: mainType },
                [mainType]: { db: mainDB, accession: attrs.id },
              },
            }}
            key={i}
          >
            {attrs.id}
          </Link>
        );
      }
      // Checking for the TAG taxon
      return part.split(/(<taxon [^>]+>[^<]+<\/taxon>)/i).map((part, j) => {
        if (j % 2) {
          const text = _getTextFromStringTag(part);
          const attrs = _getAttributesFromStringTag(part);
          return (
            <Link
              key={`${i}-${j}`}
              to={{
                description: {
                  main: { key: 'taxonomy' },
                  taxonomy: {
                    db: 'uniprot',
                    accession: attrs.tax_id,
                  },
                },
              }}
            >
              {text}
            </Link>
          );
        }
        // TODO: change the way descriptions work from the backend side.
        return (
          <div
            className={styles.inline}
            key={`${i}-${j}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                part
                  .replace(/\[$/, ' ')
                  .replace(/^]/, ' ')
                  .replace(/<li>/g, '&nbsp;• ')
                  .replace(/<\/li>/g, '<br>')
                  .replace(/<ul>/g, '<br>')
                  .replace(/<\/?(ul|li)>/g, ''),
              ),
            }}
          />
        );
      });
    })}
  </>
);
ParagraphWithTags.propTypes = {
  children: T.any,
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
          <ParagraphWithCites
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
