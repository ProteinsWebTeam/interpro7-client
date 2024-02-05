import React from 'react';
import TooltipAndRTDLink from 'components/Help/TooltipAndRTDLink';

import cssBinder from 'styles/cssBinder';
import styles from '../style.css';
import fonts from 'EBI-Icon-fonts/fonts.css';

const css = cssBinder(styles, fonts);

const rtdLinks = {
  entry: {
    interpro: 'entry-page',
    dbs: 'member-database-page',
  },
  protein: 'protein-entry-page',
  structure: 'structure-entry-page',
  taxonomy: 'taxonomy-entry-page',
  proteome: 'proteome-entry-page',
  set: 'set-entry-page',
};
type Props = {
  db: string;
  mainType: Endpoint;
  dbLabel: string;
};

const TitleTag = ({ db, mainType, dbLabel }: Props) => {
  const isEntry = mainType === 'entry';
  let isInterPro = false;
  let isPfam = false;
  if (db) {
    if (db.toLowerCase() === 'interpro') isInterPro = true;
    else if (db.toLowerCase() === 'pfam') isPfam = true;
  }
  let rtdLink = '';
  if (isEntry) {
    rtdLink = rtdLinks.entry[isInterPro ? 'interpro' : 'dbs'];
  } else {
    rtdLink = (rtdLinks?.[mainType.toLowerCase() as Endpoint] as string) || '';
  }
  const clanOrSetLabel = `A ${
    isPfam ? 'clan' : 'set'
  } is defined as a group of evolutionary related entries. `;
  return (
    <div className={css('title-tag')} data-testid="title">
      {db && (
        <div
          className={css('vf-badge', 'vf-badge--primary', {
            secondary: !isEntry || isInterPro,
            'md-p': isEntry && !isInterPro,
          })}
        >
          {dbLabel} {mainType === 'set' && isPfam ? 'clan' : mainType}
        </div>
      )}{' '}
      <TooltipAndRTDLink
        rtdPage={`browse.html#${rtdLink}`}
        label={`${
          mainType === 'set' ? clanOrSetLabel : ''
        }Visit our documentation for more information.`}
      />
    </div>
  );
};

export const FragmentTag = ({ isFragment }: { isFragment: boolean }) => {
  if (!isFragment) return null;
  return (
    <div className={css('fragment-tag')} data-testid="title">
      <div className={css('tag')}>Fragment</div>
    </div>
  );
};

export default TitleTag;
