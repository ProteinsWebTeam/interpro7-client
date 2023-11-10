import React from "react";

import cssBinder from 'styles/cssBinder';

import entryPopupStyle from 'components/ProteinViewer/Popup/Entry/style.css';
import positionsStyle from 'components/ProteinViewer/Popup/Positions/style.css';

const css = cssBinder(entryPopupStyle, positionsStyle);

type MessageProps = {
  locations: Array<ProtVistaLocation>,
  accession: string,
  name: string;
  dbName: string,
}
export const EntryPopup = ({ locations, accession, dbName, name }: MessageProps) => (
  <section className={css('entry-popup')}>
    <h6>
      {dbName} - {accession}
    </h6>
    <h6>{name}</h6>
    {locations?.length && (
      <ul>
        {locations.map((l, i) => (
          <li key={i}>
            <button className={css('coordinates')}>
              {l.fragments
                .map(({ start, end }) => `${start}-${end}`)
                .join(',')}
            </button>
          </li>
        ))}
      </ul>
    )}
  </section>
);

export default EntryPopup;