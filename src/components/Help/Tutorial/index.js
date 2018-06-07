import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadable from 'higherOrder/loadable';
import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { schemaProcessDataForDB } from 'schema_org/processors';

import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import theme from 'styles/theme-interpro.css';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts, theme, ipro);

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

/*:: type Props = {
  data: {
    loading: boolean,
    payload?: {
      databases: {},
    }
  },
}; */

export const Tutorial = class extends PureComponent /*:: <Props> */ {
  static displayName = 'Tutorial';

  static propTypes = {
    data: T.shape({
      loading: T.bool.isRequired,
      payload: T.shape({
        databases: T.object,
      }),
    }).isRequired,
  };

  render() {
    const { loading, payload } = this.props.data;
    if (loading || !payload) return 'Loading…';
    const databases = payload && payload.databases;
    const memberDBs = Object.values(payload.databases).filter(
      db => db.type === 'entry' && db.canonical !== 'interpro',
    );
    return (
      <section>
        <h3>Tutorials</h3>
        <p>A number of online tutorials relating to InterPro are available.</p>
        <div className={f('flex-grid', 'tutorials')}>
          <div className={f('card-grid', 'tuto-01')}>
            <div className={f('card-image')}>
              <div className={f('card-label')}>Tutorial</div>
            </div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                {' '}
                <Link href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies">
                  InterPro: A case study of 3 protein family building
                  methodologies
                </Link>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x235;"
                  />{' '}
                  Lorna Richardson, Shoshana Brown, Paul Thomas, David Haft{' '}
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em className={f('icon', 'icon-common')} data-icon="&#x17;" />{' '}
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
            {
              // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-case-study-3-protein-family-building-methodologies" className={f('button')}>Start the course</Link>
            }
          </div>

          <div className={f('card-grid', 'tuto-02')}>
            <div className={f('card-image')}>
              <div className={f('card-label')}>Tutorial</div>
            </div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                {' '}
                <Link href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro">
                  InterPro: functional and structural analysis of protein
                  sequences
                </Link>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x235;"
                  />{' '}
                  Alex Mitchell
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em className={f('icon', 'icon-common')} data-icon="&#x17;" />{' '}
                  1 hour
                </div>
              </div>
              <div className={f('card-description')}>
                This course will provide an in-depth guide to InterPro - how to
                access it, how to search the database and interpret the results.
              </div>
            </div>
            {
              // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-functional-and-structural-analysis-protei/what-interpro" className={f('button')}>Start the course</Link>
            }
          </div>

          <div className={f('card-grid', 'tuto-03')}>
            <div className={f('card-image')}>
              <div className={f('card-label')}>Tutorial</div>
            </div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                {' '}
                <Link href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou">
                  Protein classification: An introduction to EMBL-EBI resources
                </Link>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x235;"
                  />{' '}
                  Amaia Sangrador{' '}
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em className={f('icon', 'icon-common')} data-icon="&#x17;" />{' '}
                  0.5 hour
                </div>
              </div>
              <div className={f('card-description')}>
                This course provides background information on protein signature
                databases and their use in sequence analysis and protein
                classification.
              </div>
            </div>
            {
              //<Link  href="//www.ebi.ac.uk/training/online/course/protein-classification-introduction-embl-ebi-resou" className={f('button')}>Start the course</Link>
            }
          </div>

          <div className={f('card-grid', 'tuto-04')}>
            <div className={f('card-image')}>
              <div className={f('card-label')}>Tutorial</div>
            </div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                {' '}
                <Link href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour">
                  A Quick Tour of InterPro
                </Link>
              </div>
              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x235;"
                  />{' '}
                  Alex Mitchell{' '}
                </div>
                <div className={f('card-info-level')}>
                  <em
                    className={f('icon', 'icon-common')}
                    data-icon="&#x14e;"
                  />{' '}
                  Beginner
                </div>
                <div className={f('card-info-duration')}>
                  <em className={f('icon', 'icon-common')} data-icon="&#x17;" />{' '}
                  0.5 hour
                </div>
              </div>
              <div className={f('card-description')}>
                This course provides a brief overview of InterPro, including
                querying the database and visualising the results using the web
                interface.
              </div>
            </div>
            {
              // <Link  href="//www.ebi.ac.uk/training/online/course/interpro-quick-tour" className={f('button')}>Start the course</Link>
            }
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
};

export default loadData(getUrlForMeta)(Tutorial);
