import React, {PropTypes as T, Component} from 'react';
import ReactDOM from 'react-dom';
import {transformFormatted} from 'utils/text';
import {foundationPartial} from 'styles/foundation';
import ebiStyles from 'styles/ebi-global.css';
import styles from './style.css';
import theme from 'styles/theme-interpro.css';
const f = foundationPartial(ebiStyles, styles, theme);

const ParagraphWithCites = ({p, literature = {}}) => (
  <p>
    {p.split(/<cite id="([^"]+)" ?\/>/i /* /\[(PUB\d+)\]/i*/).map((part, i) => {
      const refCounter = Object.keys(literature).indexOf(part) + 1;
      return (
        i % 2 ?
          <a key={i} href={`${location.pathname}#${part}`}>{refCounter}</a> :
          <span key={i}>{part === ', ' ? ',\u00a0' : part}</span>
      );
    })}
  </p>
);
ParagraphWithCites.propTypes = {
  p: T.string.isRequired,
  literature: T.object,
};

const defaultHeightToHide = 200;
/* ::
 type Props = {
   textBlocks: Array<string> ,
   literature?: Object,
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
  constructor(props/* : Props*/) {
    super(props);
    this.state = {isOpen: false};
    this.handleClick = this.handleClick.bind(this);
    this.moreButton = null;
    this.divContent = null;
  }
  componentDidMount = () => {
    window.addEventListener('resize', this.recheckHeight);
    this.recheckHeight();
  }

  componentDidUpdate() {
    this.recheckHeight();
  }

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.recheckHeight);
  }
  handleClick(){
    this.setState({isOpen: !this.state.isOpen});
  }
  onResize() {
    this.recheckHeight();
  }
  recheckHeight() {
    if (this.moreButton && this.divContent) {
      const moreDiv = ReactDOM.findDOMNode(this.moreButton);
      const contentDiv = ReactDOM.findDOMNode(this.divContent);
      const {heightToHide = defaultHeightToHide} = this.props;
      if (moreDiv.offsetTop - contentDiv.offsetTop < heightToHide) {
        this.moreButton.style.visibility = 'hidden';
      } else {
        this.moreButton.style.visibility = 'visible';
      }
    }
  }
  render(){
    const {
      textBlocks, literature,
      title = 'Description',
      extraTextForButton = '',
      heightToHide = defaultHeightToHide,
    } = this.props;
    return (
      <div className={f('content')}>
        <h4>{title}</h4>
        <div
          className={f('animate-height', {collapsed: !this.state.isOpen})}
          style={{
            maxHeight: this.state.isOpen ? '5000px' : `${heightToHide}px`,
          }}
          ref={(e) => {
            this.divContent = e;
          }}
        >
          {textBlocks.map((b, i) => (
            <div key={i}>
              {transformFormatted(b).map((p, i) => (
                <ParagraphWithCites key={i} p={p} literature={literature}/>
              ))}
            </div>
          ))}
        </div>
        <button
          className={f('button')}
          id="show-more"
          onClick={this.handleClick}
          ref={(e) => {
            this.moreButton = e;
          }}
          style={{marginTop: '1em'}}
        >
          Read {this.state.isOpen ? 'less' : 'more'} {extraTextForButton}
        </button>
      </div>

    );
  }
}
Description.propTypes = {
  textBlocks: T.array.isRequired,
  literature: T.object,
  title: T.string,
  extraTextForButton: T.string,
  heightToHide: T.number,
};
export default Description;
