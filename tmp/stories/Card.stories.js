import React from 'react';

import { foundationPartial } from '../src/styles/foundation';
import interpro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import pageStyle from 'pages/style.css';
const f = foundationPartial(interpro, ebiGlobalStyles, pageStyle);

export default {
  title: 'Basic UI/Card',
};

const basicData = [
  { title: 'Alpha', content: 'Greek alphabet', footer: 'Symbol' },
  { title: 'Beta', content: 'Greek alphabet', footer: 'Symbol', more: true },
  { title: 'Gamma', content: 'Greek alphabet', footer: 'Symbol' },
  { title: 'Delta', content: 'Greek alphabet', footer: 'Symbol' },
];
export const Card = () => (
  <div className={f('row')}>
    <div className={f('flex-column')}>
      {basicData.map((d) => {
        return (
          <div className={f('flex-card')} key={d.title}>
            <div className={f('card-header')}>Letter</div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>{d.title}</h4>
              </div>
              <div className={f('card-info')}>General info</div>
              <div className={f('card-description')}>{d.content}</div>
            </div>
            {d.more ? (
              <div className={f('card-more')}>More info</div>
            ) : (
              <div className={f('card-footer')}>{d.footer}</div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);
