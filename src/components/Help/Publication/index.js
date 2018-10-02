import React, { PureComponent } from 'react';

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
          <div className={f('card-grid')}>
            <Link
              href="http://nar.oxfordjournals.org/content/45/D1/D190"
              target="_blank"
            >
              <div className={f('card-image', 'tuto-beyond')}>
                <div className={f('card-tag', 'tag-publi')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    InterPro in 2017 — beyond protein family and domain
                    annotations
                  </h4>
                </div>

                <div className={f('card-info')}>
                  <div className={f('card-info-author')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf007;"
                    />{' '}
                    Robert D. <span className={f('sc')}>Finn</span>, Teresa K.{' '}
                    <span className={f('sc')}>Attwood</span>, Patricia C.{' '}
                    <span className={f('sc')}>Babbitt</span>, Alex{' '}
                    <span className={f('sc')}>Bateman</span>, Peer{' '}
                    <span className={f('sc')}>Bork</span>, Alan J.{' '}
                    <span className={f('sc')}>Bridge</span>, Hsin-Yu{' '}
                    <span className={f('sc')}>Chang</span>, Zsuzsanna{' '}
                    <span className={f('sc')}>Dosztányi</span>, Sara{' '}
                    <span className={f('sc')}>El-Gebali</span>, Matthew{' '}
                    <span className={f('sc')}>Fraser</span>, Julian{' '}
                    <span className={f('sc')}>Gough</span>, David{' '}
                    <span className={f('sc')}>Haft</span>, Gemma L.{' '}
                    <span className={f('sc')}>Holliday</span>, Hongzhan{' '}
                    <span className={f('sc')}>Huang</span>, Xiaosong{' '}
                    <span className={f('sc')}>Huang</span>, Ivica{' '}
                    <span className={f('sc')}>Letunic</span>, Rodrigo{' '}
                    <span className={f('sc')}>Lopez</span>, Shennan{' '}
                    <span className={f('sc')}>Lu</span>, Aron{' '}
                    <span className={f('sc')}>Marchler-Bauer</span>, Huaiyu{' '}
                    <span className={f('sc')}>Mi</span>, Jaina{' '}
                    <span className={f('sc')}>Mistry</span>, Darren A.{' '}
                    <span className={f('sc')}>Natale</span>, Marco{' '}
                    <span className={f('sc')}>Necci</span>, Gift{' '}
                    <span className={f('sc')}>Nuka</span>, Christine A.{' '}
                    <span className={f('sc')}>Orengo</span>, Youngmi{' '}
                    <span className={f('sc')}>Park</span>, Sebastien{' '}
                    <span className={f('sc')}>Pesseat</span>, Damiano{' '}
                    <span className={f('sc')}>Piovesan</span>, Simon C.{' '}
                    <span className={f('sc')}>Potter</span>, Neil D.{' '}
                    <span className={f('sc')}>Rawlings</span>, Nicole{' '}
                    <span className={f('sc')}>Redaschi</span>, Lorna{' '}
                    <span className={f('sc')}>Richardson</span>, Catherine{' '}
                    <span className={f('sc')}>Rivoire</span>, Amaia{' '}
                    <span className={f('sc')}>Sangrador</span>
                    -Vegas, Christian <span className={f('sc')}>Sigrist</span>,
                    Ian <span className={f('sc')}>Sillitoe</span>, Ben{' '}
                    <span className={f('sc')}>Smithers</span>, Silvano{' '}
                    <span className={f('sc')}>Squizzato</span>, Granger{' '}
                    <span className={f('sc')}>Sutton</span>, Narmada{' '}
                    <span className={f('sc')}>Thanki</span>, Paul D{' '}
                    <span className={f('sc')}>Thomas</span>, Silvio C. E.{' '}
                    <span className={f('sc')}>Tosatto</span>, Cathy H.{' '}
                    <span className={f('sc')}>Wu</span>, Ioannis{' '}
                    <span className={f('sc')}>Xenarios</span>, Lai-Su{' '}
                    <span className={f('sc')}>Yeh</span>, Siew-Yit{' '}
                    <span className={f('sc')}>Young</span>
                    and Alex L. <span className={f('sc')}>Mitchell</span>
                  </div>
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf1ea;"
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

              <div className={f('card-more')}>
                <div
                  className={f(
                    'button',
                    'hollow',
                    'secondary',
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                    'margin-bottom-none',
                  )}
                  data-icon="&#xf061;"
                >
                  Read more
                </div>
              </div>
            </Link>
          </div>

          <div className={f('card-grid')}>
            <Link
              href="http://database.oxfordjournals.org/content/2016/baw027.full"
              target="_blank"
            >
              <div className={f('card-image', 'tuto-go')}>
                <div className={f('card-tag', 'tag-publi')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    GO annotation in InterPro: why stability does not indicate
                    accuracy in a sea of changing annotation
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
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf1ea;"
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

              <div className={f('card-more')}>
                <div
                  className={f(
                    'button',
                    'hollow',
                    'secondary',
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                    'margin-bottom-none',
                  )}
                  data-icon="&#xf061;"
                >
                  Read more
                </div>
              </div>
            </Link>
          </div>

          <div className={f('card-grid')}>
            <Link
              href="http://bioinformatics.oxfordjournals.org/content/early/2014/01/29/bioinformatics.btu031.full"
              target="_blank"
            >
              <div className={f('card-image', 'tuto-interproscan')}>
                <div className={f('card-tag', 'tag-publi')}>Publication</div>
              </div>
              <div className={f('card-content')}>
                <div className={f('card-title')}>
                  <h4>
                    InterProScan 5: genome-scale protein function classification
                  </h4>
                </div>

                <div className={f('card-info')}>
                  <div className={f('card-info-author')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf007;"
                    />{' '}
                    Philip <span className={f('sc')}>Jones</span>, David{' '}
                    <span className={f('sc')}>Binns</span>, Hsin-Yu{' '}
                    <span className={f('sc')}>Chang</span>, Matthew{' '}
                    <span className={f('sc')}>Fraser</span>, Weizhong{' '}
                    <span className={f('sc')}>Li</span>, Craig{' '}
                    <span className={f('sc')}>McAnulla</span>, Hamish{' '}
                    <span className={f('sc')}>McWilliam</span>, John{' '}
                    <span className={f('sc')}>Maslen</span>, Alex{' '}
                    <span className={f('sc')}>Mitchell</span>, Gift{' '}
                    <span className={f('sc')}>Nuka</span>, Sebastien{' '}
                    <span className={f('sc')}>Pesseat</span>, Antony F.{' '}
                    <span className={f('sc')}>Quinn</span>, Amaia{' '}
                    <span className={f('sc')}>Sangrador-Vegas</span>, Maxim{' '}
                    <span className={f('sc')}>Scheremetjew</span>, Siew-Yit{' '}
                    <span className={f('sc')}>Yong</span>, Rodrigo{' '}
                    <span className={f('sc')}>Lopez</span>, and Sarah{' '}
                    <span className={f('sc')}>Hunter</span>
                  </div>
                  <div className={f('card-info-level')}>
                    <span
                      className={f('icon', 'icon-common')}
                      data-icon="&#xf1ea;"
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

              <div className={f('card-more')}>
                <div
                  className={f(
                    'button',
                    'hollow',
                    'secondary',
                    'button-more',
                    'icon',
                    'icon-common',
                    'icon-right',
                    'margin-bottom-none',
                  )}
                  data-icon="&#xf061;"
                >
                  Read more
                </div>
              </div>
            </Link>
          </div>
        </div>
        <h3 className={f('margin-top-large')}>How to cite</h3>
        <p>To cite InterPro, please refer to the following publication:</p>
        <blockquote className={f('quote')}>
          Robert D. <span className={f('sc')}>Finn</span>, Teresa K.{' '}
          <span className={f('sc')}>Attwood</span>, Patricia C.{' '}
          <span className={f('sc')}>Babbitt</span>, Alex{' '}
          <span className={f('sc')}>Bateman</span>, Peer{' '}
          <span className={f('sc')}>Bork</span>, Alan J.{' '}
          <span className={f('sc')}>Bridge</span>, Hsin-Yu{' '}
          <span className={f('sc')}>Chang</span>, Zsuzsanna{' '}
          <span className={f('sc')}>Dosztányi</span>, Sara{' '}
          <span className={f('sc')}>El-Gebali</span>, Matthew{' '}
          <span className={f('sc')}>Fraser</span>, Julian{' '}
          <span className={f('sc')}>Gough</span>, David{' '}
          <span className={f('sc')}>Haft</span>, Gemma L.{' '}
          <span className={f('sc')}>Holliday</span>, Hongzhan{' '}
          <span className={f('sc')}>Huang</span>, Xiaosong{' '}
          <span className={f('sc')}>Huang</span>, Ivica{' '}
          <span className={f('sc')}>Letunic</span>, Rodrigo{' '}
          <span className={f('sc')}>Lopez</span>, Shennan{' '}
          <span className={f('sc')}>Lu</span>, Aron{' '}
          <span className={f('sc')}>Marchler-Bauer</span>, Huaiyu{' '}
          <span className={f('sc')}>Mi</span>, Jaina{' '}
          <span className={f('sc')}>Mistry</span>, Darren A.{' '}
          <span className={f('sc')}>Natale</span>, Marco{' '}
          <span className={f('sc')}>Necci</span>, Gift{' '}
          <span className={f('sc')}>Nuka</span>, Christine A.{' '}
          <span className={f('sc')}>Orengo</span>, Youngmi{' '}
          <span className={f('sc')}>Park</span>, Sebastien{' '}
          <span className={f('sc')}>Pesseat</span>, Damiano{' '}
          <span className={f('sc')}>Piovesan</span>, Simon C.{' '}
          <span className={f('sc')}>Potter</span>, Neil D.{' '}
          <span className={f('sc')}>Rawlings</span>, Nicole{' '}
          <span className={f('sc')}>Redaschi</span>, Lorna{' '}
          <span className={f('sc')}>Richardson</span>, Catherine{' '}
          <span className={f('sc')}>Rivoire</span>, Amaia{' '}
          <span className={f('sc')}>Sangrador-Vegas</span>, Christian{' '}
          <span className={f('sc')}>Sigrist</span>, Ian{' '}
          <span className={f('sc')}>Sillitoe</span>, Ben{' '}
          <span className={f('sc')}>Smithers</span>, Silvano{' '}
          <span className={f('sc')}>Squizzato</span>, Granger{' '}
          <span className={f('sc')}>Sutton</span>, Narmada{' '}
          <span className={f('sc')}>Thanki</span>, Paul D{' '}
          <span className={f('sc')}>Thomas</span>, Silvio C. E.{' '}
          <span className={f('sc')}>Tosatto</span>, Cathy H.{' '}
          <span className={f('sc')}>Wu</span>, Ioannis{' '}
          <span className={f('sc')}>Xenarios</span>, Lai-Su{' '}
          <span className={f('sc')}>Yeh</span>, Siew-Yit{' '}
          <span className={f('sc')}>Young</span> and Alex L.{' '}
          <span className={f('sc')}>Mitchell</span> (2017).
          <strong>
            {' '}
            InterPro in 2017 — beyond protein family and domain annotations
          </strong>
          . <i>Nucleic Acids Research, Jan 2017; doi: 10.1093/nar/gkw1107</i>
        </blockquote>
      </section>
    );
  }
}
