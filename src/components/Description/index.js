/* eslint-disable no-param-reassign */
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { transformFormatted } from 'utils/text';

import { foundationPartial } from 'styles/foundation';
import Link from 'components/generic/Link';

import ebiStyles from 'ebi-framework/css/ebi-global.scss';
import styles from './style.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(ebiStyles, styles, theme);

const ParagraphWithCites = ({ p, literature = [] }) => (
  <p className={styles.paragraph}>
    {p.split(/<cite id="([^"]+)" ?\/>/i /* /\[(PUB\d+)\]/i*/).map((part, i) => {
      const refCounter = literature.map(d => d[0]).indexOf(part) + 1;
      return i % 2 ? (
        <a key={i} id={refCounter} href={`${location.pathname}#${part}`}>
          {refCounter}
        </a>
      ) : (
        <span key={i}>
          {part === ', ' ? (
            ',\u00a0'
          ) : (
            <ParagraphWithTags>{part}</ParagraphWithTags>
          )}
        </span>
      );
    })}
  </p>
);
ParagraphWithCites.propTypes = {
  p: T.string.isRequired,
  literature: T.array,
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
  <span>
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
                  main: { key: 'organism' },
                  organism: {
                    db: 'taxonomy',
                    accession: attrs.tax_id,
                  },
                },
              }}
            >
              {text}
            </Link>
          );
        }
        return part;
      });
    })}
  </span>
);
ParagraphWithTags.propTypes = {
  children: T.any,
};

/* ::
 type Props = {
   textBlocks: Array<string> ,
   literature?: Array,
   title?: string,
   extraTextForButton?: string,
 }
 */
class Description extends PureComponent {
  /* ::
    props: Props;
    state: {
      isOpen: boolean,
    };
    handleClick: () => void;
  */
  static propTypes = {
    textBlocks: T.array.isRequired,
    literature: T.array,
    title: T.string.isRequired,
    extraTextForButton: T.string.isRequired,
  };

  static defaultProps = {
    title: 'Description',
    extraTextForButton: '',
  };

  constructor(props /* : Props*/) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.moreButton = null;
    this.divContent = null;
  }

  handleClick() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const { textBlocks, literature, title, extraTextForButton } = this.props;
    const isOpen = this.state.isOpen;
    const paragraphs = textBlocks.reduce((acc, e) => {
      transformFormatted(e).forEach(p => acc.push(p));
      return acc;
    }, []);
    return (
      <div className={f('description-wrapper', 'margin-bottom-large')}>
        <h4>{title}</h4>
        <div
          className={f('animate-height', { collapsed: !isOpen })}
          ref={e => (this.divContent = e)}
        >
          {paragraphs
            .slice(0, isOpen ? undefined : 1)
            .map((p, i) => (
              <ParagraphWithCites key={i} p={p} literature={literature} />
            ))}
        </div>
        {paragraphs.length > 1 ? (
          <button
            className={f('button')}
            onClick={this.handleClick}
            ref={e => (this.moreButton = e)}
          >
            Read {this.state.isOpen ? 'less' : 'more'} {extraTextForButton}
          </button>
        ) : null}
      </div>
    );
  }
}

export default Description;
