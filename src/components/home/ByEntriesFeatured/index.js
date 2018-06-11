import React, { PureComponent } from 'react';
import T from 'prop-types';
import { createSelector } from 'reselect';
import { format } from 'url';

import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import global from 'styles/global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import local from '../ByLatestEntries/styles.css';

const f = foundationPartial(global, fonts, ipro, theme, local);

class ByEntriesFeatured extends PureComponent {
  static propTypes = {
    data: T.shape({
      payload: T.object,
    }).isRequired,
  };

  render() {
    return (
      <div className={f('feat-entry-list')}>
        <div className={f('row')}>
          <div className={f('columns')}>
            <p>
              This list highlights all entries that have been used on the
              lastest protein focus article:
            </p>

            <div className={f('card-flex-container', 'card-shrink')}>
              <div className={f('list-body')}>
                <div className={f('card-header')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: 'IPR035648',
                        },
                      },
                    }}
                  >
                    <Tooltip title="domain type">
                      <interpro-type
                        dimension="1.5em"
                        type="domain"
                        aria-label="Entry type"
                      />
                    </Tooltip>
                    <Tooltip title="srGAP1/2/3, SH3 domain (IPR035648)">
                      <h6>srGAP1/2/3, SH3 domain</h6>
                    </Tooltip>
                    <span className={f('name-ac')}>IPR035648</span>
                  </Link>
                </div>

                <div className={f('card-footer')}>
                  <div>domain</div>
                  <div>IPR035648</div>
                </div>

                <div className={f('card-options')}>
                  <Tooltip title="Add this entry to your favorites">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="+"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Watch: be notified when this entry is updated">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="4"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Suggest an edit">
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: 'InterPro',
                            accession: 'IPR035648',
                          },
                        },
                      }}
                      className={f('icon', 'icon-functional')}
                      data-icon="5"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className={f('card-flex-container', 'card-shrink')}>
              <div className={f('list-body')}>
                <div className={f('card-header')}>
                  <Link
                    to={{
                      description: {
                        main: { key: 'entry' },
                        entry: {
                          db: 'InterPro',
                          accession: 'IPR030252',
                        },
                      },
                    }}
                  >
                    <Tooltip title="family type">
                      <interpro-type
                        dimension="1.5em"
                        type="family"
                        aria-label="Family type"
                      />
                    </Tooltip>
                    <Tooltip title="SLIT-ROBO Rho GTPase-activating protein 2 (IPR030252)">
                      <h6>SLIT-ROBO Rho GTPase-activating protein 2</h6>
                    </Tooltip>
                    <span className={f('name-ac')}>IPR030252</span>
                  </Link>
                </div>

                <div className={f('card-footer')}>
                  <div>family</div>
                  <div>IPR030252</div>
                </div>

                <div className={f('card-options')}>
                  <Tooltip title="Add this entry to your favorites">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="+"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Watch: be notified when this entry is updated">
                    <Link
                      to={{ description: { other: ['settings'] } }}
                      className={f('icon', 'icon-functional')}
                      data-icon="4"
                      aria-label="settings"
                    />
                  </Tooltip>{' '}
                  <Tooltip title="Suggest an edit">
                    <Link
                      to={{
                        description: {
                          main: { key: 'entry' },
                          entry: {
                            db: 'InterPro',
                            accession: 'IPR030252',
                          },
                        },
                      }}
                      className={f('icon', 'icon-functional')}
                      data-icon="5"
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToUrl = createSelector(
  state => state.settings.api,
  ({ protocol, hostname, port, root }) =>
    format({
      protocol,
      hostname,
      port,
      pathname: `${root}/entry`,
    }),
);

export default loadData(mapStateToUrl)(ByEntriesFeatured);
