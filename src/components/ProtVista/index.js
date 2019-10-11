import React, { Component } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { isEqual } from 'lodash-es';

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
import ProtvistaSaver from 'protvista-saver';

import { getTrackColor, EntryColorMode } from 'utils/entry-color';
import { NOT_MEMBER_DBS } from 'menuConfig';

import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import fonts from 'EBI-Icon-fonts/fonts.css';
import PopperJS from 'popper.js';

import loadWebComponent from 'utils/load-web-component';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from '../../higherOrder/loadData/defaults';
import { changeSettingsRaw } from 'actions/creators';

import { foundationPartial } from 'styles/foundation';

import foundationCSS from 'foundation-sites/dist/css/foundation-float.css';
import foundationCSSasText from '!!raw-loader!foundation-sites/dist/css/foundation-float.css';
import ipro from 'styles/interpro-new.css';
import iproCSSasText from '!!raw-loader!styles/interpro-new.css';
import fontCSS from '!!raw-loader!styles/fonts.css';
import colorsCSS from '!!raw-loader!styles/colors.css';
import localCSS from './style.css';
import localCSSasText from '!!raw-loader!./style.css';
import ebiGlobalCSS from '!!raw-loader!ebi-framework/css/ebi-global.css';
import globalCSS from '!!raw-loader!styles/global.css';

import popupsvg from 'images/icons/ico-tooltip.svg';

const f = foundationPartial(ipro, localCSS, fonts);

const webComponents = [];

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
      loadWebComponent(() => ProtvistaSaver).as('protvista-saver'),
    );

    webComponents.push(
      loadWebComponent(() =>
        import('interpro-components').then(m => m.InterproType),
      ).as('interpro-type'),
    );
  }
  return Promise.all(webComponents);
};

const removeAllChildrenFromNode = node => {
  if (node.lastChild) {
    node.removeChild(node.lastChild);
    removeAllChildrenFromNode(node);
  }
};

const COLOR_SCALE_WIDTH = 80;
const COLOR_SCALE_HEIGHT = 20;
const getColorScaleHTML = (
  { domain, range },
  width = COLOR_SCALE_WIDTH,
  height = COLOR_SCALE_HEIGHT,
) => `
<div class="color-scale">
  <span>${domain[0]}</span>
  <svg height="${height}" width="${width}">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${range[0]};" />
      <stop offset="100%" style="stop-color:${range[1]};" />
    </linearGradient>
  </defs>
    <rect width="100%" height="${height}" fill="url(#grad1)"/>
  </svg>
  <span>${domain[1]}</span>
</div>`;

/*:: type Props = {
  protein: Object,
  data: Array<Object>,
  dataDB: Object,
  colorDomainsBy: string,
  changeSettingsRaw: function,
  fetchConservation: function,
  title: string,
  fixedHighlight: string,
  id: string,
  handleToggle: function,
}; */

/*:: type State = {
  entryHovered: any,
  hideCategory: Object,
  expandedTrack: Object,
  collapsed: boolean,
  label: string,
  addLabelClass: string,
  showConservationButton: boolean,
}; */
class ProtVista extends Component /*:: <Props, State> */ {
  static propTypes = {
    protein: T.object,
    data: T.array,
    dataDB: T.object,
    colorDomainsBy: T.string,
    changeSettingsRaw: T.func,
    title: T.string,
    fixedHighlight: T.string,
    id: T.string,
    handleToggle: T.func,
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
      label: 'accession',
      addLabelClass: '',
      enableTooltip: true,
      addTooltipClass: '',
    };

    this._mainRef = React.createRef();
    this._popperRef = React.createRef();
    this._popperContentRef = React.createRef();
    this._webProteinRef = React.createRef();
    this._hydroRef = React.createRef();
    this._showConservationRef = React.createRef();
    this._isPopperTop = true;
  }

  async componentDidMount() {
    await loadProtVistaWebComponents();
    const { data, protein } = this.props;
    this._webProteinRef.current.data = protein;
    this._hydroRef.current.data = protein;
    this.updateTracksWithData(data);
    this._hydroRef.current.addEventListener('change', ({ detail }) => {
      if (detail.feature) {
        this._popperRef.current.classList.remove(f('hide'));
        removeAllChildrenFromNode(this._popperContentRef.current);
        const range = document.createRange();
        range.selectNode(document.getElementsByTagName('div').item(0));
        const element = range.createContextualFragment(`
        <section>
          <h6>Residue ${detail.feature.start}: ${detail.feature.aa}</h6>
          <div>
            <b>Hydrophobicity:</b> ${detail.feature.value}<br/>
            <b>Scale:</b> ${getColorScaleHTML(
              this._hydroRef.current.colorScale,
            )}<br/>
          </div>
        </section>
        `);
        this._popperContentRef.current.appendChild(element);
        this._isPopperTop = !this._isPopperTop;
        const rect = this._hydroRef.current.querySelector(
          `.base_bg[data-pos="${detail.feature.start}"]`,
        );
        this.popper = new PopperJS(rect, this._popperRef.current, {
          placement: this._isPopperTop ? 'top' : 'bottom',
          applyStyle: { enabled: false },
        });
      } else if (this.popper) {
        this.popper.destroy();
        this._popperRef.current.classList.add(f('hide'));
      }
    });
    const saver = document.querySelector(`#${this.props.id}Saver`);

    saver.preSave = () => {
      const base = document.querySelector(`#${this.props.id}ProtvistaDiv`);
      // Including the styles of interpro-type elements
      base.querySelectorAll('interpro-type').forEach(el => {
        el.innerHTML = el.shadowRoot.innerHTML;
      });
      const style = document.createElement('style');
      style.setAttribute('id', 'tmp_style');
      // TODO it needs to be changed in an efficient way through webpack
      let str = localCSSasText + iproCSSasText + foundationCSSasText;
      const cssStyles = [localCSS, ipro, foundationCSS];
      cssStyles.forEach(item => {
        Object.keys(item).forEach(key => {
          str = str.replace(
            new RegExp(`\\.${key}([:,[.\\s])`, 'gm'),
            `.${item[key]}$1`,
          );
        });
      });

      str = str + ebiGlobalCSS + globalCSS + fontCSS + colorsCSS;
      style.innerHTML = `${str}`;
      base.appendChild(style);
    };
    // removes the added style from the DOM
    saver.postSave = () => {
      const base = document.querySelector(`#${this.props.id}ProtvistaDiv`);
      base.removeChild(document.getElementById('tmp_style'));
      base.querySelectorAll('interpro-type').forEach(el => {
        el.innerHTML = '';
      });
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState !== this.state || !isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.data, this.props.data)) {
      this.updateTracksWithData(this.props.data);
      this._webProteinRef.current.data = this.props.protein;
      this._hydroRef.current.data = this.props.protein;
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
        const tmp = (d.entry_protein_locations || d.locations).map(loc => ({
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
          confidence: d.confidence,
        }));
        const children = d.children
          ? d.children.map(child => ({
              accession: child.accession,
              chain: d.chain,
              name: child.name,
              residues:
                child.residues && JSON.parse(JSON.stringify(child.residues)),
              source_database: child.source_database,
              entry_type: child.entry_type,
              type: child.type,
              locations: (child.entry_protein_locations || child.locations).map(
                loc => ({
                  ...loc,
                  fragments: loc.fragments.map(f => ({
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
            ({ detail }) => {
              if (detail) {
                switch (detail.eventtype) {
                  case 'click':
                    this.handleCollapseLabels(detail.feature.accession);
                    break;
                  case 'mouseout':
                    removeAllChildrenFromNode(this._popperContentRef.current);
                    this.popper.destroy();
                    this._popperRef.current.classList.add(f('hide'));
                    break;
                  case 'mouseover':
                    if (this.state.enableTooltip) {
                      this._popperRef.current.classList.remove(f('hide'));
                      removeAllChildrenFromNode(this._popperContentRef.current);
                      this._popperContentRef.current.appendChild(
                        this.getElementFromDetail(detail),
                      );
                      this._isPopperTop = !this._isPopperTop;
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
            },
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

  _getMobiDBLiteType = entry => {
    let type = null;
    if (entry.locations && entry.locations.length > 0) {
      if (entry.locations[0].seq_feature) {
        type = entry.locations[0].seq_feature;
      }
    }
    return type;
  };

  _getSecondaryStructureType = entry => {
    let type = null;
    if (entry.locations && entry.locations.length > 0) {
      if (entry.locations[0].fragments && entry.locations[0].fragments[0]) {
        const shape = entry.locations[0].fragments[0].shape;
        type = shape.charAt(0).toUpperCase() + shape.slice(1);
      }
    }
    return type;
  };

  getHTMLStringForEntry(entry, sourceDatabase, highlightChild) {
    let type = entry.entry_type || entry.type || '';
    if (sourceDatabase === 'MobiDB Lite') {
      // Handle MobiDB Lite entries
      // TODO change how MobiDBLt entries are stored in MySQL
      type = this._getMobiDBLiteType(entry);
    }

    if (type === 'secondary_structure') {
      type = `Secondary Structure: ${this._getSecondaryStructureType(entry)}`;
    }
    let newLocations = null;
    if (highlightChild) {
      newLocations = highlightChild.split(',').map(loc => {
        const [start, end] = loc.split(':');
        return { fragments: [{ start, end }] };
      });
    }

    return this.getHTMLString(
      {
        ...entry,
        locations: newLocations || entry.locations,
        type,
        sourceDatabase,
      },
      entry.source_database === 'interpro',
    );
  }

  getHTMLStringForResidue(entry, sourceDatabase) {
    const residue = entry.currentResidue;
    return this.getHTMLString(
      {
        ...entry,
        ...residue,
        residue: residue.residue || residue.residues,
        sourceDatabase,
        description: residue.description || residue.location.description,
      },
      false,
      true,
    );
  }

  // eslint-disable-next-line complexity
  getHTMLString(
    {
      accession,
      sourceDatabase,
      description,
      name,
      entry,
      locations,
      type,
      start,
      end,
      residue,
      score,
      scale,
      confidence,
    },
    isInterPro = false,
    isResidue = false,
  ) {
    const scaleComponent = scale
      ? getColorScaleHTML({
          domain: [scale[0].min, scale[scale.length - 1].max],
          range: [scale[0].color, scale[scale.length - 1].color],
        })
      : '';
    return `
      <section>   
        <h6>
          ${accession}
          ${description ? `<br/>[${description}]` : ''} 
         </h6>
          
        ${name && !isResidue ? `<h4>${name}</h4>` : ''}
        
        <!-- use class as Protvista is not react-->       
        <div class="${f('pop-wrapper')}" >
          <div>${
            isInterPro
              ? `<interpro-type
                      type="${type.replace('_', ' ')}"
                      dimension="1.4em"
                      aria-label="Entry type"
                    />`
              : ''
          } 
          </div>
          <div>
            ${isResidue ? 'Residue in ' : ''}
            ${sourceDatabase} ${type ? type.replace('_', ' ') : ''}
          </div>
        </div>
        <p>
          <small>          
            ${entry ? `(${entry})` : ''}
          </small>
        </p>
        <ul>
          ${
            isResidue
              ? `
            <li>Position: ${start}</li>
            <li>Residue: ${residue}</li>
            `
              : ''
          } 
          ${
            !isResidue && locations
              ? locations
                  .map(({ fragments, model_acc: model }) =>
                    `
            <li> 
            <!--location:-->
              ${model && model !== accession ? `Model: ${model}` : ''}
              <ul>
                ${
                  fragments
                    ? fragments
                        .map(({ start, end }) =>
                          `
                  <li>${start} - ${end}</li>
                `.trim(),
                        )
                        .join('')
                    : ''
                }
              </ul>
            </li>
          `.trim(),
                  )
                  .join('')
              : ''
          }
        </ul>
        <p>
          ${start && end ? `${start} - ${end}` : ''}
        </p>
        ${score ? `<p>Conservation : ${score}</p>` : ''}
        ${confidence ? `<p>Confidence: ${confidence}</p>` : ''}
        ${scaleComponent ? `<p>Scale: ${scaleComponent}</p>` : ''}
        </section>
`.trim();
  }

  getConservationScore(highlight, match, scale) {
    const start = parseInt(highlight.split(':')[0], 10);
    const matchFragment = match.locations[0].fragments.find(fragment => {
      return start >= fragment.start && start <= fragment.end;
    });
    const scaleEntry = scale.find(element => {
      return matchFragment.color === element.color;
    });
    return `${scaleEntry.min} - ${scaleEntry.max}`;
  }

  getElementFromDetail(detail) {
    let databases = {};
    const { dataDB } = this.props;
    if (!dataDB.loading && dataDB.payload) {
      databases = dataDB.payload.databases;
    }

    let tagString;
    if (detail.feature.type === 'sequence_conservation') {
      const match = detail.feature;
      const sourceDatabase =
        match.accession in databases
          ? databases[match.accession].name
          : match.accession;
      const startLocation = match.locations[0];
      const endLocation = match.locations[match.locations.length - 1];
      const start = startLocation.fragments[0].start;
      const end = endLocation.fragments[endLocation.fragments.length - 1].end;
      const matchConservation = this.props.data.find(element => {
        if (element[0] && element[0].toLowerCase() === 'match conservation') {
          return element[1].find(
            e => (e.type && e.type.toLowerCase()) === 'sequence_conservation',
          );
        }
        return false;
      });

      const scale = matchConservation[1].find(element => {
        return (
          element.type && element.type.toLowerCase() === 'sequence_conservation'
        );
      }).range;
      const score = this.getConservationScore(detail.highlight, match, scale);
      const accession = startLocation.match;
      tagString = this.getHTMLString({
        accession,
        sourceDatabase,
        start,
        end,
        score,
        scale,
      });
    } else {
      const entry = detail.feature;
      const sourceDatabase = this._getSourceDatabaseDisplayName(
        entry,
        databases,
      );

      const isResidue =
        detail.target && detail.target.classList.contains('residue');
      const highlightChild =
        detail.target &&
        detail.target.classList.contains('child-fragment') &&
        detail.highlight;
      tagString = isResidue
        ? this.getHTMLStringForResidue(entry, sourceDatabase)
        : this.getHTMLStringForEntry(entry, sourceDatabase, highlightChild);
    }
    const range = document.createRange();
    range.selectNode(document.getElementsByTagName('div').item(0));
    return range.createContextualFragment(tagString);
  }

  setObjectValueInState = (objectName, type, value) =>
    this.setState(({ [objectName]: obj }) => ({
      [objectName]: { ...obj, [type]: value },
    }));

  toggleCollapseAll = () => {
    const { collapsed } = this.state;
    const expandedTrack = {};
    for (const track of Object.values(this.web_tracks)) {
      if (collapsed) track.setAttribute('expanded', true);
      else track.removeAttribute('expanded');
    }
    for (const acc of Object.keys(this.state.expandedTrack)) {
      expandedTrack[acc] = collapsed;
    }
    this.setState({ collapsed: !collapsed, expandedTrack });
  };

  handleCollapseLabels = accession => {
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

  changeColor = ({ target: { value: colorMode } }) => {
    for (const track of Object.values(this.web_tracks)) {
      for (const d of [...track._data, ...(track._contributors || [])]) {
        d.color = getTrackColor(d, colorMode);
      }
      track.refresh();
    }
    this.props.changeSettingsRaw('ui', 'colorDomainsBy', colorMode);
  };

  toggleLabel = () => {
    if (this.state.label === 'accession')
      this.setState({ label: 'name', addLabelClass: 'label-by-name' });
    else this.setState({ label: 'accession', addLabelClass: '' });
    if (this.props.handleToggle)
      this.props.handleToggle(this.state.label === 'accession');
  };

  togglePopper = () => {
    const tooltipStatus = this.state.enableTooltip;
    if (tooltipStatus)
      this.setState({
        enableTooltip: !tooltipStatus,
        addTooltipClass: 'tooltip-disable',
      });
    else this.setState({ enableTooltip: !tooltipStatus, addTooltipClass: '' });
  };

  renderLabels(entry) {
    const { expandedTrack } = this.state;
    const { dataDB, id } = this.props;
    let databases = {};
    if (dataDB.payload) {
      databases = dataDB.payload.databases;
    }
    // const databases = dataDB.payload.databases;
    if (entry.source_database === 'mobidblt')
      return (
        <Link href={`http://mobidb.bio.unipd.it/${id}`}>{entry.accession}</Link>
      );
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
    return (
      <>
        <Link
          to={{
            description: {
              main: {
                key: entry.source_database === 'pdb' ? 'structure' : 'entry',
              },
              [entry.source_database === 'pdb' ? 'structure' : 'entry']: {
                db: entry.source_database,
                accession: entry.accession,
              },
            },
          }}
        >
          {this.state.label === 'name'
            ? (
                <>
                  {entry.type ? (
                    <interpro-type
                      type={entry.type.replace('_', ' ')}
                      dimension="1em"
                    />
                  ) : null}
                  {entry.name}
                </>
              ) || entry.accession
            : entry.accession}
        </Link>
        <div
          className={f({
            hide: !expandedTrack[entry.accession],
          })}
        >
          {this.renderResidueLabels(entry)}
          {entry.children &&
            entry.children.map(d => (
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
                  {this.state.label === 'name'
                    ? `${d.name?.charAt(0).toUpperCase() +
                        d.name?.slice(1)}-${this._getSourceDatabaseDisplayName(
                        d,
                        databases,
                      )}` || d.accession
                    : d.accession}
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
    return entry.residues.map(residue =>
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

  renderOptions() {
    const { collapsed } = this.state;
    const title = this.props.title || 'Domains on protein';

    return (
      <div
        className={f(
          'aligned-to-track-component',
          'view-options-wrap',
          `${this.state.addLabelClass}`,
        )}
      >
        <div className={f('view-options-title')}>{title}</div>
        <div className={f('view-options')}>
          <div className={f('option-color', 'margin-right-medium')}>
            Colour By:{' '}
            <select
              className={f('select-inline')}
              value={this.props.colorDomainsBy}
              onChange={this.changeColor}
              onBlur={this.changeColor}
            >
              <option value={EntryColorMode.ACCESSION}>Accession</option>
              <option value={EntryColorMode.MEMBER_DB}>Member Database</option>
              <option value={EntryColorMode.DOMAIN_RELATIONSHIP}>
                Domain Relationship
              </option>
            </select>
          </div>
          <div className={f('option-collapse')}>
            <Tooltip title={`${collapsed ? 'Expand' : 'Collapse'} all tracks`}>
              <button
                onClick={this.toggleCollapseAll}
                aria-label={`${collapsed ? 'Expand' : 'Collapse'} all tracks`}
              >
                {collapsed ? 'Expand' : 'Collapse'} All
              </button>
            </Tooltip>
          </div>
          <div
            className={f(
              'option-fullscreen',
              'font-l',
              'margin-right-large',
              `${this.state.addTooltipClass}`,
            )}
          >
            <Tooltip title={'Enable/Disable Tooltip'}>
              <button onClick={this.togglePopper}>
                <img src={popupsvg} width="20px" alt="Enable/Disable Tooltip" />
              </button>
            </Tooltip>
          </div>
          <div
            className={f('option-fullscreen', 'font-l', 'margin-right-large')}
          >
            <FullScreenButton
              element={this._mainRef.current}
              tooltip="View the domain viewer in full screen mode"
            />
          </div>
          <div
            className={f('option-fullscreen', 'font-l', 'margin-right-large')}
          >
            <Tooltip title={'Click to take the snapshot'}>
              <protvista-saver
                element-id={`${this.props.id}ProtvistaDiv`}
                background-color={'#e5e5e5'}
                id={`${this.props.id}Saver`}
              >
                <button
                  className={f('icon', 'icon-common')}
                  data-icon="&#xf030;"
                />
              </protvista-saver>
            </Tooltip>
          </div>
          <div
            className={f('option-fullscreen', 'font-l', 'margin-right-large')}
          >
            <Tooltip title={'Label by Accession/Name'}>
              <button
                className={f('icon', 'icon-common')}
                data-icon="&#xf02b;"
                onClick={this.toggleLabel}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      protein: { length },
      data,
    } = this.props;

    if (!(length && data)) return <Loading />;

    const { hideCategory } = this.state;
    return (
      <div
        ref={this._mainRef}
        className={f('fullscreenable', 'margin-bottom-large')}
      >
        <div className={f('track-row')}>{this.renderOptions()}</div>
        <div ref={this._popperRef} className={f('popper', 'hide')}>
          <div className={f('popper__arrow')} />
          <div className={f('popper-content')} ref={this._popperContentRef} />
        </div>
        <div id={`${this.props.id}ProtvistaDiv`}>
          <div className={f('protvista')}>
            <protvista-manager
              attributes="length displaystart displayend highlight"
              id="pv-manager"
            >
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
                    />
                    <protvista-coloured-sequence
                      ref={this._hydroRef}
                      length={length}
                      displaystart="1"
                      displayend={length}
                      scale="hydrophobicity-scale"
                      height="10px"
                      color_range="#ffdd00:-3,#0000FF:3"
                      highlight-event="onmouseover"
                    />
                  </div>
                </div>
              </div>
              <div className={f('tracks-container')}>
                {data &&
                  data
                    .filter(([_, tracks]) => tracks && tracks.length)
                    .map(([type, entries]) => (
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
                        </div>
                        <div
                          className={f('track-group', {
                            hideCategory: hideCategory[type],
                          })}
                        >
                          {entries &&
                            entries.map(entry => (
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
                                      ref={e =>
                                        (this.web_tracks[entry.accession] = e)
                                      }
                                      highlight-event="onmouseover"
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
                                      ref={e =>
                                        (this.web_tracks[entry.accession] = e)
                                      }
                                      shape="roundRectangle"
                                      highlight-event="onmouseover"
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
                    ))}
              </div>
            </protvista-manager>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createSelector(
  state => state.settings.ui,
  ui => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { changeSettingsRaw },
})(ProtVista);
