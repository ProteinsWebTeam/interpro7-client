// @flow
import React, { PureComponent } from 'react';

import config from 'config';
import Link from 'components/generic/Link';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import local from './style.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, local);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});
export default class Documentation extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <SchemaOrgData
          data={{
            name: 'InterPro Documentation Page',
            description:
              'Includes links to the documentations for the different parts of our service',
          }}
          processData={schemaProcessDataPageSection}
        />
        <div className={f('row')}>
          <div className={f('columns', 'large-8')}>
            <div className={f('flex-container')}>
              <div className={f('flex-box')}>
                <span
                  className={f('icon', 'icon-common', 'xl')}
                  data-icon="&#xf02d;"
                />{' '}
                <h5>Documentations</h5>
                <li>
                  <ul>
                    <li>
                      <Link
                        href={config.root.readthedocs.href}
                        className={f('ext')}
                        target="_blank"
                      >
                        InterPro documentation
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="https://pfam-docs.readthedocs.io/en/latest/"
                        className={f('ext')}
                        target="_blank"
                      >
                        Pfam documentation
                      </Link>
                    </li>
                  </ul>
                </li>
              </div>
              <div className={f('flex-box')}>
                <span
                  className={f('icon', 'icon-common', 'xl')}
                  data-icon="&#xf2fd;"
                />{' '}
                <h5>InterProScan</h5>
                <ul>
                  <li>
                    <Link
                      href="https://interproscan-docs.readthedocs.io/"
                      className={f('ext')}
                      target="_blank"
                    >
                      InterProScan documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//www.ebi.ac.uk/jdispatcher/docs/"
                      className={f('ext')}
                      target="_blank"
                    >
                      Job Dispatcher documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={f('flex-box')}>
                <span
                  className={f('icon', 'icon-common', 'xl')}
                  data-icon="&#xf085;"
                />
                <h5>Technical specs</h5>
                <ul>
                  <li>
                    <Link
                      href="https://github.com/ProteinsWebTeam/interpro7-api/tree/master/docs"
                      className={f('ext')}
                      target="_blank"
                    >
                      <span
                        className={f('icon', 'icon-common')}
                        data-icon="&#xf09b;"
                      />{' '}
                      General API documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//www.ebi.ac.uk/interpro/api/static_files/swagger/"
                      className={f('ext')}
                      target="_blank"
                    >
                      Swagger API documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={{
                        description: {
                          main: { key: 'result' },
                          result: { type: 'download' },
                        },
                        hash: '/entry/interpro/|json',
                      }}
                    >
                      Code snippet generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//www.ebi.ac.uk/data-protection/privacy-notice/embl-ebi-public-website"
                      className={f('ext')}
                      target="_blank"
                    >
                      Privacy and security
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//www.ebi.ac.uk/ebisearch/documentation"
                      className={f('ext')}
                      target="_blank"
                    >
                      EBI Search documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={f('flex-box')}>
                <span
                  className={f('icon', 'icon-common', 'xl')}
                  data-icon="&#xf10d;"
                />{' '}
                <h5>Publications</h5>
                <ul>
                  <li>
                    <Link
                      href={`${config.root.readthedocs.href}citing.html`}
                      className={f('ext')}
                      target="_blank"
                    >
                      Citing InterPro
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://pfam-docs.readthedocs.io/en/latest/citing-pfam.html"
                      className={f('ext')}
                      target="_blank"
                    >
                      Citing Pfam
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={f('columns', 'large-4')}>
            <div className={f('box-add', 'margin-top-xxlarge')}>
              <h3 className={f('light')}>Contact us/Additional help</h3>
              <ul>
                {
                  // <li>
                  //   <Link href="//www.ebi.ac.uk/support/interpro-general-query">
                  //     <span
                  //       className={f('icon', 'icon-common')}
                  //       data-icon="&#x27a;"
                  //     />{' '}
                  //     Chat with an assistant{' '}
                  //   </Link>
                  // </li>
                }
                <li>
                  <Link
                    href="//www.ebi.ac.uk/support/interpro"
                    target="_blank"
                    withReferrer
                  >
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x6e;"
                    />{' '}
                    Submit a ticket
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
