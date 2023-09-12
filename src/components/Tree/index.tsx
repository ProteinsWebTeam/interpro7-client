import React, { PureComponent, RefObject } from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';

import TaxonomyVisualisation from 'taxonomy-visualisation';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';

import ResizeObserverComponent from 'wrappers/ResizeObserverComponent';

import fisheyeOff from 'EBI-Icon-fonts/source/common/font-awesome/solid/dot-circle.svg';
import fisheyeOn from 'EBI-Icon-fonts/source/common/font-awesome/solid/bullseye.svg';

import cssBinder from 'styles/cssBinder';

import styles from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(styles, fonts);

export type TaxNode = {
  name: string;
  id: string;
  children?: Array<TaxNode>;
  hitcount?: number;
};
type Props = {
  data?: TaxNode | null;
  focused?: string;
  changeFocus?: (accession: string) => void;
  labelClick?: (accession: string) => void;
  hideToggle?: boolean;
  initialFisheye?: boolean;
  search: string;
};
type State = {
  fisheye: boolean;
  isFullScreen: boolean;
  searchTerm: string;
};

const DEFAULT_WIDTH = 600;

export class Tree extends PureComponent<Props, State> {
  _loadingVis = false;
  _ref: RefObject<SVGSVGElement>;
  _vis: TaxonomyVisualisation | null = null;

  static defaultProps = {
    initialFisheye: true,
  };

  constructor(props: Props) {
    super(props);

    const fisheye = !!props.initialFisheye;
    const search = props.search;

    this._ref = React.createRef();

    this.state = { fisheye, searchTerm: search, isFullScreen: false };
  }

  static getDerivedStateFromProps({ search }: Props, { searchTerm }: State) {
    if (search !== searchTerm) return { searchTerm: search };
    return null;
  }

  componentDidMount() {
    this._vis = new TaxonomyVisualisation(undefined, {
      initialMaxNodes: +Infinity,
      fisheye: this.state.fisheye,
      fixedNodeSize: 5,
      classnames: {
        inPath: styles['in-path'],
        node: styles.node,
      },
      enableZooming: true,
      useCtrlToZoom: true,
      searchTerm: this.props.search,
      highlightColor: '#094EEE',
      // shouldCorrectNodesOutside: true,
    });

    this._vis.addEventListener('focus', this._handleFocus);
    this._vis.addEventListener('click', this._handleLabelClick);
    this._vis.tree = this._ref.current;
    this._loadingVis = true;
    this._populateData(this.props.data, this.props.focused);
    this._loadingVis = false;
  }

  componentDidUpdate({ data, focused }: Props) {
    if (data !== this.props.data) {
      this._loadingVis = true;
      this._populateData(this.props.data, this.props.focused);
      this._loadingVis = false;
    }
    if (this._vis) {
      if (focused !== this.props.focused) {
        this._vis.focusNodeWithID(this.props.focused);
      }
      this._vis.searchTerm = this.state.searchTerm;
      this._vis.fisheye = this.state.fisheye;
    }
  }

  componentWillUnmount() {
    this._vis?.cleanup();
  }

  _handleClick = () => this.setState(({ fisheye }) => ({ fisheye: !fisheye }));

  _recenter = () => {
    this._vis?.resetZoom();
  };

  _handleFocus = (evt: Event) => {
    const {
      detail: { id },
    } = evt as CustomEvent;
    if (!this._loadingVis && this.props.changeFocus) this.props.changeFocus(id);
  };
  _handleLabelClick = (evt: Event) => {
    const {
      detail: { id },
    } = evt as CustomEvent;
    if (!this._loadingVis && this.props.labelClick) this.props.labelClick(id);
    else this._handleFocus(evt);
  };

  _populateData = (data: TaxNode | null | undefined, focused?: string) => {
    if (this._vis) {
      this._vis.data = data;
      this._vis.focusNodeWithID(focused);
    }
  };

  render() {
    return (
      <>
        <div className={styles.buttons}>
          <span className={styles.fullscreen}>
            <FullScreenButton
              element="treeDiv"
              tooltip="View the taxonomy tree in full screen mode"
              onFullScreenHook={() =>
                requestAnimationFrame(() =>
                  this.setState({ isFullScreen: true })
                )
              }
              onExitFullScreenHook={() =>
                this.setState({ isFullScreen: false })
              }
            />
          </span>
          {this.props.hideToggle ? null : (
            <span>
              <Tooltip title="toggle fisheye view">
                <button onClick={this._handleClick}>
                  <img
                    src={this.state.fisheye ? fisheyeOff : fisheyeOn}
                    alt="toggle-fisheye"
                  />
                </button>
              </Tooltip>
            </span>
          )}
          <span>
            <Tooltip title="Recenter">
              <button
                onClick={this._recenter}
                className={css('icon', 'icon-common', 'font-l')}
                data-icon="&#xf05b;"
              />
            </Tooltip>
          </span>
        </div>

        <ResizeObserverComponent measurements={['width']} element="div">
          {({ width }: { width: number }) => (
            <div className={styles.tree} data-testid="data-tree" id="treeDiv">
              <svg
                className={styles.container}
                ref={this._ref}
                style={{ flex: '1' }}
                width={
                  this.state.isFullScreen
                    ? window.screen.width
                    : 100 * Math.floor((width || DEFAULT_WIDTH) / 100)
                }
              />
            </div>
          )}
        </ResizeObserverComponent>
      </>
    );
  }
}
const mapStateToProps = createSelector(
  (state: GlobalState) => state.customLocation.search.search as string,
  (search) => ({ search })
);

export default connect(mapStateToProps)(Tree);
