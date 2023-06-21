// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { getTextForLabel } from 'utils/text';
// $FlowFixMe
import LabelBy from 'components/ProteinViewer/Options/LabelBy';

import ClanViewerViz from 'clanviewer';
import 'clanviewer/build/main.css';
import ZoomOverlay from 'components/ZoomOverlay';

import { foundationPartial } from 'styles/foundation';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import style from '../Summary/style.css';

const f = foundationPartial(ebiGlobalStyles, style);

/*::
type Props = {
  data: {
    metadata: Object,
  },
  db: string,
  goToCustomLocation: function,
  loading: boolean,
  label: {
    accession: boolean,
    name: boolean,
    short: boolean,
  },
};

type State = {
  showClanViewer: boolean,
  nodeHovered: null | {
    accession:string,
    name:string,
    short_name:string,
  }
};
 */
const MAX_NUMBER_OF_NODES = 100;

class ClanViewer extends PureComponent /*:: <Props, State> */ {
  /*::
    _ref: { current: null | React$ElementRef<'div'> };
    _vis: typeof ClanViewerViz;
    loaded: boolean;
  */
  static propTypes = {
    data: T.shape({
      metadata: T.object,
    }).isRequired,
    db: T.string.isRequired,
    goToCustomLocation: T.func.isRequired,
    loading: T.bool.isRequired,
    label: T.shape({
      accession: T.bool,
      name: T.bool,
      short: T.bool,
    }),
  };

  constructor(props /*: Props */) {
    super(props);

    this._ref = React.createRef();
    this.state = { showClanViewer: false, nodeHovered: null };
    this.loaded = false;
  }

  componentDidMount() {
    if (!this._ref.current || this._vis) return;
    this._vis = new ClanViewerViz({
      element: this._ref.current,
      useCtrlToZoom: true,
      height: 600,
      nodeLabel: (node) => getTextForLabel(node, this.props.label),
    });
    if (
      this.props?.data?.metadata?.relationships?.nodes &&
      this.props.data.metadata.relationships.nodes.length <= MAX_NUMBER_OF_NODES
    )
      this.setState({ showClanViewer: true });
    this._ref.current?.addEventListener('click', (evt /*: Event */) =>
      this._handleClick(evt),
    );
    this.updateLocationIfAllDB();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.label !== this.props.label) this._refreshLabels();
    if (
      prevProps.data?.metadata?.accession !==
      this.props?.data?.metadata?.accession
    )
      this.loaded = false;
    this.repaint();
    this.updateLocationIfAllDB();
  }

  componentWillUnmount() {
    if (this._ref.current) {
      this._ref.current?.removeEventListener('click', this._handleClick);
    }
    this._vis.clear();
  }
  updateLocationIfAllDB() {
    if (
      this.props.db === 'all' &&
      this.props?.data?.metadata?.source_database
    ) {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'set' },
          set: {
            db: this.props?.data?.metadata?.source_database,
            accession: this.props?.data?.metadata?.accession,
          },
        },
      });
    }
  }
  repaint() {
    if (
      (this.state.showClanViewer ||
        this.props.data.metadata.relationships.nodes.length <=
          MAX_NUMBER_OF_NODES) &&
      !this.loaded
    ) {
      const data = this.props.data.metadata.relationships;
      this._vis.clear();
      this._vis.paint(data, false);
      this.loaded = true;
      for (const node /*: HTMLElement */ of this._ref.current?.querySelectorAll(
        'g.node',
      ) || []) {
        node.addEventListener('mouseenter', (evt /*: Event */) => {
          this.setState({ nodeHovered: (evt.target /*: any */).__data__ });
        });
        node.addEventListener('mouseleave', () => {
          this.setState({ nodeHovered: null });
        });
      }
    }
  }

  _handleClick = (event /*: Event */) => {
    const g = event
      .composedPath()
      .filter((e /*: any */) => e.nodeName === 'g')
      .filter((e /*: any */) => e.classList.contains('node'))?.[0];
    if (g) {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'entry' },
          entry: {
            db: this.props.db,
            accession: (g /*: any */).dataset.accession,
          },
        },
      });
    }
  };
  _refreshLabels = () => {
    this._vis.updatingLabels = true;
    if (this._vis.tick) this._vis.tick();
    this._vis.updatingLabels = false;
  };
  render() {
    const metadata =
      this.props.loading || !this.props.data.metadata
        ? {
            accession: '',
            description: '',
            id: '',
            source_database: '',
            authors: null,
            literature: null,
          }
        : this.props.data.metadata;

    return (
      <div className={f('row')}>
        {!this.state.showClanViewer &&
          metadata.relationships &&
          metadata.relationships.nodes &&
          metadata.relationships.nodes.length > MAX_NUMBER_OF_NODES && (
            <div
              className={f('flex-card')}
              style={{ width: '50%', padding: '1em' }}
            >
              <h3>ClanViewer</h3>
              <section>
                The selected clan has {metadata.relationships.nodes.length}{' '}
                member entries. Displaying more than {MAX_NUMBER_OF_NODES} nodes
                in this visualisation can affect the performance of your
                browser.
                <button
                  className={f('button')}
                  onClick={() => this.setState({ showClanViewer: true })}
                >
                  Visualise it
                </button>
              </section>
            </div>
          )}
        <div>
          <DropDownButton
            label="Label Content"
            extraClasses={f('protvista-menu')}
          >
            <LabelBy />
          </DropDownButton>
        </div>
        <div className={f('clanviewer-container')}>
          <ZoomOverlay elementId="clanViewerContainer" />
          <div
            ref={this._ref}
            style={{ minHeight: 500 }}
            id="clanViewerContainer"
          />
          <div
            className={f('legends')}
            style={{
              opacity: this.state.nodeHovered ? 1 : 0,
            }}
          >
            <ul className={f('no-bullet')}>
              <li>
                <b>Accession</b>: {this.state?.nodeHovered?.accession}
              </li>
              <li>
                <b>Name</b>: {this.state?.nodeHovered?.name}
              </li>
              <li>
                <b>Short name</b>: {this.state?.nodeHovered?.short_name}
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation.description.set.db,
  (state) => state.settings.ui,
  (db, ui) => ({ db, label: ui.labelContent }),
);

export default connect(mapStateToProps, { goToCustomLocation })(ClanViewer);
