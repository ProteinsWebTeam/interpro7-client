import React, { PureComponent } from 'react';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts, ipro);

export default class Tutorial extends PureComponent /*:: <{||}> */ {
  render() {
    return (
      <section>
        <h3>Tutorials</h3>
        <p>A number of online tutorials relating to InterPro are available.</p>
        <div className={f('flex-column')}>
          <div className={f('card-grid')}>
            <Link href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies">
              <div className={f('card-image', 'tuto-method')}>
                <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    InterPro: A case study of 3 protein family building
                    methodologies
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
                  family building methodologies employed by three InterPro
                  member databases, namely SFLD (Structure Function Linkage
                  Database), TIGRFAMs and PANTHER. It also describes an
                  automated approach to comparing protein signatures and
                  predicting hierarchical relationships between them.
                </div>
              </div>
              {
                // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies" className={f('button')}>Start the course</Link>
              }
            </Link>
          </div>

          <div className={f('card-grid')}>
            <Link href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro">
              <div className={f('card-image', 'tuto-what')}>
                <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
              </div>

              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    InterPro: functional and structural analysis of protein
                    sequences
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
                  This course will provide an in-depth guide to InterPro - how
                  to access it, how to search the database and interpret the
                  results.
                </div>
              </div>
              {
                // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro" className={f('button')}>Start the course</Link>
              }
            </Link>
          </div>

          <div className={f('card-grid')}>
            <Link href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou">
              <div className={f('card-image', 'tuto-intro')}>
                <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    Protein classification: An introduction to EMBL-EBI
                    resources
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
                  This course provides background information on protein
                  signature databases and their use in sequence analysis and
                  protein classification.
                </div>
              </div>
              {
                // <Link  href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou" className={f('button')}>Start the course</Link>
              }
            </Link>
          </div>

          <div className={f('card-grid')}>
            <Link href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour">
              <div className={f('card-image', 'tuto-tour')}>
                <div className={f('card-tag', 'tag-tuto')}>Tutorial</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>A Quick Tour of InterPro</h4>
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
                  querying the database and visualising the results using the
                  web interface.
                </div>
              </div>
              {
                // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour" className={f('button')}>Start the course</Link>
              }
            </Link>
          </div>
        </div>
        <h3 className={f('margin-top-large')}>Training</h3>
        <p>
          InterPro hands-on practical sessions feature regularly as part of the
          EBI training courses and workshops.{' '}
          <Link href="//www.ebi.ac.uk/training" className={f('ext')}>
            Find out more
          </Link>{' '}
          about when and where these training courses will run, as well as how
          to apply to host them.
        </p>
      </section>
    );
  }
}
