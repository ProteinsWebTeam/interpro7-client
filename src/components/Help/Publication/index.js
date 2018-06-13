import React, { PureComponent } from 'react';
import T from 'prop-types';

import Link from 'components/generic/Link';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

import { foundationPartial } from 'styles/foundation';

import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import local from './style.css';

const f = foundationPartial(local, fonts, ipro);

/*:: type Props = {
  data: {
    loading: boolean,
    payload?: {
      databases: {},
    }
  },
}; */

export const Publication = class extends PureComponent /*:: <Props> */ {
  static displayName = 'Publication';

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
    return (
      <section>
        <h3>Publications</h3>
        <p>
          A number of online Publications relating to InterPro are available.
        </p>
        <div className={f('flex-grid', 'publication')}>
          <div className={f('card-grid', 'tuto-beyond')}>
            <Link
              href="http://nar.oxfordjournals.org/content/45/D1/D190"
              target="_blank"
            >
              <div className={f('card-image')}>
                <div className={f('card-label')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  InterPro in 2017 — beyond protein family and domain
                  annotations
                </div>
                <div className={f('card-info')}>
                  <div className={f('card-info-author')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x235;"
                    />{' '}
                    Robert D. Finn, Teresa K. Attwood, Patricia C. Babbitt, Alex
                    Bateman, Peer Bork, Alan J. Bridge, Hsin-Yu Chang, Zsuzsanna
                    Dosztányi, Sara El-Gebali, Matthew Fraser, Julian Gough,
                    David Haft, Gemma L. Holliday, Hongzhan Huang, Xiaosong
                    Huang, Ivica Letunic, Rodrigo Lopez, Shennan Lu, Aron
                    Marchler-Bauer, Huaiyu Mi, Jaina Mistry, Darren A. Natale,
                    Marco Necci, Gift Nuka, Christine A. Orengo, Youngmi Park,
                    Sebastien Pesseat, Damiano Piovesan, Simon C. Potter, Neil
                    D. Rawlings, Nicole Redaschi, Lorna Richardson, Catherine
                    Rivoire, Amaia Sangrador-Vegas, Christian Sigrist, Ian
                    Sillitoe, Ben Smithers, Silvano Squizzato, Granger Sutton,
                    Narmada Thanki, Paul D Thomas, Silvio C. E. Tosatto, Cathy
                    H. Wu, Ioannis Xenarios, Lai-Su Yeh, Siew-Yit Young and Alex
                    L. Mitchell{' '}
                  </div>
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x1ea;"
                    />{' '}
                    Nucleic Acids Research, Jan 2017, (doi: 10.1093/nar/gkw1107)
                  </div>
                </div>
                <div className={f('card-description')}>
                  Here, we report recent developments with InterPro and its
                  associated software, including the addition of two new
                  databases (SFLD and CDD), and the functionality to include
                  residue-level annotation and prediction of intrinsic disorder.
                </div>
              </div>
            </Link>
          </div>

          <div className={f('card-grid', 'tuto-go')}>
            <Link
              href="http://database.oxfordjournals.org/content/2016/baw027.full"
              target="_blank"
            >
              <div className={f('card-image')}>
                <div className={f('card-label')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  GO annotation in InterPro: why stability does not indicate
                  accuracy in a sea of changing annotation
                </div>
                <div className={f('card-info')}>
                  <div className={f('card-info-author')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x235;"
                    />{' '}
                    Sangrador-Vegas A, Mitchell AL, Chang HY, Yong SY and Finn
                    RD{' '}
                  </div>
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x1ea;"
                    />{' '}
                    Database, 2016, 1–8, (doi: 10.1093/database/baw027)
                  </div>
                </div>

                <div className={f('card-description')}>
                  Here, we describe some of these events and their consequences
                  for the InterPro database, and demonstrate that annotation
                  removal or reassignment is not always linked to incorrect
                  annotation by the curator.
                </div>
              </div>
            </Link>
          </div>

          <div className={f('card-grid', 'tuto-interproscan')}>
            <Link
              href="http://bioinformatics.oxfordjournals.org/content/early/2014/01/29/bioinformatics.btu031.full"
              target="_blank"
            >
              <div className={f('card-image')}>
                <div className={f('card-label')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  InterProScan 5: genome-scale protein function classification
                </div>
                <div className={f('card-info')}>
                  <div className={f('card-info-author')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x235;"
                    />{' '}
                    Philip Jones, David Binns, Hsin-Yu Chang, Matthew Fraser,
                    Weizhong Li, Craig McAnulla, Hamish McWilliam, John Maslen,
                    Alex Mitchell, Gift Nuka, Sebastien Pesseat, Antony F.
                    Quinn, Amaia Sangrador-Vegas, Maxim Scheremetjew, Siew-Yit
                    Yong, Rodrigo Lopez, and Sarah Hunter{' '}
                  </div>
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#x1ea;"
                    />{' '}
                    Bioinformatics, Jan 2014 (doi:10.1093/bioinformatics/btu031)
                  </div>
                </div>

                <div className={f('card-description')}>
                  Here, we describe a new Java-based architecture for the widely
                  used protein function prediction software package
                  InterProScan.
                </div>
              </div>
            </Link>
          </div>
        </div>
        <h3 className={f('margin-top-large')}>How to cite</h3>
        <p>To cite InterPro, please refer to the following publication:</p>
        <p>
          Robert D. Finn, Teresa K. Attwood, Patricia C. Babbitt, Alex Bateman,
          Peer Bork, Alan J. Bridge, Hsin-Yu Chang, Zsuzsanna Dosztányi, Sara
          El-Gebali, Matthew Fraser, Julian Gough, David Haft, Gemma L.
          Holliday, Hongzhan Huang, Xiaosong Huang, Ivica Letunic, Rodrigo
          Lopez, Shennan Lu, Aron Marchler-Bauer, Huaiyu Mi, Jaina Mistry,
          Darren A. Natale, Marco Necci, Gift Nuka, Christine A. Orengo, Youngmi
          Park, Sebastien Pesseat, Damiano Piovesan, Simon C. Potter, Neil D.
          Rawlings, Nicole Redaschi, Lorna Richardson, Catherine Rivoire, Amaia
          Sangrador-Vegas, Christian Sigrist, Ian Sillitoe, Ben Smithers,
          Silvano Squizzato, Granger Sutton, Narmada Thanki, Paul D Thomas,
          Silvio C. E. Tosatto, Cathy H. Wu, Ioannis Xenarios, Lai-Su Yeh,
          Siew-Yit Young and Alex L. Mitchell (2017).
          <strong>
            {' '}
            InterPro in 2017 — beyond protein family and domain annotations
          </strong>.{' '}
          <i>Nucleic Acids Research, Jan 2017; doi: 10.1093/nar/gkw1107</i>
        </p>
      </section>
    );
  }
};

export default loadData(getUrlForMeta)(Publication);
