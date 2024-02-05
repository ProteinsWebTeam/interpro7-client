import React, { PureComponent, RefObject } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { goToCustomLocation } from 'actions/creators';

import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import Card from 'components/SimpleCommonComponents/Card';
import { getTextForLabel } from 'utils/text';
import LabelBy from 'components/ProteinViewer/Options/LabelBy';

import ClanViewerViz from 'clanviewer';
import 'clanviewer/build/main.css';

import cssBinder from 'styles/cssBinder';

import summary from 'styles/summary.css';
import ipro from 'styles/interpro-vf.css';
import style from '../Summary/style.css';

const css = cssBinder(summary, ipro, style);

type Props = {
  data: {
    metadata: SetMetadata;
  };
  db?: string;
  goToCustomLocation: typeof goToCustomLocation;
  loading: boolean;
  label?: {
    accession: boolean;
    name: boolean;
    short: boolean;
  };
};
type NodeData = {
  accession: string;
  name: string;
  short_name: string;
};
type State = {
  showClanViewer: boolean;
  nodeHovered: null | NodeData;
};

const MAX_NUMBER_OF_NODES = 100;

class ClanViewer extends PureComponent<Props, State> {
  _ref: RefObject<HTMLDivElement>;
  _vis?: ClanViewerViz;
  loaded: boolean;

  constructor(props: Props) {
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
    this._ref.current?.addEventListener('click', (evt: Event) =>
      this._handleClick(evt),
    );
    this.updateLocationIfAllDB();
  }

  componentDidUpdate(prevProps: Props) {
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
    this._vis?.clear();
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
      this._vis?.clear();
      this._vis?.paint(data);
      this.loaded = true;
      for (const node of this._ref.current?.querySelectorAll('g.node') || []) {
        node.addEventListener('mouseenter', (evt: Event) => {
          this.setState({
            nodeHovered: (evt.target as HTMLElement & { __data__: NodeData })
              ?.__data__,
          });
        });
        node.addEventListener('mouseleave', () => {
          this.setState({ nodeHovered: null });
        });
      }
    }
  }

  _handleClick = (event: Event) => {
    const g = event
      .composedPath()
      .filter((e) => (e as HTMLElement).nodeName === 'g')
      .filter((e) => (e as HTMLElement).classList.contains('node'))?.[0];
    if (g) {
      this.props.goToCustomLocation({
        description: {
          main: { key: 'entry' },
          entry: {
            db: this.props.db,
            accession: (g as HTMLElement).dataset.accession,
          },
        },
      });
    }
  };
  _refreshLabels = () => {
    if (!this._vis) return;
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
            relationships: null,
          }
        : this.props.data.metadata;

    return (
      <div className={css('vf-stack', 'vf-stack--400')}>
        {!this.state.showClanViewer &&
          (metadata.relationships?.nodes?.length || 0) >
            MAX_NUMBER_OF_NODES && (
            <Card title="ClanViewer">
              <section>
                The selected clan has {metadata.relationships?.nodes.length}{' '}
                member entries. Displaying more than {MAX_NUMBER_OF_NODES} nodes
                in this visualisation can affect the performance of your
                browser.
                <button
                  className={css(
                    'vf-button',
                    'vf-button--secondary',
                    'vf-button--sm',
                  )}
                  onClick={() => this.setState({ showClanViewer: true })}
                >
                  Visualise it
                </button>
              </section>
            </Card>
          )}
        <div>
          <DropDownButton
            label="Label Content"
            extraClasses={css('protvista-menu')}
          >
            <LabelBy />
          </DropDownButton>
        </div>
        <div className={css('clanviewer-container')}>
          <div
            ref={this._ref}
            style={{ minHeight: 500 }}
            id="clanViewerContainer"
          />
          <div
            className={css('legends')}
            style={{
              opacity: this.state.nodeHovered ? 1 : 0,
            }}
          >
            <ul className={css('no-bullet')}>
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
  (state: GlobalState) => state.customLocation.description.set.db,
  (state: GlobalState) => state.settings.ui,
  (db, ui) => ({ db, label: ui.labelContent }),
);

export default connect(mapStateToProps, { goToCustomLocation })(ClanViewer);
