/* eslint-disable no-param-reassign */
import React, { Component } from 'react';
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
const ParagraphWithTags = ({ children }) => (
  <span>
    {// Checking for the TAG dbxref
    children.split(/(<dbxref [^>]+?\/>)/i).map((part, i) => {
      if (i % 2) {
        const attrs = _getAttributesFromStringTag(part);
        return (
          <Link
            newTo={{
              description: {
                mainType: 'entry',
                mainDB: attrs.db,
                mainAccession: attrs.id,
              },
            }}
          >
            {attrs.id}
          </Link>
        );
      }
      // Checking for the TAG taxon
      return part.split(/(<taxon [^>]+>[^<]+<\/taxon>)/i).map((part, i) => {
        if (i % 2) {
          const text = _getTextFromStringTag(part);
          const attrs = _getAttributesFromStringTag(part);
          return (
            <Link
              newTo={{
                description: {
                  mainType: 'organism',
                  mainDB: 'taxonomy',
                  mainAccession: attrs.tax_id,
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

const defaultHeightToHide = 200;
/* ::
 type Props = {
   textBlocks: Array<string> ,
   literature?: Array,
   title?: string,
   extraTextForButton?: string,
   heightToHide?: number,
 }
 */
class Description extends Component {
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
    heightToHide: T.number,
  };

  static defaultProps = {
    title: 'Description',
    extraTextForButton: '',
    heightToHide: defaultHeightToHide,
  };

  constructor(props /* : Props*/) {
    super(props);
    this.state = {
      isOpen: false,
      contentSize: 5000,
    };
    this.handleClick = this.handleClick.bind(this);
    this.moreButton = null;
    this.divContent = null;
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.recheckHeight);
    this.recheckHeight();
  };

  componentDidUpdate() {
    this.recheckHeight();
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.recheckHeight);
  };

  handleClick() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  onResize() {
    this.recheckHeight();
  }

  recheckHeight() {
    if (this.moreButton && this.divContent) {
      const moreDiv = this.moreButton;
      const contentDiv = this.divContent;
      const { heightToHide } = this.props;
      if (moreDiv.offsetTop - contentDiv.offsetTop < heightToHide) {
        this.moreButton.style.display = 'none';
      } else {
        this.moreButton.style.display = 'block';
      }
      // requestAnimationFrame(() => {console.log('setting'); this.setState({
      //   contentSize: contentDiv.firstElementChild.offsetHeight,
      // })});
    }
  }

  render() {
    const {
      textBlocks,
      literature,
      title,
      extraTextForButton,
      heightToHide,
    } = this.props;
    return (
      <div className={f('description-wrapper', 'margin-bottom-xlarge')}>
        <h4>{title}</h4>
        <div
          className={f('animate-height', { collapsed: !this.state.isOpen })}
          style={{
            maxHeight: `${
              this.state.isOpen ? this.state.contentSize : heightToHide
            }px`,
          }}
          ref={e => (this.divContent = e)}
        >
          {textBlocks.map((b, i) => (
            <div key={i}>
              {transformFormatted(b).map((p, i) => (
                <ParagraphWithCites key={i} p={p} literature={literature} />
              ))}
            </div>
          ))}
        </div>
        <button
          className={f('button')}
          onClick={this.handleClick}
          ref={e => (this.moreButton = e)}
        >
          Read {this.state.isOpen ? 'less' : 'more'} {extraTextForButton}
        </button>
      </div>
    );
  }
}

export default Description;
