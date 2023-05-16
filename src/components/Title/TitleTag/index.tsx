import React from 'react';
import Tooltip from 'components/SimpleCommonComponents/Tooltip';
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
  const isInterPro = db && db.toLowerCase() === 'interpro';
  let rtdLink = '';
  if (isEntry) {
    rtdLink = rtdLinks.entry[isInterPro ? 'interpro' : 'dbs'];
  } else {
    rtdLink = (rtdLinks?.[mainType.toLowerCase() as Endpoint] as string) || '';
  }
  return (
    <div className={css('title-tag')} data-testid="title">
      {db && (
        <div
          className={css('tag', {
            secondary: !isEntry || isInterPro,
            'md-p': isEntry && !isInterPro,
          })}
        >
          {dbLabel} {mainType}
          {
            // Set
            mainType === 'set' && (
              <Tooltip title="A Set is defined as a group of related entries">
                {' '}
                <span
                  className={css('small', 'icon', 'icon-common')}
                  data-icon="&#xf129;"
                />
              </Tooltip>
            )
          }
        </div>
      )}{' '}
      <TooltipAndRTDLink rtdPage={`browse.html#${rtdLink}`} />
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
