// @flow
import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash-es';

import ProtVistaOptions from './Options';
import ProtVistaPopup from './Popup';
// $FlowFixMe
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import {
  Genome3dLink,
  AlphafoldLink,
  // $FlowFixMe
} from 'components/ExtLink/patternLinkWrapper';
import { FunFamLink } from 'subPages/Subfamilies';

import ProtVistaManager from 'protvista-manager';
import ProtVistaSequence from 'protvista-sequence';
import ProtVistaColouredSequence from 'protvista-coloured-sequence';
import ProtVistaNavigation from 'protvista-navigation';
import ProtVistaInterProTrack from 'protvista-interpro-track';
import ProtvistaTrack from 'protvista-track';
import ProtvistaZoomTool from 'protvista-zoom-tool';
import NightingaleLinegraphTrack from 'nightingale-linegraph-track';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { NOT_MEMBER_DBS } from 'menuConfig';

import spinner from 'components/SimpleCommonComponents/Loading/style.css';
import PopperJS from 'popper.js';

import loadWebComponent from 'utils/load-web-component';
import { getTextForLabel } from 'utils/text';
import id from 'utils/cheap-unique-id';

import loadData from 'higherOrder/loadData';
import { goToCustomLocation } from 'actions/creators';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import localCSS from './style.css';
import gridCSS from './grid.css';
import popperCSS from './popper.css';

const f = foundationPartial(ipro, localCSS, spinner, fonts, gridCSS, popperCSS);

const webComponents = [];

const TOOLTIP_DELAY = 500;

const loadProtVistaWebComponents = () => {
  if (!webComponents.length) {
    webComponents.push(
      loadWebComponent(() => ProtVistaManager).as('protvista-manager'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaSequence).as('protvista-sequence'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaColouredSequence).as(
        'protvista-coloured-sequence',
      ),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaNavigation).as('protvista-navigation'),
    );

    webComponents.push(
      loadWebComponent(() => ProtVistaInterProTrack).as(
        'protvista-interpro-track',
      ),
    );

    webComponents.push(
      loadWebComponent(() => ProtvistaTrack).as('protvista-track'),
    );

    webComponents.push(
      loadWebComponent(() => ProtvistaZoomTool).as('protvista-zoom-tool'),
    );

    webComponents.push(
      loadWebComponent(() => NightingaleLinegraphTrack).as(
        'nightingale-linegraph-track',
      ),
    );

    webComponents.push(
      loadWebComponent(() =>
        import('interpro-components').then((m) => m.InterproType),
      ).as('interpro-type'),
    );
  }
  return Promise.all(webComponents);
};

const getUIDFromEntry = (entry) =>
  `${entry.accession}${entry.source_database === 'pfam-n' ? '-N' : ''}`;

/*:: import type { ColorMode } from 'utils/entry-color'; */
/*:: type Props = {
  protein: Object,
  data: Array<Object>,
  dataDB: Object,
  colorDomainsBy: ColorMode,
  label: {
    accession: boolean,
    name: boolean,
    short: boolean,
  },
  fetchConservation: function,
  title: string,
  fixedHighlight: string,
  id: string,
  showOptions: boolean,
  showConservationButton: boolean,
  showHydrophobicity: boolean,
  handleConservationLoad: function,
  goToCustomLocation: function,
  customLocation: Object,
  children: any,
  conservationError: null|string,
}; */

/*:: type State = {
  entryHovered: any,
  hideCategory: Object,
  expandedTrack: Object,
  collapsed: boolean,
  enableTooltip: boolean,
  showLoading: boolean,
  overPopup: boolean,
  optionsID: string,
  isPrinting: boolean,
}; */
export class ProtVista extends Component /*:: <Props, State> */ {
  /*::
    web_tracks: {};
    reactRoot: any;
    popper: any;
    _isPopperTop: boolean;
    _timeoutID: ?IntervalID;
    _mainRef: { current: null | React$ElementRef<'div'> };
    _popperRef: { current: null | React$ElementRef<'div'> };
    _popperContentRef: { current: null | React$ElementRef<'div'> };
    _protvistaRef: { current: null | React$ElementRef<'div'> };
    _webProteinRef: { current: null | React$ElementRef<typeof ProtVistaSequence> };
    _hydroRef: { current: null | React$ElementRef<typeof ProtVistaColouredSequence> };
    _conservationTrackRef: { current: null | React$ElementRef<'div'> };
   */
  static propTypes = {
    protein: T.object,
    data: T.array,
    dataDB: T.object,
    colorDomainsBy: T.string,
    label: T.shape({
      accession: T.bool,
      name: T.bool,
      short: T.bool,
    }),
    title: T.string,
    fixedHighlight: T.string,
    id: T.string,
    showOptions: T.bool,
    showConservationButton: T.bool,
    showHydrophobicity: T.bool,
    handleConservationLoad: T.func,
    goToCustomLocation: T.func,
    customLocation: T.object,
    children: T.any,
    conservationError: T.string,
  };

  constructor(props /*: Props */) {
    super(props);

    this.web_tracks = {};

    this.state = {
      entryHovered: null,
      hideCategory: {},
      expandedTrack: {},
      collapsed: false,
      label: {
        accession: true,
        name: false,
        short: false,
      },
      addLabelClass: '',
      enableTooltip: true,
      showLoading: false,
      overPopup: false,
      optionsID: id('protvista-options-'),
      isPrinting: false,
    };

    this._mainRef = React.createRef();
    this._popperRef = React.createRef();
    this._popperContentRef = React.createRef();
    this._protvistaRef = React.createRef();
    this._webProteinRef = React.createRef();
    this._hydroRef = React.createRef();
    this._conservationTrackRef = React.createRef();
    this._isPopperTop = true;
    this._timeoutID = null;
  }

  async componentDidMount() {
    await loadProtVistaWebComponents();
    const { data, protein } = this.props;
    if (this._webProteinRef.current) {
      const proteinE = this._webProteinRef.current;
      proteinE.data = protein;
      this.updateTracksWithData(data);
      if (this._popperContentRef.current) {
        const popperE = this._popperContentRef.current;
        popperE.addEventListener('mouseover', () =>
          this.setState({ overPopup: true }),
        );
        popperE.addEventListener('mouseout', () =>
          this.setState({ overPopup: false }),
        );
      }
    }
    if (this._hydroRef.current) {
      const hydroE = this._hydroRef.current;
      hydroE.data = protein;
      hydroE.addEventListener('change', this._handleTrackChange);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state || !isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.updateTracksWithData(this.props.data);
      if (this._webProteinRef.current && this._hydroRef.current) {
        this._webProteinRef.current.data = this.props.protein;
        this._hydroRef.current.data = this.props.protein;
      }
    } else if (prevProps.colorDomainsBy !== this.props.colorDomainsBy) {
      for (const track of (Object.values(this.web_tracks) /*: any */)) {
        for (const d of [...track._data, ...(track._contributors || [])]) {
          d.color = getTrackColor(d, this.props.colorDomainsBy);
        }
        track.refresh();
      }
    }
  }

  _setResiduesInState(children, accession) {
    if (children) {
      this.web_tracks[accession].contributors = children;
      for (const child of children) {
        if (child.residues) {
          this.setObjectValueInState('expandedTrack', child.accession, true);
        }
      }
    }
  }

  updateTracksWithData(data) {
    const b2sh = new Map([
      ['N_TERMINAL_DISC', 'discontinuosStart'], // TODO fix spelling in this and nightingale
      ['C_TERMINAL_DISC', 'discontinuosEnd'],
      ['CN_TERMINAL_DISC', 'discontinuos'],
      ['NC_TERMINAL_DISC', 'discontinuos'],
    ]);

    for (const type of data) {
      for (const d of type[1]) {
        const tmp = ['sequence_conservation', 'confidence'].includes(d.type)
          ? d.data
          : (d.entry_protein_locations || d.locations).map((loc) => ({
              accession: d.accession,
              name: d.name,
              source_database: d.source_database,
              locations: [loc],
              color: getTrackColor(d, this.props.colorDomainsBy),
              entry_type: d.entry_type,
              type: d.type || 'entry',
              residues: d.residues && JSON.parse(JSON.stringify(d.residues)),
              chain: d.chain,
              protein: d.protein,
              confidence: loc.confidence,
            }));
        const children = d.children
          ? d.children.map((child) => ({
              accession: child.accession,
              chain: d.chain,
              name: child.name,
              residues:
                child.residues && JSON.parse(JSON.stringify(child.residues)),
              source_database: child.source_database,
              entry_type: child.entry_type,
              type: child.type,
              locations: (child.entry_protein_locations || child.locations).map(
                (loc) => ({
                  ...loc,
                  fragments: loc.fragments.map((f) => ({
                    shape: b2sh.get(f['dc-status']),
                    ...f,
                  })),
                }),
              ),
              parent: d,
              color: getTrackColor(
                Object.assign(child, { parent: d }),
                this.props.colorDomainsBy,
              ),
              location2residue: child.location2residue,
            }))
          : null;
        if (tmp.length > 0) {
          const isNewElement =
            !this.web_tracks[getUIDFromEntry(d)]._data &&
            !this.web_tracks[getUIDFromEntry(d)].sequence;
          this.web_tracks[getUIDFromEntry(d)].data = tmp;
          if (this.props.fixedHighlight)
            this.web_tracks[getUIDFromEntry(d)].fixedHighlight =
              this.props.fixedHighlight;
          this._setResiduesInState(children, d.accession);
          if (isNewElement) {
            this.web_tracks[getUIDFromEntry(d)].addEventListener(
              'change',
              this._handleTrackChange,
            );
          }
          this.setObjectValueInState(
            'expandedTrack',
            d.accession,
            this.web_tracks[getUIDFromEntry(d)]._expanded,
          );
        }
      }
      this.setObjectValueInState(
        'hideCategory',
        type[0],
        type[0] === 'other residues',
      );
    }
  }

  _handleTrackChange = ({ detail }) => {
    if (detail) {
      switch (detail.eventtype) {
        case 'click':
          this.handleCollapseLabels(detail.feature.accession);
          break;
        case 'mouseout':
          this._timeoutID = setInterval(() => {
            if (this.state.overPopup) return;
            clearInterval(this._timeoutID);
            this.popper.destroy();
            if (this._popperRef.current)
              this._popperRef.current.classList.add(f('hide'));
            this._timeoutID = null;
          }, TOOLTIP_DELAY);
          break;
        case 'mouseover':
          if (this.state.enableTooltip) {
            if (this._timeoutID !== null) {
              clearInterval(this._timeoutID);
            }
            if (this._popperRef.current)
              this._popperRef.current.classList.remove(f('hide'));
            const sourceDatabase = this._getSourceDatabaseDisplayName(
              detail.feature,
              this.props?.dataDB?.payload?.databases,
            );
            if (this._popperContentRef.current) {
              // eslint-disable-next-line max-depth
              if (!this.reactRoot)
                this.reactRoot = createRoot(this._popperContentRef.current);

              this.reactRoot.render(
                <ProtVistaPopup
                  detail={detail}
                  sourceDatabase={sourceDatabase}
                  data={this.props.data}
                  currentLocation={this.props.customLocation}
                  // Need to pass it from here because it rendered out of the redux provider
                  goToCustomLocation={this.props.goToCustomLocation}
                />,
              );
            }

            this._isPopperTop = !this._isPopperTop;
            if (this._popperRef.current) {
              this.popper = new PopperJS(
                detail.target,
                this._popperRef.current,
                {
                  applyStyle: { enabled: false },
                  modifiers: {
                    preventOverflow: {
                      boundariesElement: this._protvistaRef?.current || window,
                      priority: ['left', 'right'],
                    },
                  },
                },
              );
            }
          }
          break;
        default:
          break;
      }
    }
  };

  _getSourceDatabaseDisplayName = (entry, databases) => {
    let sourceDatabase = '';
    if (Array.isArray(entry.source_database)) {
      if (entry.source_database[0] in databases) {
        sourceDatabase = databases[entry.source_database[0]].name;
      } else {
        sourceDatabase = entry.source_database[0];
      }
    } else {
      if (entry.source_database in databases) {
        sourceDatabase = databases[entry.source_database].name;
      } else {
        sourceDatabase = entry.source_database;
      }
    }
    return sourceDatabase;
  };

  setObjectValueInState = (
    objectName /*: string */,
    type /*: string */,
    value /*: any */,
  ) =>
    this.setState(({ [objectName]: obj }) => ({
      [objectName]: { ...obj, [type]: value },
    }));

  handleCollapseLabels = (accession) => {
    if (this.web_tracks[accession]) {
      this.setObjectValueInState(
        'expandedTrack',
        accession,
        this.web_tracks[accession]._expanded,
      );
    } else if (this.state.expandedTrack.hasOwnProperty(accession)) {
      this.setObjectValueInState(
        'expandedTrack',
        accession,
        !this.state.expandedTrack[accession],
      );
    }
  };

  updateTracksCollapseStatus = (expandedTrack) =>
    this.setState({ expandedTrack });

  toggleTooltipStatus = (status) =>
    this.setState({
      enableTooltip: status,
    });

  renderSwitch(label, entry) {
    const type =
      entry.source_database === 'interpro' && entry.type ? (
        <interpro-type type={entry.type.replace('_', ' ')} dimension="1em" />
      ) : null;
    if (entry.accession.startsWith('residue:'))
      return entry.accession.split('residue:')[1];
    return (
      <>
        {type}
        {getTextForLabel(entry, label)}
      </>
    );
  }

  // eslint-disable-next-line complexity
  renderExceptionalLabels(entry) {
    const { dataDB, id } = this.props;
    const { isPrinting } = this.state;
    const databases = dataDB?.payload?.databases || {};

    if (entry.source_database === 'mobidblt')
      return isPrinting ? (
        <span>{entry.accession}</span>
      ) : (
        <Link href={`https://mobidb.org/${id}`}>{entry.accession}</Link>
      );
    if (entry.source_database === 'funfam') {
      return isPrinting ? (
        <span>{entry.accession}</span>
      ) : (
        <FunFamLink accession={entry.accession}>{entry.accession}</FunFamLink>
      );
    }
    if (entry.source_database === 'pfam-n') {
      return isPrinting ? (
        <span>N: {entry.accession}</span>
      ) : (
        <Link
          to={{
            description: {
              main: { key: 'entry' },
              entry: { db: 'pfam', accession: entry.accession },
            },
          }}
        >
          N: {entry.accession}
        </Link>
      );
    }
    if (entry.source_database === 'alphafold') {
      return (
        <AlphafoldLink id={entry.protein} className={f('ext')}>
          pLDDT
        </AlphafoldLink>
      );
    }
    if (entry.type === 'residue')
      return <span>{entry.locations[0].description}</span>;
    if (
      NOT_MEMBER_DBS.has(entry.source_database) ||
      entry.type === 'chain' ||
      entry.type === 'secondary_structure'
    )
      return entry.accession;
    if (entry.type === 'sequence_conservation') {
      if (entry.accession in databases) {
        return (
          <Tooltip title={'Score calculated using Phmmer and HMM profile'}>
            <div className={f('sequence-conservation-label')}>
              {databases[entry.accession].name} conservation
            </div>
          </Tooltip>
        );
      }
      return (
        <div className={f('sequence-conservation-label')}>
          {entry.accession} conservation
        </div>
      );
    }
    if (entry.accession && entry.accession.startsWith('G3D:')) {
      return (
        <Genome3dLink id={entry.protein}>{entry.source_database}</Genome3dLink>
      );
    }
    return null;
  }

  renderLabels(entry) {
    const { expandedTrack, isPrinting } = this.state;

    const key /*: string */ =
      entry.source_database === 'pdb' ? 'structure' : 'entry';
    return (
      this.renderExceptionalLabels(entry) || (
        <>
          {isPrinting ? (
            <b>{this.renderSwitch(this.props.label, entry)}</b>
          ) : (
            <Link
              to={{
                description: {
                  main: {
                    key,
                  },
                  [key]: {
                    db: entry.source_database,
                    accession: entry.accession.startsWith('residue:')
                      ? entry.accession.split('residue:')[1]
                      : entry.accession,
                  },
                },
              }}
            >
              {this.renderSwitch(this.props.label, entry)}
            </Link>
          )}
          <div
            className={f({
              hide: !expandedTrack[entry.accession],
            })}
          >
            {this.renderResidueLabels(entry)}
            {entry.children &&
              entry.children.map((d) => (
                <div
                  key={`main_${d.accession}`}
                  className={f('track-accession-child')}
                >
                  {isPrinting ? (
                    this.renderSwitch(this.props.label, d)
                  ) : (
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: d.source_database,
                            accession: d.accession,
                          },
                        },
                      }}
                    >
                      {this.renderSwitch(this.props.label, d)}
                    </Link>
                  )}
                  {this.renderResidueLabels(d)}
                </div>
              ))}
          </div>
        </>
      )
    );
  }

  renderResidueLabels(entry) {
    if (!entry.residues) return null;
    const { expandedTrack } = this.state;
    return entry.residues.map((residue) =>
      residue.locations.map((r, i) => (
        <div
          key={`res_${r.accession}_${i}`}
          className={f('track-accession-child', {
            hide: !expandedTrack[entry.accession],
          })}
        >
          <span>
            {r.description
              ? r.description.charAt(0).toUpperCase() + r.description.slice(1)
              : r.accession}
          </span>
        </div>
      )),
    );
  }

  handleConservationLoad(_this /*: ProtVista */) {
    _this.setState({ showLoading: true });
    _this.props.handleConservationLoad();
  }

  // Refs to be passed to the child component - <ProtVistaOptions>
  getProtvistaRefs = () => {
    const neededRefs = {
      _mainRef: this._mainRef,
      _protvistaRef: this._protvistaRef,
    };
    return neededRefs;
  };

  render() {
    const {
      protein: { length },
      data,
      showConservationButton,
      children,
      showOptions = true,
      showHydrophobicity = false,
    } = this.props;

    if (!(length && data)) return <Loading />;

    const { hideCategory } = this.state;

    return (
      <div
        ref={this._mainRef}
        className={f('fullscreenable', 'margin-bottom-large')}
      >
        <div ref={this._popperRef} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
          <div ref={this._popperContentRef} />
        </div>
        <div>
          <protvista-manager
            attributes="length displaystart displayend highlight"
            id="pv-manager"
          >
            <div className={f('protvista-grid')}>
              <div className={f('view-options-wrap', 'track-sized')}>
                {showOptions && (
                  <ProtVistaOptions
                    title={this.props.title}
                    length={length}
                    id={this.state.optionsID}
                    webTracks={this.web_tracks}
                    expandedTrack={this.state.expandedTrack}
                    getParentElem={this.getProtvistaRefs}
                    updateTracksCollapseStatus={this.updateTracksCollapseStatus}
                    toggleTooltipStatus={this.toggleTooltipStatus}
                    setPrintingMode={(mode /*: boolean */) =>
                      this.setState({ isPrinting: mode })
                    }
                  >
                    {children}
                  </ProtVistaOptions>
                )}
              </div>
            </div>
            <div
              className={f('protvista-grid', {
                printing: this.state.isPrinting,
              })}
              ref={this._protvistaRef}
              id={`${this.state.optionsID}ProtvistaDiv`}
            >
              <div className={f('track')}>
                <protvista-navigation
                  length={length}
                  displaystart="1"
                  displayend={length}
                />
              </div>
              <div className={f('track')}>
                <protvista-sequence
                  ref={this._webProteinRef}
                  length={length}
                  displaystart="1"
                  displayend={length}
                  highlight-event="onmouseover"
                  use-ctrl-to-zoom
                />
              </div>
              {showHydrophobicity && (
                <>
                  <div className={f('track')}>
                    <protvista-coloured-sequence
                      ref={this._hydroRef}
                      length={length}
                      displaystart="1"
                      displayend={length}
                      scale="hydrophobicity-scale"
                      height="10"
                      color_range="#0000FF:-3,#ffdd00:3"
                      highlight-event="onmouseover"
                      use-ctrl-to-zoom
                      class="hydro"
                    />
                  </div>
                  <div className={f('track-label')}>Hydrophobicity</div>
                </>
              )}
              {data &&
                data
                  .filter(([_, tracks]) => tracks && tracks.length)
                  .map(([type, entries, component]) => {
                    const LabelComponent = component?.component;
                    return (
                      <div
                        key={type}
                        className={f(
                          'tracks-container',
                          'track-sized',
                          'protvista-grid',
                          {
                            printing: this.state.isPrinting,
                          },
                        )}
                      >
                        <header>
                          <button
                            onClick={() =>
                              this.setObjectValueInState(
                                'hideCategory',
                                type,
                                !hideCategory[type],
                              )
                            }
                          >
                            <span
                              className={f(
                                'icon',
                                'icon-common',
                                hideCategory[type]
                                  ? 'icon-caret-right'
                                  : 'icon-caret-down',
                              )}
                            />{' '}
                            {type}
                          </button>
                        </header>
                        {component && (
                          <div className={f('track-accession')}>
                            <LabelComponent
                              {...(component?.attributes || {})}
                            />
                          </div>
                        )}{' '}
                        {entries &&
                          entries.map((entry) => (
                            <React.Fragment key={entry.accession}>
                              <div
                                className={f('track', {
                                  hideCategory: hideCategory[type],
                                })}
                              >
                                {entry.type === 'secondary_structure' ||
                                entry.type === 'sequence_conservation' ||
                                entry.type === 'confidence' ||
                                entry.type === 'residue' ? (
                                  <div
                                    className={f(
                                      'track',
                                      entry.type.replace('_', '-'),
                                    )}
                                  >
                                    {entry.type === 'sequence_conservation' &&
                                      entry.warnings.length > 0 && (
                                        <div
                                          className={f('conservation-warning')}
                                        >
                                          {entry.warnings.map((message) => (
                                            <div key={message}>{message}</div>
                                          ))}
                                        </div>
                                      )}
                                    {entry.type === 'sequence_conservation' &&
                                      entry.warnings.length === 0 && (
                                        <nightingale-linegraph-track
                                          length={length}
                                          displaystart="1"
                                          displayend={length}
                                          type="conservation"
                                          id={`track_${entry.accession}`}
                                          ref={(e) =>
                                            (this.web_tracks[
                                              getUIDFromEntry(entry)
                                            ] = e)
                                          }
                                          highlight-event="onmouseover"
                                          use-ctrl-to-zoom
                                        />
                                      )}
                                    {(entry.type === 'secondary_structure' ||
                                      entry.type === 'residue') && (
                                      <protvista-track
                                        length={length}
                                        displaystart="1"
                                        displayend={length}
                                        height={
                                          entry.type === 'residue' ? '15' : null
                                        }
                                        id={`track_${entry.accession}`}
                                        ref={(e) =>
                                          (this.web_tracks[
                                            getUIDFromEntry(entry)
                                          ] = e)
                                        }
                                        highlight-event="onmouseover"
                                        use-ctrl-to-zoom
                                      />
                                    )}
                                    {entry.type === 'confidence' && (
                                      <protvista-coloured-sequence
                                        ref={(e) =>
                                          (this.web_tracks[entry.accession] = e)
                                        }
                                        id={`track_${entry.accession}`}
                                        length={length}
                                        displaystart="1"
                                        displayend={length}
                                        scale="H:90,M:70,L:50,D:0"
                                        height="12"
                                        color_range="#ff7d45:0,#ffdb13:50,#65cbf3:70,#0053d6:90,#0053d6:100"
                                        highlight-event="onmouseover"
                                        class="confidence"
                                        use-ctrl-to-zoom
                                      />
                                    )}
                                  </div>
                                ) : (
                                  <protvista-interpro-track
                                    length={length}
                                    displaystart="1"
                                    displayend={length}
                                    id={`track_${entry.accession}`}
                                    ref={(e) =>
                                      (this.web_tracks[getUIDFromEntry(entry)] =
                                        e)
                                    }
                                    shape="roundRectangle"
                                    highlight-event="onmouseover"
                                    use-ctrl-to-zoom
                                    expanded
                                  />
                                )}
                              </div>
                              <div
                                className={f('track-label', {
                                  hideCategory: hideCategory[type],
                                })}
                              >
                                {this.renderLabels(entry)}
                              </div>
                            </React.Fragment>
                          ))}
                      </div>
                    );
                  })}
              {showConservationButton ? (
                <div
                  className={f(
                    'tracks-container',
                    'track-sized',
                    'protvista-grid',
                    {
                      printing: this.state.isPrinting,
                    },
                  )}
                >
                  <header>
                    <button onClick={() => this.handleConservationLoad(this)}>
                      <span
                        className={f('icon', 'icon-common', 'icon-caret-right')}
                      />{' '}
                      Match Conservation
                    </button>
                  </header>
                  <div className={f('track')}>
                    <div
                      className={f('conservation-placeholder-component')}
                      ref={this._conservationTrackRef}
                    >
                      {this.props.conservationError ? (
                        <div className={f('conservation-error')}>
                          ⚠️ {this.props.conservationError}
                        </div>
                      ) : (
                        <>
                          {this.state.showLoading ? <Loading inline /> : null}
                        </>
                      )}
                    </div>
                  </div>
                  <div className={f('track-label')}>
                    <button
                      type="button"
                      className={f('hollow', 'button', 'user-select-none')}
                      onClick={() => this.handleConservationLoad(this)}
                    >
                      Fetch Conservation
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </protvista-manager>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.customLocation,
  (state) => state.settings.ui,
  (customLocation, ui) => ({
    customLocation,
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
    label: ui.labelContent,
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(ProtVista);
