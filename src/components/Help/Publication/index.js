import React, { PureComponent } from 'react';

import { DescriptionReadMore } from 'components/Description';
import Link from 'components/generic/Link';

import { foundationPartial } from 'styles/foundation';

import EBIGlobal from 'ebi-framework/css/ebi-global.css';
import ipro from 'styles/interpro-new.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import helper from 'styles/helper-classes.css';
import local from './style.css';

const f = foundationPartial(EBIGlobal, fonts, ipro, helper, local);

export default class Publication extends PureComponent /*:: <{||}> */ {
  render() {
    return (
      <section>
        <h3>Publications</h3>
        <p>
          A number of online Publications relating to InterPro are available.
        </p>
        <div className={f('flex-column')}>
          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-nar-default')}>
              <div className={f('card-tag', 'tag-publi')}>Publication</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="https://doi.org/10.1093/nar/gky1100"
                    target="_blank"
                  >
                    InterPro in 2019: improving coverage, classification and
                    access to protein sequence annotations
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <DescriptionReadMore
                    text={`<span data-icon="&#xf007;" class="${f(
                      'icon',
                      'icon-common',
                    )}"></span> Alex L Mitchell, Teresa K Attwood, Patricia C Babbitt,
                    Matthias Blum, Peer Bork, Alan Bridge, Shoshana D Brown,
                  Hsin-Yu Chang, Sara El-Gebali, Matthew I Fraser, Julian Gough,
                  David R Haft, Hongzhan Huang, Ivica Letunic, Rodrigo Lopez,
                  Aurélien Luciani, Fabio Madeira, Aron Marchler-Bauer, Huaiyu
                  Mi, Darren A Natale, Marco Necci, Gift Nuka, Christine Orengo,
                  Arun P Pandurangan, Typhaine Paysan-Lafosse, Sebastien
                  Pesseat, Simon C Potter, Matloob A Qureshi, Neil D Rawlings,
                  Nicole Redaschi, Lorna J Richardson, Catherine Rivoire,
                  Gustavo A Salazar, Amaia Sangrador-Vegas, Christian J A
                  Sigrist, Ian Sillitoe, Granger G Sutton, Narmada Thanki, Paul
                  D Thomas, Silvio C E Tosatto, Siew-Yit Yong and Robert D Finn`}
                    minNumberOfCharToShow={420}
                  />
                </div>
                <div className={f('card-info-source')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf1ea;"
                  />{' '}
                  Nucleic Acids Research, Jan 2019, (doi: 10.1093/nar/gky1100)
                </div>
              </div>
            </div>

            <div className={f('card-more')}>
              <Link href="https://doi.org/10.1093/nar/gky1100" target="_blank">
                <div
                  className={f(
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                  )}
                  data-icon="&#xf061;"
                >
                  Read more
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-beyond')}>
              <div className={f('card-tag', 'tag-publi')}>Publication</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="http://nar.oxfordjournals.org/content/45/D1/D190"
                    target="_blank"
                  >
                    InterPro in 2017 — beyond protein family and domain
                    annotations
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <DescriptionReadMore
                    text={`<span data-icon="&#xf007;" class="${f(
                      'icon',
                      'icon-common',
                    )}"></span> Robert D. Finn, Teresa K. Attwood, Patricia C. Babbitt, Alex Bateman, Peer Bork, Alan J. Bridge, Hsin-Yu Chang, Zsuzsanna Dosztányi, Sara El-Gebali, Matthew Fraser, Julian Gough, David Haft, Gemma L. Holliday, Hongzhan Huang, Xiaosong Huang, Ivica Letunic, Rodrigo Lopez, Shennan Lu, Aron Marchler-Bauer, Huaiyu Mi, Jaina Mistry, Darren A. Natale, Marco Necci, Gift Nuka, Christine A. Orengo, Youngmi Park, Sebastien Pesseat, Damiano Piovesan, Simon C. Potter, Neil D. Rawlings, Nicole Redaschi, Lorna Richardson, Catherine Rivoire, Amaia Sangrador-Vegas, Christian Sigrist, Ian Sillitoe, Ben Smithers, Silvano Squizzato, Granger Sutton, Narmada Thanki, Paul D Thomas, Silvio C. E. Tosatto, Cathy H. Wu, Ioannis Xenarios, Lai-Su Yeh, Siew-Yit Youngand Alex L. Mitchell`}
                    minNumberOfCharToShow={420}
                  />
                </div>
                <div className={f('card-info-source')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf1ea;"
                  />{' '}
                  Nucleic Acids Research, Jan 2017, (doi: 10.1093/nar/gkw1107)
                </div>
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="http://nar.oxfordjournals.org/content/45/D1/D190"
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
                  Read more
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-go')}>
              <div className={f('card-tag', 'tag-publi')}>Publication</div>
            </div>
            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="http://database.oxfordjournals.org/content/2016/baw027.full"
                    target="_blank"
                  >
                    GO annotation in InterPro: why stability does not indicate
                    accuracy in a sea of changing annotation
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf007;"
                  />{' '}
                  <span className={f('sc')}>Sangrador-Vegas</span> A,{' '}
                  <span className={f('sc')}>Mitchell</span> AL,{' '}
                  <span className={f('sc')}>Chang</span> HY,{' '}
                  <span className={f('sc')}>Yong</span> SY and{' '}
                  <span className={f('sc')}>Finn</span> RD
                </div>
                <div className={f('card-info-source')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf1ea;"
                  />{' '}
                  Database, 2016, 1–8, (doi: 10.1093/database/baw027)
                </div>
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="http://database.oxfordjournals.org/content/2016/baw027.full"
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
                  Read more
                </div>
              </Link>
            </div>
          </div>

          <div className={f('flex-card')}>
            <div className={f('card-image', 'image-tuto-ipscan')}>
              <div className={f('card-tag', 'tag-publi')}>Publication</div>
            </div>

            <div className={f('card-content')}>
              <div className={f('card-title')}>
                <h4>
                  <Link
                    href="http://bioinformatics.oxfordjournals.org/content/early/2014/01/29/bioinformatics.btu031.full"
                    target="_blank"
                  >
                    InterProScan 5: genome-scale protein function classification
                  </Link>
                </h4>
              </div>

              <div className={f('card-info')}>
                <div className={f('card-info-author')}>
                  <DescriptionReadMore
                    text={`<span data-icon="&#xf007;" class="${f(
                      'icon',
                      'icon-common',
                    )}"></span> Philip Jones, David Binns, Hsin-Yu Chang, Matthew Fraser, Weizhong Li, Craig McAnulla, Hamish McWilliam, John Maslen, Alex Mitchell, Gift Nuka, Sebastien Pesseat, Antony F. Quinn, Amaia Sangrador-Vegas, Maxim Scheremetjew, Siew-Yit Yong, Rodrigo Lopez, and Sarah Hunter`}
                    minNumberOfCharToShow={420}
                  />
                </div>
                <div className={f('card-info-source')}>
                  <span
                    className={f('icon', 'icon-common')}
                    data-icon="&#xf1ea;"
                  />{' '}
                  Bioinformatics, Jan 2014 (doi:10.1093/bioinformatics/btu031)
                </div>
              </div>
            </div>

            <div className={f('card-more')}>
              <Link
                href="http://bioinformatics.oxfordjournals.org/content/early/2014/01/29/bioinformatics.btu031.full"
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
                  Read more
                </div>
              </Link>
            </div>
          </div>
        </div>
        <h3 className={f('margin-top-large')}>How to cite</h3>
        <p>To cite InterPro, please refer to the following publication:</p>
        <blockquote className={f('quote')}>
          Alex L Mitchell, Teresa K Attwood, Patricia C Babbitt, Matthias Blum,
          Peer Bork, Alan Bridge, Shoshana D Brown, Hsin-Yu Chang, Sara
          El-Gebali, Matthew I Fraser, Julian Gough, David R Haft, Hongzhan
          Huang, Ivica Letunic, Rodrigo Lopez, Aurélien Luciani, Fabio Madeira,
          Aron Marchler-Bauer, Huaiyu Mi, Darren A Natale, Marco Necci, Gift
          Nuka, Christine Orengo, Arun P Pandurangan, Typhaine Paysan-Lafosse,
          Sebastien Pesseat, Simon C Potter, Matloob A Qureshi, Neil D Rawlings,
          Nicole Redaschi, Lorna J Richardson, Catherine Rivoire, Gustavo A
          Salazar, Amaia Sangrador-Vegas, Christian J A Sigrist, Ian Sillitoe,
          Granger G Sutton, Narmada Thanki, Paul D Thomas, Silvio C E Tosatto,
          Siew-Yit Yong and Robert D Finn;
          <strong>
            {' '}
            InterPro in 2019: improving coverage, classification and access to
            protein sequence annotations
          </strong>
          . <i>Nucleic Acids Research, Jan 2019; doi: 10.1093/nar/gky1100</i>
        </blockquote>
      </section>
    );
  }
}
