import React, {
  PropsWithChildren,
  Children,
  // useState,
  useEffect,
  useId,
} from 'react';
import { createSelector } from 'reselect';

// import ReactToPrint from 'react-to-print';

import NightingaleSaverCE from '@nightingale-elements/nightingale-saver';

import { connect } from 'react-redux';
import { changeSettingsRaw } from 'actions/creators';
import { EntryColorMode } from 'utils/entry-color';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';
import FullScreenButton from 'components/SimpleCommonComponents/FullScreenButton';
import DropDownButton from 'components/SimpleCommonComponents/DropDownButton';
import { Exporter } from 'components/Table';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';
import NightingaleSaver from 'components/Nightingale/Saver';
import Loading from 'components/SimpleCommonComponents/Loading';
import Button from 'components/SimpleCommonComponents/Button';

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
import MatchType from './MatchType';

// const ONE_SEC = 1000;

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
  loading: boolean;
}>;

const ProteinViewerOptions = ({
  children,
  // setPrintingMode,
  onZoomIn,
  onZoomOut,
  title,
  parentReferences,
  colorDomainsBy,
  changeSettingsRaw,
  // setExpandedAllTracks,
  tooltipEnabled,
  setTooltipEnabled,
  loading = false,
}: Props) => {
  // const [expanded, setExpanded] = useState(true);
  const componentsDivId =
    parentReferences.componentsRef.current?.getAttribute('id');

  const id = useId();
  useEffect(() => {
    customElements.whenDefined('nightingale-saver').then(() => {
      const saver = document.getElementById(
        `${componentsDivId}Saver`,
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
                  `.${item[key]}$1`,
                );
              });
            });

            str = str + fontCSS + colorsCSS + vfIproCSS;
            style.innerHTML = str;
            base.appendChild(style);
          } else
            console.warn(
              "Couldn't set up the style for the nightingale-saver snapshot ",
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
      (child) => (child as unknown as { type: unknown }).type === Exporter,
    )?.[0];
  }

  const changeColor = (evt: React.FormEvent) => {
    if (changeSettingsRaw)
      changeSettingsRaw(
        'ui',
        'colorDomainsBy',
        (evt.target as HTMLInputElement)?.value,
      );
  };
  // Currently disabled
  // const toggleExpandAll = () => {
  //   setExpandedAllTracks(!expanded);
  //   setExpanded(!expanded);
  // };
  const colorOptions = [
    [EntryColorMode.ACCESSION, 'Accession'],
    [EntryColorMode.MEMBER_DB, 'Member Database'],
    [EntryColorMode.DOMAIN_RELATIONSHIP, 'Domain Relationship'],
  ];
  return (
    <>
      <div className={css('view-options-title')}>
        {title || 'Domains on protein'}
        <TooltipAndRTDLink rtdPage="protein_viewer.html" />
      </div>
      {loading && <Loading inline />}
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
              <Button
                type="inline"
                icon="icon-minus-square"
                className={css('zoom-button')}
                title={'Click to zoom out      Ctrl+Scroll'}
                onClick={onZoomOut}
              />
            )}
            {onZoomIn && (
              <Button
                type="inline"
                icon="icon-plus-square"
                className={css('zoom-button')}
                title={'Click to zoom in      Ctrl+Scroll'}
                onClick={onZoomIn}
              />
            )}
          </div>
        </div>

        <DropDownButton
          label={
            <Tooltip title={'Additional customization options'}>
              Options
            </Tooltip>
          }
          extraClasses={css('protvista-menu')}
        >
          <ul className={css('menu-options', 'vf-content')}>
            <section>
              <ul className={css('nested-list')}>
                <header>Colour by</header>
                {colorOptions.map(([mode, label]) => (
                  <li key={mode}>
                    <div
                      className={css('vf-form__item', 'vf-form__item--radio')}
                      style={{
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <input
                        className="vf-form__radio"
                        type="radio"
                        onChange={changeColor}
                        value={mode}
                        checked={colorDomainsBy === mode}
                        id={`${id}-color-${mode}`}
                      />
                      <label
                        className={css('vf-form__label')}
                        htmlFor={`${id}-color-${mode}`}
                      >
                        {label}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <hr />
            <LabelBy />
            <hr />
            {!parentReferences.mainRef.current?.baseURI.includes(
              'InterProScan',
            ) && <MatchType />}
            <li>
              <NightingaleSaver
                element-id={componentsDivId}
                background-color={'#e5e5e5'}
                id={`${componentsDivId}Saver`}
                extra-height={12}
                scale-factor={2}
              >
                <Button
                  type="inline"
                  icon="icon-camera"
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Save as Image
                </Button>
              </NightingaleSaver>{' '}
            </li>
            {/* 
             this is misbehaving, so I'm disabling it until we get a fix for it
            <li>
              <Button
              type="inline"
                onClick={toggleExpandAll}
                aria-label={`${expanded ? 'Collapse' : 'Expand'} all tracks`}
              >
                {expanded ? 'Collapse' : 'Expand'} All Tracks
              </Button>
            </li> */}
            <hr />
            <li key={'tooltip'}>
              <div
                className={css('vf-form__item', 'vf-form__item--checkbox')}
                style={{
                  whiteSpace: 'nowrap',
                }}
              >
                <input
                  className="vf-form__checkbox"
                  type="checkbox"
                  onChange={() => setTooltipEnabled(!tooltipEnabled)}
                  checked={tooltipEnabled}
                  id={`${id}-tooltip`}
                />{' '}
                <label
                  className={css('vf-form__label')}
                  htmlFor={`${id}-tooltip`}
                >
                  Tooltip {tooltipEnabled ? 'Active' : 'Inactive'}
                </label>
              </div>
            </li>
          </ul>
        </DropDownButton>

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
  }),
);

export default connect(mapStateToProps, { changeSettingsRaw })(
  ProteinViewerOptions,
);
