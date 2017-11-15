// @flow
import React, { PureComponent } from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import { GoList } from 'staticData/home';
import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../styles.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, local);

class ByGoTerm extends PureComponent /*:: <{}> */ {
  static propTypes = {
    data: T.object,
    dataProtein: T.object,
  };
  render() {
    const countsE = this.props.data.payload;
    const countsP = this.props.dataProtein.payload;
    return (
      <div className={f('md-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {GoList.map(e => (
            <div
              className={f('columns', 'medium-3', 'large-3', 'text-center')}
              key={e.title}
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
                <Link
                  newTo={{
                    description: { mainType: 'entry', mainDB: 'InterPro' },
                    search: { go_term: e.accession },
                  }}
                  title={e.description}
                  data-tooltip
                >
                  {(countsE && e.accession && countsE[e.accession]) || '-'}{' '}
                  entries
                </Link>
                <br />
                <Link
                  newTo={{
                    description: { mainType: 'protein', mainDB: 'uniprot' },
                    search: { go_term: e.accession },
                  }}
                  title={e.description}
                  data-tooltip
                >
                  {(countsP && e.accession && countsP[e.accession]) || '-'}{' '}
                  proteins
                </Link>
              </p>
            </div>
          ))}
        </AnimatedEntry>
      </div>
    );
  }
}
const mapStateToUrl = endpoint =>
  createSelector(
    state => state.settings.api,
    ({ protocol, hostname, port, root }) =>
      format({
        protocol,
        hostname,
        port,
        pathname: `${root}/${endpoint}`,
        query: { group_by: 'go_terms' },
      }),
  );

export default loadData({
  getUrl: mapStateToUrl('protein'),
  propNamespace: 'Protein',
})(loadData(mapStateToUrl('entry'))(ByGoTerm));
