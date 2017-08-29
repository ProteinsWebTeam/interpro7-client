// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import { GoList } from 'staticData/home';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

class ByMemberDatabase extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div className={f('md-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {GoList.map(e => (
            <div
              className={f('columns', 'medium-3', 'large-3', 'text-center')}
              key={e.title}
            >
              <Link
                newTo={{
                  description: { mainType: 'search', mainDB: 'text' },
                  search: { search: e.accession },
                }}
                title={e.description}
                data-tooltip
              >
                <span
                  style={{ color: e.color }}
                  className={f('small', 'bullet-icon')}
                  data-tooltip
                  title={e.category}
                >
                  &bull;
                </span>
                <h6>
                  {e.title}&nbsp;
                  <span
                    className={f('small', 'icon', 'icon-generic')}
                    data-icon="i"
                    data-tooltip
                    title={e.description}
                  />
                </h6>
                <p>
                  {e.counterD} entries <br />
                  <small>({e.counterS} proteins)</small>
                </p>
              </Link>
            </div>
          ))}
        </AnimatedEntry>
        <Link href="interpro7/browse/Goterms" className={f('button')}>
          View all Go terms
        </Link>
      </div>
    );
  }
}

export default ByMemberDatabase;
