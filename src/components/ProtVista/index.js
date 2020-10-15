// @flow
import React, { Component } from 'react';
import { render } from 'react-dom';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash-es';

import id from 'utils/cheap-unique-id';

import ProtVistaOptions from './Options';
import ProtVistaPopup from './Popup';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import Loading from 'components/SimpleCommonComponents/Loading';
import { Genome3dLink } from 'components/ExtLink';

import ProtVistaManager from 'protvista-manager';
import ProtVistaSequence from 'protvista-sequence';
import ProtVistaColouredSequence from 'protvista-coloured-sequence';
import ProtVistaNavigation from 'protvista-navigation';
import ProtVistaInterProTrack from 'protvista-interpro-track';
import ProtvistaTrack from 'protvista-track';
import ProtvistaZoomTool from 'protvista-zoom-tool';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { NOT_MEMBER_DBS } from 'menuConfig';

import spinner from 'components/SimpleCommonComponents/Loading/style.css';
import PopperJS from 'popper.js';

import loadWebComponent from 'utils/load-web-component';

import loadData from 'higherOrder/loadData';
import { goToCustomLocation } from 'actions/creators';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import localCSS from './style.css';

const f = foundationPartial(ipro, localCSS, spinner);

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
      loadWebComponent(() =>
        import('interpro-components').then((m) => m.InterproType),
      ).as('interpro-type'),
    );
  }
  return Promise.all(webComponents);
};

/*:: import type { ColorMode } from 'utils/entry-color'; */
/*:: type Props = {
  protein: Object,
  data: Array<Object>,
  dataDB: Object,
  colorDomainsBy: ColorMode,
  fetchConservation: function,
  title: string,
  fixedHighlight: string,
  id: string,
  showOptions: boolean,
  showConservationButton: boolean,
  handleConservationLoad: function,
  goToCustomLocation: function,
  customLocation: Object,
  children: any,
}; */

/*:: type State = {
  entryHovered: any,
  hideCategory: Object,
  expandedTrack: Object,
  collapsed: boolean,
  label: Object,
  addLabelClass: string,
  enableTooltip: boolean,
  showLoading: boolean,
  overPopup: boolean,
  optionsID: string,
}; */
export class ProtVista extends Component /*:: <Props, State> */ {
  /*:: 
    web_tracks: {};
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
    title: T.string,
    fixedHighlight: T.string,
    id: T.string,
    showOptions: T.bool,
    showConservationButton: T.bool,
    handleConservationLoad: T.func,
    goToCustomLocation: T.func,
    customLocation: T.object,
    children: T.any,
  };

  constructor(props /*: Props */) {
    super(props);

    this.web_tracks = {};

    this.state = {
      entryHovered: null,
      // colorMode: EntryColorMode.DOMAIN_RELATIONSHIP,
      hideCategory: {},
      expandedTrack: {},
      collapsed: false,
      label: {
        accession: true,
        name: false,
      },
      addLabelClass: '',
      enableTooltip: true,
      showLoading: false,
      overPopup: false,
      optionsID: id('protvista-options-'),
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
    if (this._webProteinRef.current && this._hydroRef.current) {
      const proteinE = this._webProteinRef.current;
      const hydroE = this._hydroRef.current;
      proteinE.data = protein;
      hydroE.data = protein;
      this.updateTracksWithData(data);
      hydroE.addEventListener('change', this._handleTrackChange);
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
        const tmp = (d.entry_protein_locations || d.locations).map((loc) => ({
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
        const isNewElement = !this.web_tracks[d.accession]._data;
        this.web_tracks[d.accession].data = tmp;
        if (this.props.fixedHighlight)
          this.web_tracks[
            d.accession
          ].fixedHighlight = this.props.fixedHighlight;
        this._setResiduesInState(children, d.accession);
        if (isNewElement) {
          this.web_tracks[d.accession].addEventListener(
            'change',
            this._handleTrackChange,
          );
        }
        this.setObjectValueInState(
          'expandedTrack',
          d.accession,
          this.web_tracks[d.accession]._expanded,
        );
      }
      this.setObjectValueInState('hideCategory', type[0], false);
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
              render(
                <ProtVistaPopup
                  detail={detail}
                  sourceDatabase={sourceDatabase}
                  data={this.props.data}
                  currentLocation={this.props.customLocation}
                  // Need to pass it from here because it rendered out of the redux provider
                  goToCustomLocation={this.props.goToCustomLocation}
                />,
                this._popperContentRef.current,
              );
            }

            this._isPopperTop = !this._isPopperTop;
            if (this._popperRef.current)
              this.popper = new PopperJS(
                detail.target,
                this._popperRef.current,
                {
                  placement: this._isPopperTop ? 'top' : 'bottom',
                  applyStyle: { enabled: false },
                },
              );
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

  updateLabel = (newLabelState) =>
    this.setState({
      label: newLabelState,
      addLabelClass: newLabelState.name ? 'label-by-name' : '',
    });

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
    return (
      <>
        {type}
        {label.accession && entry.accession}
        {label.accession && label.name && ': '}
        {label.name && entry.name}
      </>
    );
  }

  renderLabels(entry) {
    const { expandedTrack } = this.state;
    const { dataDB, id } = this.props;
    let databases = {};
    if (dataDB.payload) {
      databases = dataDB.payload.databases;
    }
    // const databases = dataDB.payload.databases;
    if (entry.source_database === 'mobidblt')
      return <Link href={`https://mobidb.org/${id}`}>{entry.accession}</Link>;
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
      return <Genome3dLink id={entry.protein}>{entry.accession}</Genome3dLink>;
    }
    const key /*: string */ =
      entry.source_database === 'pdb' ? 'structure' : 'entry';
    return (
      <>
        <Link
          to={{
            description: {
              main: {
                key,
              },
              [key]: {
                db: entry.source_database,
                accession: entry.accession,
              },
            },
          }}
        >
          {this.renderSwitch(this.state.label, entry)}
        </Link>
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
                  {this.renderSwitch(this.state.label, d)}
                </Link>
                {this.renderResidueLabels(d)}
              </div>
            ))}
        </div>
      </>
    );
  }

  renderResidueLabels(entry) {
    if (!entry.residues) return null;
    const { expandedTrack } = this.state;
    return entry.residues.map((residue) =>
      residue.locations.map((r, i) => (
        <div
          key={`res_${r.accession || i}`}
          className={f('track-accession-child', {
            hide: !expandedTrack[entry.accession],
          })}
        >
          <Link
            to={{
              description: {
                main: { key: 'entry' },
                entry: {
                  db: entry.source_database,
                  accession: entry.accession,
                },
              },
            }}
          >
            {r.accession ||
              r.description.charAt(0).toUpperCase() + r.description.slice(1)}
          </Link>
        </div>
      )),
    );
  }

  handleConservationLoad(_this) {
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
          <div className={f('popper-content')} ref={this._popperContentRef} />
        </div>
        <div id={`${this.state.optionsID}ProtvistaDiv`}>
          <div className={f('protvista')}>
            <protvista-manager
              attributes="length displaystart displayend highlight"
              id="pv-manager"
            >
              <div className={f('track-row')}>
                <div
                  className={f(
                    'aligned-to-track-component',
                    'view-options-wrap',
                    `${this.state.addLabelClass}`,
                  )}
                >
                  {showOptions && (
                    <ProtVistaOptions
                      title={this.props.title}
                      length={length}
                      id={this.state.optionsID}
                      webTracks={this.web_tracks}
                      expandedTrack={this.state.expandedTrack}
                      getParentElem={this.getProtvistaRefs}
                      updateLabel={this.updateLabel}
                      updateTracksCollapseStatus={
                        this.updateTracksCollapseStatus
                      }
                      toggleTooltipStatus={this.toggleTooltipStatus}
                    >
                      {children}
                    </ProtVistaOptions>
                  )}
                </div>
              </div>
              <div ref={this._protvistaRef}>
                <div className={f('track-container')}>
                  <div className={f('track-row')}>
                    <div
                      className={f(
                        'aligned-to-track-component',
                        `${this.state.addLabelClass}`,
                      )}
                    >
                      <protvista-navigation
                        length={length}
                        displaystart="1"
                        displayend={length}
                      />
                    </div>
                  </div>
                  <div className={f('track-row')}>
                    <div
                      className={f(
                        'aligned-to-track-component',
                        `${this.state.addLabelClass}`,
                      )}
                    >
                      <protvista-sequence
                        ref={this._webProteinRef}
                        length={length}
                        displaystart="1"
                        displayend={length}
                        highlight-event="onmouseover"
                        use-ctrl-to-zoom
                      />
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
                      />
                    </div>
                  </div>
                </div>
                <div className={f('tracks-container')}>
                  {data &&
                    data
                      .filter(([_, tracks]) => tracks && tracks.length)
                      .map(([type, entries, component]) => {
                        const LabelComponent = component?.component;
                        return (
                          <div key={type} className={f('track-container')}>
                            <div className={f('track-row')}>
                              <div
                                className={f(
                                  'track-component',
                                  `${this.state.addLabelClass}`,
                                )}
                                style={{ borderBottom: 0 }}
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
                                    {hideCategory[type] ? '▸' : '▾'} {type}
                                  </button>
                                </header>
                              </div>
                              {component && (
                                <div className={f('track-accession')}>
                                  <LabelComponent
                                    {...(component?.attributes || {})}
                                  />
                                </div>
                              )}{' '}
                            </div>
                            <div
                              className={f('track-group', {
                                hideCategory: hideCategory[type],
                              })}
                            >
                              {entries &&
                                entries.map((entry) => (
                                  <div
                                    key={entry.accession}
                                    className={f('track-row')}
                                  >
                                    {entry.type === 'secondary_structure' ||
                                    entry.type === 'sequence_conservation' ? (
                                      <div
                                        className={f(
                                          'track-component',
                                          entry.type === 'secondary_structure'
                                            ? 'secondary-structure'
                                            : 'sequence-conservation',
                                          `${this.state.addLabelClass}`,
                                        )}
                                      >
                                        <protvista-track
                                          length={length}
                                          displaystart="1"
                                          displayend={length}
                                          id={`track_${entry.accession}`}
                                          ref={(e) =>
                                            (this.web_tracks[
                                              entry.accession
                                            ] = e)
                                          }
                                          highlight-event="onmouseover"
                                          use-ctrl-to-zoom
                                        />
                                      </div>
                                    ) : (
                                      <div
                                        className={f(
                                          'track-component',
                                          `${this.state.addLabelClass}`,
                                        )}
                                      >
                                        <protvista-interpro-track
                                          length={length}
                                          displaystart="1"
                                          displayend={length}
                                          id={`track_${entry.accession}`}
                                          ref={(e) =>
                                            (this.web_tracks[
                                              entry.accession
                                            ] = e)
                                          }
                                          shape="roundRectangle"
                                          highlight-event="onmouseover"
                                          use-ctrl-to-zoom
                                          expanded
                                        />
                                      </div>
                                    )}
                                    <div
                                      className={f(
                                        'track-accession',
                                        `${this.state.addLabelClass}`,
                                      )}
                                    >
                                      {this.renderLabels(entry)}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                  {showConservationButton ? (
                    <div className={f('track-container')}>
                      <div className={f('track-row')}>
                        <div
                          className={f(
                            'track-component',
                            this.state.addLabelClass,
                          )}
                        >
                          <header>
                            <button
                              onClick={() => this.handleConservationLoad(this)}
                            >
                              ▸ Match Conservation
                            </button>
                          </header>
                        </div>
                      </div>
                      <div className={f('track-group')}>
                        <div className={f('track-row')}>
                          <div
                            className={f(
                              'track-component',
                              'conservation-placeholder-component',
                              this.state.addLabelClass,
                            )}
                            ref={this._conservationTrackRef}
                          >
                            {this.state.showLoading ? (
                              <div
                                className={f('loading-spinner')}
                                style={{ margin: '10px auto' }}
                              >
                                <div />
                                <div />
                                <div />
                              </div>
                            ) : null}
                          </div>
                          <div
                            className={f(
                              'track-accession',
                              this.state.addLabelClass,
                            )}
                          >
                            <button
                              type="button"
                              className={f(
                                'hollow',
                                'button',
                                'user-select-none',
                              )}
                              onClick={() => this.handleConservationLoad(this)}
                            >
                              Fetch Conservation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </protvista-manager>
          </div>
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
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { goToCustomLocation },
})(ProtVista);
