import React, { PureComponent } from 'react';
import T from 'prop-types';

import { format } from 'url';
import { createSelector } from 'reselect';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';
import AnimatedEntry from 'components/AnimatedEntry';

import { GoList } from 'staticData/home';
import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from './style.css';

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
      <div className={f('go-list')}>
        <AnimatedEntry className={f('row')} element="div">
          {GoList.map(e => (
            <div
              className={f('column', 'medium-3', 'large-3', 'text-center')}
              key={e.title}
            >
              <span
                style={{ color: e.color }}
                className={f('small', 'bullet-icon')}
              >
                &bull;
              </span>
              <h6>
                {e.title}&nbsp;
                <Tooltip title={`${e.title} (${e.category})`}>
                  <span
                    className={f('small', 'icon', 'icon-generic')}
                    data-icon="i"
                  />
                </Tooltip>
              </h6>
              <div className={f('list-detail')}>
                <Tooltip
                  title={`${(countsE &&
                    e.accession &&
                    countsE[e.accession] &&
                    countsE[e.accession].value) ||
                    'no'} entries matching ${e.title}`}
                >
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: { db: 'InterPro' },
                      },
                      search: { go_term: e.accession },
                    }}
                  >
                    {(countsE &&
                      e.accession &&
                      countsE[e.accession] &&
                      countsE[e.accession].value) ||
                      'no'}{' '}
                    entries
                  </Link>
                </Tooltip>
                <br />
                <Tooltip
                  title={`${(countsP &&
                    e.accession &&
                    countsP[e.accession] &&
                    countsP[e.accession].value) ||
                    'no'} proteins matching ${e.title}`}
                >
                  <Link
                    to={{
                      description: { mainType: 'protein', mainDB: 'uniprot' },
                      search: { go_term: e.accession },
                    }}
                  >
                    {(countsP &&
                      e.accession &&
                      countsP[e.accession] &&
                      countsP[e.accession].value) ||
                      'no'}{' '}
                    proteins
                  </Link>
                </Tooltip>
              </div>
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
