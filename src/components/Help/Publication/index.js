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
                    minNumberOfCharToShow={300}
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
                    minNumberOfCharToShow={300}
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
                  <DescriptionReadMore
                    text={`<span data-icon="&#xf007;" class="${f(
                      'icon',
                      'icon-common',
                    )}"></span> Sangrador-Vegas A, Mitchell AL, Chang HY, Yong SY and Finn RD`}
                    minNumberOfCharToShow={300}
                  />
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
                    minNumberOfCharToShow={300}
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

        <details className={f('option-style')}>
          <summary>All previous InterPro publications</summary>
          <p className={f('margin-top-large')}>
            {
              //<img alt="NAR publication cover" src="/interpro/resources/images/publication/ico_pub_nar_2015.jpg" />
            }
            <Link
              href="//nar.oxfordjournals.org/content/43/D1/D213"
              target="_blank"
              className={f('ext')}
            >
              The InterPro protein families database: the classification
              resource after 15 years
            </Link>
            <div>
              <span>
                Alex Mitchell, Hsin-Yu Chang, Louise Daugherty, Matthew Fraser,
                Sarah Hunter, Rodrigo Lopez, Craig McAnulla, Conor McMenamin,
                Gift Nuka, Sebastien Pesseat, Amaia Sangrador-Vegas, Maxim
                Scheremetjew, Claudia Rato, Siew-Yit Yong, Alex Bateman, Marco
                Punta, Teresa K. Attwood, Christian J.A. Sigrist, Nicole
                Redaschi, Catherine Rivoire, Ioannis Xenarios, Daniel Kahn,
                Dominique Guyot, Peer Bork, Ivica Letunic, Julian Gough, Matt
                Oates, Daniel Haft, Hongzhan Huang, Darren A. Natale, Cathy H.
                Wu, Christine Orengo, Ian Sillitoe, Huaiyu Mi, Paul D. Thomas
                and Robert D. Finn.
              </span>
              <span>
                <i>Nucleic Acids Research</i>, Jan 2015, (doi:
                10.1093/nar/gku1243)
              </span>
            </div>
          </p>

          <p>
            {
              //<img alt="publication cover" src="/interpro/resources/images/publication/ico_pub_nar_1240.jpg" />
            }
            <Link
              href="//nar.oxfordjournals.org/content/40/D1/D306.full"
              target="_blank"
              className={f('ext')}
            >
              InterPro in 2011: new developments in the family and domain
              prediction database
            </Link>
            <div>
              <span>
                Sarah Hunter; Philip Jones; Alex Mitchell; Rolf Apweiler; Teresa
                K. Attwood; Alex Bateman; Thomas Bernard; David Binns; Peer
                Bork; Sarah Burge; Edouard de Castro; Penny Coggill; Matthew
                Corbett; Ujjwal Das; Louise Daugherty; Lauranne Duquenne; Robert
                D. Finn; Matthew Fraser; Julian Gough; Daniel Haft; Nicolas
                Hulo; Daniel Kahn; Elizabeth Kelly; Ivica Letunic; David
                Lonsdale; Rodrigo Lopez; Martin Madera; John Maslen; Craig
                McAnulla; Jennifer McDowall; Conor McMenamin; Huaiyu Mi;
                Prudence Mutowo-Muellenet; Nicola Mulder; Darren Natale;
                Christine Orengo; Sebastien Pesseat; Marco Punta; Antony F.
                Quinn; Catherine Rivoire; Amaia Sangrador-Vegas; Jeremy D.
                Selengut; Christian J. A. Sigrist; Maxim Scheremetjew; John
                Tate; Manjulapramila Thimmajanarthanan; Paul D. Thomas; Cathy H.
                Wu; Corin Yeats; Siew-Yit Yong.
              </span>
              <span>
                <i>Nucleic Acids Research</i>, 2012, Vol. 40, Database issue
                (doi: 10.1093/nar/gkr948)
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//database.oxfordjournals.org/content/2012/bar068.full"
              target="_blank"
              className={f('ext')}
            >
              Manual GO annotation of predictive protein signatures: the
              InterPro approach to GO curation
            </Link>
            <div>
              <span>
                Burge, S., Kelly, E., Lonsdale, D., Mutowo-Muellenet, P.,
                McAnulla, C., Mitchell, A., Sangrador-Vegas, A., Yong, S.,
                Mulder, N., Hunter, S.
              </span>
              <span>
                <i>Database</i> Vol. 2012 (doi: 10.1093/database/bar068)
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//database.oxfordjournals.org/content/2011/bar033.full"
              target="_blank"
              className={f('ext')}
            >
              The InterPro BioMart: federated query and web service access to
              the InterPro Resource
            </Link>
            <div>
              <span>
                Jones P., Binns D., McMenamin C., McAnulla C., Hunter S.
              </span>
              <span>
                <i>Database</i> Vol. 2011 (doi: 10.1093/database/bar033)
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/21082426"
              target="_blank"
              className={f('ext')}
            >
              InterPro protein classification.
            </Link>
            <div>
              <span>McDowall J, Hunter S.</span>
              <span>
                <i>Methods Mol Biol.</i>, 2011, 694:37-47. doi:
                10.1007/978-1-60761-977-2_3.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pmc/articles/PMC2686546/"
              target="_blank"
              className={f('ext')}
            >
              InterPro: the integrative protein signature database.
            </Link>
            <div>
              <span>
                Hunter S, Apweiler R, Attwood TK, Bairoch A, Bateman A, Binns D,
                Bork P, Das U, Daugherty L, Duquenne L, Finn RD, Gough J, Haft
                D, Hulo N, Kahn D, Kelly E, Laugraud A, Letunic I, Lonsdale D,
                Lopez R, Madera M, Maslen J, McAnulla C, McDowall J, Mistry J,
                Mitchell A, Mulder N, Natale D, Orengo C, Quinn AF, Selengut JD,
                Sigrist CJ, Thimma M, Thomas PD, Valentin F, Wilson D, Wu CH,
                Yeats C.{' '}
              </span>
              <span>
                <i>Nucleic Acids Res.</i>, 2009 Jan, 37(Database issue):D211-5.
                doi: 10.1093/nar/gkn785.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/18428686"
              target="_blank"
              className={f('ext')}
            >
              The InterPro database and tools for protein domain analysis.
            </Link>
            <div>
              <span>Mulder NJ, Apweiler R.</span>
              <span>
                <i>Curr Protoc Bioinformatics</i>, 2008 Mar, Chapter 2:Unit 2.7.
                doi:10.1002/0471250953.bi0207s21.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/18025686"
              target="_blank"
              className={f('ext')}
            >
              InterPro and InterProScan: tools for protein sequence
              classification and comparison.
            </Link>
            <div>
              <span>Mulder N, Apweiler R.</span>
              <span>
                <i>Methods Mol Biol</i>, 2007,396:59-70.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pmc/articles/PMC1899100/"
              target="_blank"
              className={f('ext')}
            >
              New developments in the InterPro database.
            </Link>
            <div>
              <span>
                Mulder NJ, Apweiler R, Attwood TK, Bairoch A, Bateman A, Binns
                D, Bork P, Buillard V, Cerutti L, Copley R, Courcelle E, Das U,
                Daugherty L, Dibley M, Finn R, Fleischmann W, Gough J, Haft D,
                Hulo N, Hunter S, Kahn D, Kanapin A, Kejariwal A, Labarga A,
                Langendijk-Genevaux PS, Lonsdale D, Lopez R, Letunic I, Madera
                M, Maslen J, McAnulla C, McDowall J, Mistry J, Mitchell A,
                Nikolskaya AN, Orchard S, Orengo C, Petryszak R, Selengut JD,
                Sigrist CJ, Thomas PD, Valentin F, Wilson D, Wu CH, Yeats C.
              </span>
              <span>
                <i>Nucleic Acids Research</i>, 2007 Jan, 35(Database
                issue):D224-8.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//nar.oxfordjournals.org/content/33/suppl_2/W116.full"
              target="_blank"
              className={f('ext')}
            >
              InterProScan: protein domains identifier
            </Link>
            <div>
              <span>
                Quevillon E., Silventoinen V., Pillai S., Harte N., Mulder N.,
                Apweiler R., Lopez R.
              </span>
              <span>
                <i>Nucleic Acids Research</i>, 2005, Vol. 33, Issue suppl 2
                (doi: 10.1093/nar/gki442)
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/15608177"
              target="_blank"
              className={f('ext')}
            >
              InterPro, progress and status in 2005.
            </Link>
            <div>
              <span>
                Mulder NJ, Apweiler R, Attwood TK, Bairoch A, Bateman A, Binns
                D, Bradley P, Bork P, Bucher P, Cerutti L, Copley R, Courcelle
                E, Das U, Durbin R, Fleischmann W, Gough J, Haft D, Harte N,
                Hulo N, Kahn D, Kanapin A, Krestyaninova M, Lonsdale D, Lopez R,
                Letunic I, Madera M, Maslen J, McDowall J, Mitchell A,
                Nikolskaya AN, Orchard S, Pagni M, Ponting CP, Quevillon E,
                Selengut J, Sigrist CJ, Silventoinen V, Studholme DJ, Vaughan R,
                Wu CH.
              </span>
              <span>
                <i>Nucleic Acids Res</i>, 33(Database issue):D201-5.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pmc/articles/PMC165493/"
              target="_blank"
              className={f('ext')}
            >
              {' '}
              The InterPro Database, 2003 brings increased coverage and new
              features.
            </Link>
            <div>
              <span>
                Mulder NJ, Apweiler R, Attwood TK, Bairoch A, Barrell D, Bateman
                A, Binns D, Biswas M, Bradley P, Bork P, Bucher P, Copley RR,
                Courcelle E, Das U, Durbin R, Falquet L, Fleischmann W,
                Griffiths-Jones S, Haft D, Harte N, Hulo N, Kahn D, Kanapin A,
                Krestyaninova M, Lopez R, Letunic I, Lonsdale D, Silventoinen V,
                Orchard SE, Pagni M, Peyruc D, Ponting CP, Selengut JD, Servant
                F, Sigrist CJ, Vaughan R, Zdobnov EM.
              </span>
              <span>
                <i>Nucleic Acids Res</i>, 2003 Jan 1;31(1):315-8.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/12230032"
              target="_blank"
              className={f('ext')}
            >
              {' '}
              HMM-based databases in InterPro.
            </Link>
            <div>
              <span>Bateman A, Haft DH.</span>
              <span>
                <i> Brief Bioinform</i>, 2002 Sep;3(3):236-45.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/12230031"
              target="_blank"
              className={f('ext')}
            >
              InterPro: an integrated documentation resource for protein
              families, domains and functional sites.
            </Link>
            <div>
              <span>
                Mulder NJ, Apweiler R, Attwood TK, Bairoch A, Bateman A, Binns
                D, Biswas M, Bradley P, Bork P, Bucher P, Copley R, Courcelle E,
                Durbin R, Falquet L, Fleischmann W, Gouzy J, Griffith-Jones S,
                Haft D, Hermjakob H, Hulo N, Kahn D, Kanapin A, Krestyaninova M,
                Lopez R, Letunic I, Orchard S, Pagni M, Peyruc D, Ponting CP,
                Servant F, Sigrist CJ; InterPro Consortium.
              </span>
              <span>
                <i> Brief Bioinform</i>, 2002 Sep;3(3):225-35.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/11847096"
              target="_blank"
              className={f('ext')}
            >
              Interactive InterPro-based comparisons of proteins in whole
              genomes.
            </Link>
            <div>
              <span>
                Kanapin A, Apweiler R, Biswas M, Fleischmann W, Karavidopoulou
                Y, Kersey P, Kriventseva EV, Mittard V, Mulder N, Oinn T, Phan
                I, Servant F, Zdobnov E.
              </span>
              <span>
                <i> Bioinformatics</i>, 2002 Feb;18(2):374-5.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/11590104"
              target="_blank"
              className={f('ext')}
            >
              InterProScan--an integration platform for the
              signature-recognition methods in InterPro.
            </Link>
            <div>
              <span>Zdobnov EM, Apweiler R.</span>
              <span>
                <i> Bioinformatics</i>, 2001 Sep;17(9):847-8.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="//www.ncbi.nlm.nih.gov/pubmed/11159333"
              target="_blank"
              className={f('ext')}
            >
              InterPro--an integrated documentation resource for protein
              families, domains and functional sites.
            </Link>
            <div>
              <span>
                Apweiler R, Attwood TK, Bairoch A, Bateman A, Birney E, Biswas
                M, Bucher P, Cerutti L, Corpet F, Croning MD, Durbin R, Falquet
                L, Fleischmann W, Gouzy J, Hermjakob H, Hulo N, Jonassen I, Kahn
                D, Kanapin A, Karavidopoulou Y, Lopez R, Marx B, Mulder NJ, Oinn
                TM, Pagni M, Servant F, Sigrist CJ, Zdobnov EM; InterPro
                Consortium.
              </span>
              <span>
                <i> Bioinformatics</i>, 2000 Dec;16(12):1145-50.
              </span>
            </div>
          </p>

          <p>
            <Link
              href="http://www.ncbi.nlm.nih.gov/pmc/articles/PMC29841/"
              target="_blank"
              className={f('ext')}
            >
              The InterPro database, an integrated documentation resource for
              protein families, domains and functional sites.
            </Link>
            <div>
              <span>
                Apweiler R, Attwood TK, Bairoch A, Bateman A, Birney E, Biswas
                M, Bucher P, Cerutti L, Corpet F, Croning MD, Durbin R, Falquet
                L, Fleischmann W, Gouzy J, Hermjakob H, Hulo N, Jonassen I, Kahn
                D, Kanapin A, Karavidopoulou Y, Lopez R, Marx B, Mulder NJ, Oinn
                TM, Pagni M, Servant F, Sigrist CJ, Zdobnov EM.
              </span>
              <span>
                <i> Nucleic Acids Res</i>, 2001 Jan 1;29(1):37-40.
              </span>
            </div>
          </p>
        </details>

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
