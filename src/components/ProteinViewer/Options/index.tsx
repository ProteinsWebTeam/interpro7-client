import React, { PropsWithChildren, Children, useState, useEffect } from 'react';
import NightingaleSaverCE from '@nightingale-elements/nightingale-saver';

import loadData from 'higherOrder/loadData/ts';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';
import { changeSettingsRaw } from 'actions/creators';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import { EntryColorMode } from 'utils/entry-color';
import ReactToPrint from 'react-to-print';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { Exporter } from 'components/Table';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
import NightingaleSaver from 'components/Nightingale/Saver';
import LabelBy from './LabelBy';

import cssBinder from 'styles/cssBinder';
import localCSS from './style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

import protvistaGridCSS from '../../ProteinViewer/grid.css';
import protvistaCSS from '../../ProteinViewer/style.css';
import protvistaGridCSSasText from '!!raw-loader!../../ProteinViewer/grid.css';
import protvistaCSSastext from '!!raw-loader!../../ProteinViewer/style.css';
import vfIproCSS from '!!raw-loader!styles/interpro-vf.css';
import fontCSS from '!!raw-loader!styles/fonts.css';
import colorsCSS from '!!raw-loader!styles/colors.css';

const ONE_SEC = 1000;

const css = cssBinder(localCSS, fonts);

type Props = PropsWithChildren<{
  title?: string;
  setPrintingMode: (v: boolean) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  parentReferences: {
    mainRef: React.MutableRefObject<HTMLDivElement | null>;
    componentsRef: React.MutableRefObject<HTMLDivElement | null>;
  };
  colorDomainsBy?: string;
  changeSettingsRaw?: typeof changeSettingsRaw;
  setExpandedAllTracks: (v: boolean) => void;
  tooltipEnabled: boolean;
  setTooltipEnabled: (v: boolean) => void;
}>;

const ProteinViewerOptions = ({
  children,
  setPrintingMode,
  onZoomIn,
  onZoomOut,
  title,
  parentReferences,
  colorDomainsBy,
  changeSettingsRaw,
  setExpandedAllTracks,
  tooltipEnabled,
  setTooltipEnabled,
}: Props) => {
  const [expanded, setExpanded] = useState(true);
  const componentsDivId =
    parentReferences.componentsRef.current?.getAttribute('id');

  useEffect(() => {
    customElements.whenDefined('nightingale-saver').then(() => {
      const saver = document.getElementById(
        `${componentsDivId}Saver`
      ) as NightingaleSaverCE;
      if (saver) {
        saver.preSave = () => {
          const base = parentReferences.componentsRef.current;
          if (base) {
            // Including the styles of interpro-type elements
            base.querySelectorAll('interpro-type').forEach((el: Element) => {
              el.innerHTML = el.shadowRoot?.innerHTML || '';
            });
            const style = document.createElement('style');
            style.setAttribute('id', 'tmp_style');
            // TODO it needs to be changed in an efficient way through webpack
            let str = protvistaGridCSSasText + protvistaCSSastext;
            const cssStyles = [protvistaCSS, protvistaGridCSS];
            cssStyles.forEach((item) => {
              Object.keys(item).forEach((key) => {
                str = str.replace(
                  new RegExp(`\\.${key}([:,[.\\s])`, 'gm'),
                  `.${item[key]}$1`
                );
              });
            });

            str = str + fontCSS + colorsCSS + vfIproCSS;
            style.innerHTML = str;
            base.appendChild(style);
          } else
            console.warn(
              "Couldn't setups the style for the protvista-saver snapshot "
            );
        };
        saver.postSave = () => {
          const base = parentReferences.componentsRef.current;
          const styleElement = document.getElementById('tmp_style');
          if (base && styleElement) {
            base.removeChild(styleElement);
            base.querySelectorAll('interpro-type').forEach((el) => {
              el.innerHTML = '';
            });
          }
        };
      }
    });
  }, [componentsDivId]);

  let ExporterButton = null;
  if (children) {
    ExporterButton = Children.toArray(children).filter(
      (child) => (child as unknown as { type: unknown }).type === Exporter
    )?.[0];
  }

  const changeColor = (evt: React.FormEvent) => {
    if (changeSettingsRaw)
      changeSettingsRaw(
        'ui',
        'colorDomainsBy',
        (evt.target as HTMLInputElement)?.value
      );
  };
  const toggleExpandAll = () => {
    setExpandedAllTracks(!expanded);
    setExpanded(!expanded);
  };
  return (
    <>
      <div className={css('view-options-title')}>
        {title || 'Domains on protein'}{' '}
        <TooltipAndRTDLink rtdPage="protein_viewer.html" />
      </div>
      <div className={css('view-options')}>
        <div className={css('option-fullscreen', 'font-l', 'viewer-options')}>
          <FullScreenButton
            element={parentReferences.mainRef.current}
            tooltip="View the domain viewer in full screen mode"
          />
        </div>
        <div className={css('viewer-options')}>
          <div style={{ marginRight: '0.4rem' }}>
            {onZoomOut && (
              <button
                className={css('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf146;"
                title={'Click to zoom out      Ctrl+Scroll'}
                onClick={onZoomOut}
              />
            )}
            {onZoomIn && (
              <button
                className={css('icon', 'icon-common', 'zoom-button')}
                data-icon="&#xf0fe;"
                title={'Click to zoom in      Ctrl+Scroll'}
                onClick={onZoomIn}
              />
            )}
          </div>
        </div>
        <Tooltip title={'More options to customise the protein viewer'}>
          <DropDownButton label="Options" extraClasses={css('protvista-menu')}>
            <ul className={css('menu-options')}>
              <li>
                Colour By
                <ul className={css('nested-list')}>
                  <li>
                    <label>
                      <input
                        type="radio"
                        onChange={changeColor}
                        value={EntryColorMode.ACCESSION}
                        checked={colorDomainsBy === EntryColorMode.ACCESSION}
                      />{' '}
                      Accession
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        onChange={changeColor}
                        value={EntryColorMode.MEMBER_DB}
                        checked={colorDomainsBy === EntryColorMode.MEMBER_DB}
                      />{' '}
                      Member Database
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="radio"
                        onChange={changeColor}
                        value={EntryColorMode.DOMAIN_RELATIONSHIP}
                        checked={
                          colorDomainsBy === EntryColorMode.DOMAIN_RELATIONSHIP
                        }
                      />{' '}
                      Domain Relationship
                    </label>
                  </li>
                </ul>
              </li>
              <hr />
              <LabelBy />
              <hr />
              <li>
                Snapshot
                <ul className={css('nested-list')}>
                  <li>
                    <NightingaleSaver
                      element-id={componentsDivId}
                      background-color={'#e5e5e5'}
                      id={`${componentsDivId}Saver`}
                      extra-height={12}
                    >
                      <button>
                        <span
                          className={css('icon', 'icon-common')}
                          data-icon="&#xf030;"
                        />{' '}
                        Save as Image
                      </button>
                    </NightingaleSaver>
                  </li>
                  <li>
                    <ReactToPrint
                      trigger={() => (
                        <button
                          className={css('icon', 'icon-common')}
                          data-icon="&#x50;"
                        >
                          {' '}
                          Print
                        </button>
                      )}
                      onBeforeGetContent={() => {
                        setPrintingMode(true);
                        return new Promise<void>((resolve) => {
                          setTimeout(() => resolve(), ONE_SEC);
                          return;
                        });
                      }}
                      content={() => parentReferences.componentsRef.current}
                      onAfterPrint={() => setPrintingMode(false)}
                    />
                  </li>
                </ul>
              </li>
              <hr />
              <li>
                <button
                  onClick={toggleExpandAll}
                  aria-label={`${expanded ? 'Collapse' : 'Expand'} all tracks`}
                >
                  {expanded ? 'Collapse' : 'Expand'} All Tracks
                </button>
              </li>
              <hr />
              <li key={'tooltip'}>
                <label>
                  <input
                    type="checkbox"
                    onChange={() => setTooltipEnabled(!tooltipEnabled)}
                    checked={tooltipEnabled}
                  />{' '}
                  Tooltip {tooltipEnabled ? 'Active' : 'Inactive'}
                </label>
              </li>
            </ul>
          </DropDownButton>
        </Tooltip>

        {ExporterButton ? (
          <div className={css('exporter')}>{ExporterButton}</div>
        ) : null}
      </div>
    </>
  );
};

const mapStateToProps = createSelector(
  (state: GlobalState) => state.settings.ui,
  (ui: Record<string, unknown>) => ({
    colorDomainsBy:
      (ui.colorDomainsBy as string) || EntryColorMode.DOMAIN_RELATIONSHIP,
  })
);

export default loadData({
  getUrl: getUrlForMeta,
  propNamespace: 'DB',
  mapStateToProps,
  mapDispatchToProps: { changeSettingsRaw },
})(ProteinViewerOptions);
