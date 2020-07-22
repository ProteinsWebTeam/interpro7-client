// @flow
import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';
import loadable from 'higherOrder/loadable';
import { schemaProcessDataPageSection } from 'schema_org/processors';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

export default class Webinar extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h3>Webinars</h3>
        <SchemaOrgData
          data={{
            name: 'InterPro Help: Tutorials',
            description:
              'A number of webinars on InterPro and related tools are available',
          }}
          processData={schemaProcessDataPageSection}
        />{' '}
        <p>A number of webinars on InterPro and related tools are available.</p>
        <div className={f('flex-column')}>
          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-webinar-ipscan')}>
              <div className={f('card-tag', 'tag-webinar')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interproscan"
                    target="_blank"
                  >
                    Functional analysis of protein sequences using InterProScan
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Gift Nuka{' '}
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf017;"
                  />{' '}
                  1 hour
                </div>
              </div>
              <div className={f('card-description')}>
                This webinar is about InterProScan, the underlying software
                application that scans both protein and nucleic acid sequences
                against InterPro&apos;s predictive models, which are provided by
                the InterPro&apos;s member databases. InterPro is a freely
                available resource used to classify sequences into protein
                families and to predict the presence of important domains and
                sites.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interproscan"
                target="_blank"
              >
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Watch it here
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-webinar-api')}>
              <div className={f('card-tag', 'tag-webinar')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/accessing-interpro-programmatically"
                    target="_blank"
                  >
                    Accessing InterPro programmatically
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Gustavo Salazar{' '}
                </div>
                <div className={f('card-info-level')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf017;"
                  />{' '}
                  1 hour
                </div>
              </div>

              <div className={f('card-description')}>
                This webinar describes how the InterPro data is structured in
                the Application Programming Interface (API), and how it could be
                accessed programmatically for further bioinformatics analyses.
                The InterPro website relies on the API which can also be
                utilised by users for direct access to the data.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/accessing-interpro-programmatically"
                target="_blank"
              >
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Watch it here
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-webinar-web')}>
              <div className={f('card-tag', 'tag-webinar')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/using-interpro-website-your-research"
                    target="_blank"
                  >
                    Using the InterPro website in your research
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Typhaine Paysan-Lafosse{' '}
                </div>
                <div className={f('card-info-level')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf017;"
                  />{' '}
                  1 hour
                </div>
              </div>

              <div className={f('card-description')}>
                This webinar will guide you through searching and exploring the
                data available in the InterPro database and will show you how it
                can help finding data for your research. It also points out the
                additional features available to be used by the scientific
                community working on protein sequences.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/using-interpro-website-your-research"
                target="_blank"
              >
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Watch it here
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-webinar-interpro')}>
              <div className={f('card-tag', 'tag-webinar')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/understanding-interpro-families-domains-and-functions"
                    target="_blank"
                  >
                    Understanding InterPro families, domains and functions
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Typhaine Paysan-Lafosse{' '}
                </div>
                <div className={f('card-info-level')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf017;"
                  />{' '}
                  1 hour
                </div>
              </div>

              <div className={f('card-description')}>
                This webinar defines the basic InterPro notions, concepts of
                protein classification and describes how InterPro ensures the
                accuracy of its data. It also explains the different
                methodologies used by the InterPro member databases in their
                predictions and how we integrate them into the 5 different
                InterPro entry types: Homologous superfamily, family, domain,
                repeat and site.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/understanding-interpro-families-domains-and-functions"
                target="_blank"
              >
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Watch it here
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-webinar-g3d')}>
              <div className={f('card-tag', 'tag-webinar')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/genome3d-annotations-interpro-webinar"
                    target="_blank"
                  >
                    Genome 3D annotations in InterPro webinar
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Typhaine Paysan-Lafosse{' '}
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf017;"
                  />{' '}
                  0.5 hour
                </div>
              </div>
              <div className={f('card-description')}>
                This webinar presents the new InterPro entry type, Homologous
                superfamily, as well as describing domain and structure
                predictions from Genome3D annotations, and how they are
                integrated in InterPro.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/genome3d-annotations-interpro-webinar"
                target="_blank"
              >
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Watch it here
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
