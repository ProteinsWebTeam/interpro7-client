// @flow
import React, { Component, Children } from 'react';
import T from 'prop-types';

import loadWebComponent from 'utils/load-web-component';
import ProtvistaSaver from 'protvista-saver';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { EntryColorMode } from 'utils/entry-color';
import ReactToPrint from 'react-to-print';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { Exporter } from 'components/Table';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { changeSettingsRaw } from 'actions/creators';
import { createSelector } from 'reselect';

import { foundationPartial } from 'styles/foundation';
import fonts from 'EBI-Icon-fonts/fonts.css';

import foundationCSS from 'foundation-sites/dist/css/foundation-float.css';
import foundationCSSasText from '!!raw-loader!foundation-sites/dist/css/foundation-float.css';
import ipro from 'styles/interpro-new.css';
import iproCSSasText from '!!raw-loader!styles/interpro-new.css';
import fontCSS from '!!raw-loader!styles/fonts.css';
import colorsCSS from '!!raw-loader!styles/colors.css';
import ebiGlobalCSS from '!!raw-loader!ebi-framework/css/ebi-global.css';
import globalCSS from '!!raw-loader!styles/global.css';
import protvistaCSS from '../style.css';
import protvistaCSSasText from '!!raw-loader!../style.css';

const f = foundationPartial(ipro, protvistaCSS, fonts);
const ONE_SEC = 1000;

/*:: type Props = {
  title: string,
  length: number,
  id: string,
  webTracks: Object,
  expandedTrack: Object,
  colorDomainsBy: string,
  changeSettingsRaw: function,
  updateLabel: function,
  updateTracksCollapseStatus: function,
  toggleTooltipStatus: function,
  getParentElem: function,
  children: any,
}; */

/*:: type State = {
  collapsed: boolean,
  label: Object,
  enableTooltip: boolean,
}; */

class ProtVistaOptions extends Component /*:: <Props, State> */ {
  /*::
    parentRefs: {
      _mainRef: { current: null | React$ElementRef<'div'> },
      _protvistaRef: { current: null | React$ElementRef<'div'> },
    };

   */
  static propTypes = {
    title: T.string,
    length: T.number,
    id: T.string,
    webTracks: T.object,
    expandedTrack: T.object,
    colorDomainsBy: T.string,
    changeSettingsRaw: T.func,
    updateLabel: T.func,
    updateTracksCollapseStatus: T.func,
    toggleTooltipStatus: T.func,
    children: T.any,
    getParentElem: T.func,
  };

  constructor(props /*: Props */) {
    super(props);

    this.state = {
      label: {
        accession: true,
        name: false,
      },
      collapsed: false,
      enableTooltip: true,
    };
    this.parentRefs = this.props.getParentElem();
  }

  async componentDidMount() {
    await loadWebComponent(() => ProtvistaSaver).as('protvista-saver');

    const saver /*: null | React$ElementRef<typeof ProtvistaSaver> */ =
      document.querySelector(`#${this.props.id}Saver`);

    if (saver) {
      saver.preSave = () => {
        const base = document.querySelector(`#${this.props.id}ProtvistaDiv`);
        if (base) {
          // Including the styles of interpro-type elements
          base.querySelectorAll('interpro-type').forEach((el) => {
            el.innerHTML = (el.shadowRoot || {}).innerHTML;
          });
          const style = document.createElement('style');
          style.setAttribute('id', 'tmp_style');
          // TODO it needs to be changed in an efficient way through webpack
          let str = protvistaCSSasText + iproCSSasText + foundationCSSasText;
          const cssStyles = [protvistaCSS, ipro, foundationCSS];
          cssStyles.forEach((item) => {
            Object.keys(item).forEach((key) => {
              str = str.replace(
                new RegExp(`\\.${key}([:,[.\\s])`, 'gm'),
                `.${item[key]}$1`,
              );
            });
          });

          str = str + ebiGlobalCSS + globalCSS + fontCSS + colorsCSS;
          console.log(str);
          style.innerHTML = `${str.replace(
            'font-size: 12px;',
            'font-size: 16px;',
          )}`;
          base.appendChild(style);
        } else
          console.warn(
            "Couldn't setups the style for the protvista-saver snapshot ",
          );
      };
      // removes the added style from the DOM
      saver.postSave = () => {
        const base = document.querySelector(`#${this.props.id}ProtvistaDiv`);
        const styleElement = document.getElementById('tmp_style');
        if (base && styleElement) {
          base.removeChild(styleElement);
          base.querySelectorAll('interpro-type').forEach((el) => {
            el.innerHTML = '';
          });
        }
      };
    } else {
      console.warn("Couldn't setups hooks for protvista-saver");
    }
  }

  toggleCollapseAll = () => {
    const { collapsed } = this.state;
    const expandedTrack = {};
    // prettier-ignore
    for (const track /*: React$ElementRef<'div'>*/ of (Object.values(
      this.props.webTracks,
    ) /*: any */)) {
      if (collapsed) track.setAttribute('expanded', 'true');
      else track.removeAttribute('expanded');
    }
    for (const acc of Object.keys(this.props.expandedTrack)) {
      expandedTrack[acc] = collapsed;
    }
    this.setState({ collapsed: !collapsed });
    this.props.updateTracksCollapseStatus(expandedTrack);
  };

  changeColor = ({ target: { value: colorMode } }) => {
    this.props.changeSettingsRaw('ui', 'colorDomainsBy', colorMode);
  };

  updateLabel = (evt) => {
    const newLabelState = { ...this.state.label };
    newLabelState[evt.target.value] = !newLabelState[evt.target.value];
    if (!newLabelState.accession && !newLabelState.name) {
      newLabelState.accession = true;
    }
    this.setState({
      label: newLabelState,
    });
    this.props.updateLabel(newLabelState);
  };

  toggleTooltipStatus = () => {
    this.setState({
      enableTooltip: !this.state.enableTooltip,
    });
    this.props.toggleTooltipStatus(!this.state.enableTooltip);
  };
  render() {
    const { length, children } = this.props;
    const { collapsed } = this.state;

    const title = this.props.title || 'Domains on protein';

    let ExporterButton = null;
    if (children) {
      ExporterButton = Children.toArray(children).filter(
        (child) => child.type === Exporter,
      )?.[0];
    }

    return (
      <>
        <div className={f('view-options-title')}>
          {title} <TooltipAndRTDLink rtdPage="protein_viewer.html" />
        </div>
        <div className={f('view-options')}>
          <div className={f('option-fullscreen', 'font-l', 'viewer-options')}>
            <FullScreenButton
              element={this.parentRefs._mainRef.current}
              tooltip="View the domain viewer in full screen mode"
            />
          </div>

          <div className={f('viewer-options')}>
            <protvista-zoom-tool
              length={length}
              displaystart="1"
              displayend={length}
            >
              <span
                slot="zoom-out"
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf146;"
                title={'Click to zoom out      Ctrl+Scroll'}
              />
              <span
                slot="zoom-in"
                className={f('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf0fe;"
                title={'Click to zoom in      Ctrl+Scroll'}
                style={{ marginRight: '0.4rem' }}
              />
            </protvista-zoom-tool>
          </div>
          <Tooltip title={'More options to customise the protein viewer'}>
            <DropDownButton label="Options" extraClasses={f('protvista-menu')}>
              <ul className={f('menu-options')}>
                <li>
                  Colour By
                  <ul className={f('nested-list')}>
                    <li>
                      <label>
                        <input
                          type="radio"
                          onChange={this.changeColor}
                          value={EntryColorMode.ACCESSION}
                          checked={
                            this.props.colorDomainsBy ===
                            EntryColorMode.ACCESSION
                          }
                        />{' '}
                        Accession
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="radio"
                          onChange={this.changeColor}
                          value={EntryColorMode.MEMBER_DB}
                          checked={
                            this.props.colorDomainsBy ===
                            EntryColorMode.MEMBER_DB
                          }
                        />{' '}
                        Member Database
                      </label>
                    </li>
                    <li>
                      <label>
                        <input
                          type="radio"
                          onChange={this.changeColor}
                          value={EntryColorMode.DOMAIN_RELATIONSHIP}
                          checked={
                            this.props.colorDomainsBy ===
                            EntryColorMode.DOMAIN_RELATIONSHIP
                          }
                        />{' '}
                        Domain Relationship
                      </label>
                    </li>
                  </ul>
                </li>
                <hr />
                <li>
                  Label by
                  <ul className={f('nested-list')}>
                    <li key={'accession'}>
                      <label>
                        <input
                          type="checkbox"
                          onChange={this.updateLabel}
                          value={'accession'}
                          checked={this.state.label.accession}
                        />{' '}
                        Accession
                      </label>
                    </li>
                    <li key={'name'}>
                      <label>
                        <input
                          type="checkbox"
                          onChange={this.updateLabel}
                          value={'name'}
                          checked={this.state.label.name}
                        />{' '}
                        Name
                      </label>
                    </li>
                  </ul>
                </li>
                <hr />
                <li>
                  Snapshot
                  <ul className={f('nested-list')}>
                    <li>
                      <protvista-saver
                        element-id={`${this.props.id}ProtvistaDiv`}
                        background-color={'#e5e5e5'}
                        id={`${this.props.id}Saver`}
                      >
                        <button>
                          <span
                            className={f('icon', 'icon-common')}
                            data-icon="&#xf030;"
                          />{' '}
                          Save as Image
                        </button>
                      </protvista-saver>
                    </li>
                    <li>
                      <ReactToPrint
                        trigger={() => (
                          <button
                            className={f('icon', 'icon-common')}
                            data-icon="&#x50;"
                          >
                            {' '}
                            Print
                          </button>
                        )}
                        onBeforeGetContent={() => {
                          // prettier-ignore
                          // $FlowFixMe
                          this.parentRefs._protvistaRef.current.style = 'width: 1000px;';
                          return new Promise((resolve) => {
                            setTimeout(() => resolve(), ONE_SEC);
                          });
                        }}
                        content={() => this.parentRefs._protvistaRef.current}
                        onAfterPrint={() =>
                          // $FlowFixMe
                          (this.parentRefs._protvistaRef.current.style = '')
                        }
                      />
                    </li>
                  </ul>
                </li>
                <hr />
                <li>
                  <button
                    onClick={this.toggleCollapseAll}
                    aria-label={`${
                      collapsed ? 'Expand' : 'Collapse'
                    } all tracks`}
                  >
                    {collapsed ? 'Expand' : 'Collapse'} All Tracks
                  </button>
                </li>
                <hr />
                <li key={'tooltip'}>
                  <label>
                    <input
                      type="checkbox"
                      onChange={this.toggleTooltipStatus}
                      checked={this.state.enableTooltip}
                    />{' '}
                    Tooltip {this.state.enableTooltip ? 'Active' : 'Inactive'}
                  </label>
                </li>
              </ul>
            </DropDownButton>
          </Tooltip>
          {ExporterButton ? (
            <div className={f('exporter')}>{ExporterButton}</div>
          ) : null}
        </div>
      </>
    );
  }
}

const mapStateToProps = createSelector(
  (state) => state.settings.ui,
  (ui) => ({
    colorDomainsBy: ui.colorDomainsBy || EntryColorMode.DOMAIN_RELATIONSHIP,
  }),
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { changeSettingsRaw },
})(ProtVistaOptions);
