import React, { Fragment } from 'react';

import IdaEntry from '../IdaEntry';

import cssBinder from 'styles/cssBinder';
import local from '../style.css';

const css = cssBinder(local);

type Props = {
  entryList: Array<string>;
  ignoreList: Array<string>;
  isOrdered: boolean;
  removeEntryHandler: (n: number) => void;
  changeEntryHandler: (n: number, name: string) => void;
  changeIgnoreHandler: (n: number, name: string) => void;
  removeIgnoreHandler: (n: number) => void;
  mergeResults: (
    data: RequestedData<PayloadList<{ metadata: EntryMetadata }>>,
  ) => void;
  options: {};
  markerBeforeEntry?: string | null;
  markerAfterEntry?: string | null;
  handleMoveMarker: (n: number) => (n: number | null) => void;
  handleMoveEntry: (n: number) => (n: number) => void;
};
const PanelIDA = ({
  entryList,
  ignoreList,
  isOrdered,
  removeEntryHandler,
  changeEntryHandler,
  changeIgnoreHandler,
  removeIgnoreHandler,
  mergeResults,
  options,
  markerBeforeEntry = null,
  markerAfterEntry = null,
  handleMoveMarker,
  handleMoveEntry,
}: Props) => (
  <div className={css('panels')}>
    <div className={css('ida-panel')}>
      <header>Architectures must include</header>
      <div>
        <ul className={css('ida-list', { ordered: isOrdered })}>
          {entryList &&
            entryList.map((e, i) => (
              <Fragment key={i}>
                {markerBeforeEntry === e && <div>|</div>}
                <li>
                  <IdaEntry
                    // position={i}
                    entry={e}
                    // active={true}
                    draggable={isOrdered}
                    handleMoveMarker={handleMoveMarker(i)}
                    handleMoveEntry={handleMoveEntry(i)}
                    removeEntryHandler={() => removeEntryHandler(i)}
                    changeEntryHandler={(name) => changeEntryHandler(i, name)}
                    mergeResults={mergeResults}
                    options={options}
                  />
                </li>
                {markerAfterEntry === e && <div>|</div>}
              </Fragment>
            ))}
        </ul>
      </div>
    </div>
    <div className={css('ida-ignore')}>
      <header>
        Architectures must <u>not</u> include
      </header>
      <ul className={css('ida-list', 'ignore')}>
        {ignoreList &&
          ignoreList.map((e, i) => (
            <li key={i}>
              <IdaEntry
                // position={i}
                entry={e}
                // active={true}
                removeEntryHandler={() => removeIgnoreHandler(i)}
                changeEntryHandler={(name) => changeIgnoreHandler(i, name)}
                mergeResults={mergeResults}
                options={options}
              />
            </li>
          ))}
      </ul>
    </div>
  </div>
);

export default PanelIDA;
