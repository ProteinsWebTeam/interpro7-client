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

export default class Tutorial extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h3>Tutorials</h3>
        <SchemaOrgData
          data={{
            name: 'InterPro Help: Tutorials',
            description:
              'A number of online tutorials relating to InterPro are available',
          }}
          processData={schemaProcessDataPageSection}
        />{' '}
        <p>A number of online tutorials relating to InterPro are available.</p>
        <div className={f('flex-column')}>
          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-method')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies"
                    target="_blank"
                  >
                    InterPro: A case study of 3 protein family building
                    methodologies
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Lorna Richardson, Shoshana Brown, Paul Thomas, David Haft{' '}
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
                This course provides an insight into the different protein
                family building methodologies employed by three InterPro member
                databases, namely SFLD (Structure Function Linkage Database),
                TIGRFAMs and PANTHER. It also describes an automated approach to
                comparing protein signatures and predicting hierarchical
                relationships between them.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-what')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro"
                    target="_blank"
                  >
                    InterPro: functional and structural analysis of protein
                    sequences
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Alex Mitchell
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
                This course will provide an in-depth guide to InterPro - how to
                access it, how to search the database and interpret the results.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-intro')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou"
                    target="_blank"
                  >
                    Protein classification: An introduction to EMBL-EBI
                    resources
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Amaia Sangrador{' '}
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
                This course provides background information on protein signature
                databases and their use in sequence analysis and protein
                classification.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-tour')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour"
                    target="_blank"
                  >
                    A Quick Tour of InterPro
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Alex Mitchell{' '}
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
                This course provides a brief overview of InterPro, including
                querying the database and visualising the results using the web
                interface.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>
        </div>
        <h3 className={f('margin-top-large')}>Training</h3>
        <p>
          InterPro hands-on practical sessions feature regularly as part of the
          EBI training courses and workshops.{' '}
          <Link
            href="//www.ebi.ac.uk/training"
            className={f('ext')}
            target="_blank"
          >
            Find out more
          </Link>{' '}
          about when and where these training courses will run, as well as how
          to apply to host them.
        </p>
        <div className={f('box-add')}>
          <h3 className={f('margin-top-large')}>Additional Help</h3>
          <ul style={{ listStyleType: 'none', margin: 0 }}>
            <li>
              <Link
                href="//www.ebi.ac.uk/support/interpro"
                target="_blank"
                withReferrer
              >
                <span className={f('icon', 'icon-common')} data-icon="&#x6e;" />{' '}
                Submit a ticket
              </Link>
            </li>
          </ul>
        </div>
      </section>
    );
  }
}

export class Webinar extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <section>
        <h3>Webinars</h3>
        <SchemaOrgData
          data={{
            name: 'InterPro Help: Tutorials',
            description: 'A number of webinars on InterPro are available',
          }}
          processData={schemaProcessDataPageSection}
        />{' '}
        <p>A number of webinars on InterPro are available.</p>
        <div className={f('flex-column')}>
          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-method')}>
              <div className={f('card-tag', 'tag-tuto')}>Webinar</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies"
                    target="_blank"
                  >
                    InterPro: A case study of 3 protein family building
                    methodologies
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Lorna Richardson, Shoshana Brown, Paul Thomas, David Haft{' '}
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
                This course provides an insight into the different protein
                family building methodologies employed by three InterPro member
                databases, namely SFLD (Structure Function Linkage Database),
                TIGRFAMs and PANTHER. It also describes an automated approach to
                comparing protein signatures and predicting hierarchical
                relationships between them.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-what')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro"
                    target="_blank"
                  >
                    InterPro: functional and structural analysis of protein
                    sequences
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Alex Mitchell
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
                This course will provide an in-depth guide to InterPro - how to
                access it, how to search the database and interpret the results.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-intro')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou"
                    target="_blank"
                  >
                    Protein classification: An introduction to EMBL-EBI
                    resources
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Amaia Sangrador{' '}
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
                This course provides background information on protein signature
                databases and their use in sequence analysis and protein
                classification.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-tour')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour"
                    target="_blank"
                  >
                    A Quick Tour of InterPro
                  </Link>
                </h4>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  Alex Mitchell{' '}
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
                This course provides a brief overview of InterPro, including
                querying the database and visualising the results using the web
                interface.
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour"
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-g3d')}>
              <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
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
                This course presents the new InterPro entry type, Homologous
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
                  Start the course
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
