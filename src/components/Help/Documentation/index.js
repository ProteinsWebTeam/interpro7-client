// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import local from './style.css';

import { InterProLogo } from 'components/Header/Title';

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
                <InterProLogo /> <h5>Interpro</h5>
                <li>
                  <ul>
                    <li>
                      <Link
                        to={{
                          description: {
                            other: ['about', 'interpro'],
                          },
                        }}
                      >
                        About InterPro
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={{
                          description: {
                            other: ['release_notes'],
                          },
                        }}
                      >
                        Release Notes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={{
                          description: {
                            other: ['help', 'faqs'],
                          },
                        }}
                      >
                        Frequently Asked Questions (FAQs)
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={{
                          description: {
                            other: ['about', 'ida'],
                          },
                        }}
                      >
                        InterPro Domain Architecture
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
                      to={{
                        description: {
                          other: ['about', 'interproscan'],
                        },
                      }}
                    >
                      About InterProScan
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//github.com/ebi-pf-team/interproscan/wiki"
                      className={f('ext')}
                      target="_blank"
                    >
                      <span
                        className={f('icon', 'icon-common')}
                        data-icon="&#xf09b;"
                      />{' '}
                      InterProScan Wiki
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
                        hash: '/entry/interpro',
                      }}
                    >
                      Code snippet generator
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="//www.ebi.ac.uk/Tools/webservices/"
                      className={f('ext')}
                      target="_blank"
                    >
                      Web services
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
                      href="//www.ebi.ac.uk/ebisearch/documentation.ebi"
                      className={f('ext')}
                      target="_blank"
                    >
                      Search documentation (EBI)
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={f('flex-box')}>
                <span
                  className={f('icon', 'icon-common', 'xl')}
                  data-icon="&#xf02d;"
                />{' '}
                <h5>Publications</h5>
                <ul>
                  <li>
                    <Link
                      to={{
                        description: {
                          other: ['help', 'documentation', 'publication'],
                        },
                      }}
                    >
                      Show all previous InterPro publications
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
