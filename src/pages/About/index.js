// @flow
import React, { PureComponent } from 'react';
import Link from 'components/generic/Link';

import { pkg } from 'config';
import info from './info';
import DiskUsage from './disk-usage';

import MemberSymbol from 'components/Entry/MemberSymbol';

import { foundationPartial } from 'styles/foundation';

import fonts from 'EBI-Icon-fonts/fonts.css';
import styles from './style.css';
import entry from '../../components/Entry/Literature/style.css';

const f = foundationPartial(fonts, styles, entry);
// remove last “.git”
const url = pkg.repository.url.replace('.git', '');
const DeveloperInfo = () => (
  <div>
    <h5>Developer information</h5>
    <div>
      This website has been built at{' '}
      <code>{String(new Date(info.build.time))}</code>
    </div>
    <div>
      It has been built from the repository at:
      <ul>
        <li>
          <Link target="_blank" href={url}>
            <code>{url}</code>
          </Link>
        </li>
        <li>
          branch:
          <Link target="_blank" href={`${url}/tree/${info.git.branch}`}>
            <code>{info.git.branch}</code>
          </Link>
        </li>
        {info.git.tag !== info.git.commit &&
          info.git.tag && (
            <li>
              tag:
              <Link target="_blank" href={`${url}/tree/${info.git.tag}`}>
                <code>{info.git.tag}</code>
              </Link>
            </li>
          )}
        <li>
          commit:
          <Link target="_blank" href={`${url}/tree/${info.git.commit}`}>
            <code>{info.git.commit}</code>
          </Link>
        </li>
      </ul>
    </div>
  </div>
);

export default class About extends PureComponent /*:: <{}> */ {
  render() {
    return (
      <div>
        <div className={f('row')}>
          <div className={f('columns', 'large-12')}>
            <section>
              <h3>About this website</h3>

              <h4>The InterPro Consortium</h4>
              <p>The following databases make up the InterPro Consortium:</p>

              <ul className={f('list')}>
                <li>
                  {' '}
                  <MemberSymbol type="cath" className={f('md-small')} />
                  <strong>CATH-Gene3D</strong> database describes protein
                  families and domain architectures in complete genomes. Protein
                  families are formed using a Markov clustering algorithm,
                  followed by multi-linkage clustering according to sequence
                  identity. Mapping of predicted structure and sequence domains
                  is undertaken using hidden Markov models libraries
                  representing CATH and Pfam domains. CATH-Gene3D is based at
                  University College, London, UK.
                </li>
                <li>
                  <MemberSymbol type="cdd" className={f('md-small')} />
                  <strong>CDD</strong> is a protein annotation resource that
                  consists of a collection of annotated multiple sequence
                  alignment models for ancient domains and full-length proteins.
                  These are available as position-specific score matrices
                  (PSSMs) for fast identification of conserved domains in
                  protein sequences via RPS-BLAST. CDD content includes
                  NCBI-curated domain models, which use 3D-structure information
                  to explicitly define domain boundaries and provide insights
                  into sequence/structure/function relationships, as well as
                  domain models imported from a number of external source
                  databases.
                </li>
                <li>
                  <MemberSymbol type="mobidb" className={f('md-small')} />
                  <strong>MobiDB</strong> offers a centralized resource for
                  annotations of intrinsic protein disorder. The database
                  features three levels of annotation: manually curated,
                  indirect and predicted. The different sources present a clear
                  tradeoff between quality and coverage. By combining them all
                  into a consensus annotation, MobiDB aims at giving the best
                  possible picture of the &ldquo;disorder landscape&rdquo; of a
                  given protein of interest.
                </li>
                <li>
                  <MemberSymbol type="hamap" className={f('md-small')} />
                  <strong>HAMAP</strong> stands for High-quality Automated and
                  Manual Annotation of Proteins. HAMAP profiles are manually
                  created by expert curators. They identify proteins that are
                  part of well-conserved proteins families or subfamilies. HAMAP
                  is based at the SIB Swiss Institute of Bioinformatics, Geneva,
                  Switzerland.
                </li>
                <li>
                  <MemberSymbol type="panther" className={f('md-small')} />
                  <strong>PANTHER</strong> is a large collection of protein
                  families that have been subdivided into functionally related
                  subfamilies, using human expertise. These subfamilies model
                  the divergence of specific functions within protein families,
                  allowing more accurate association with function, as well as
                  inference of amino acids important for functional specificity.
                  Hidden Markov models (HMMs) are built for each family and
                  subfamily for classifying additional protein sequences.
                  PANTHER is based at at University of Southern California, CA,
                  US.
                </li>
                <li>
                  <MemberSymbol type="pirsf" className={f('md-small')} />
                  <strong>PIRSF</strong> protein classification system is a
                  network with multiple levels of sequence diversity from
                  superfamilies to subfamilies that reflects the evolutionary
                  relationship of full-length proteins and domains. PIRSF is
                  based at the Protein Information Resource, Georgetown
                  University Medical Centre, Washington DC, US.
                </li>
                <li>
                  <MemberSymbol type="prints" className={f('md-small')} />
                  <strong>PRINTS</strong> is a compendium of protein
                  fingerprints. A fingerprint is a group of conserved motifs
                  used to characterise a protein family or domain. PRINTS is
                  based at the University of Manchester, UK.
                </li>
                <li>
                  <MemberSymbol type="prodom" className={f('md-small')} />
                  <strong>ProDom</strong> protein domain database consists of an
                  automatic compilation of homologous domains. Current versions
                  of ProDom are built using a novel procedure based on recursive
                  PSI-BLAST searches. ProDom is based at PRABI Villeurbanne,
                  France.
                </li>
                <li>
                  <MemberSymbol type="prosite" className={f('md-small')} />
                  <strong>PROSITE</strong> is a database of protein families and
                  domains. It consists of biologically significant sites,
                  patterns and profiles that help to reliably identify to which
                  known protein family a new sequence belongs. PROSITE is base
                  at the Swiss Institute of Bioinformatics (SIB), Geneva,
                  Switzerland.
                </li>
                <li>
                  <MemberSymbol type="sfld" className={f('md-small')} />
                  <strong>SFLD</strong> (Structure-Function Linkage Database) is
                  a hierarchical classification of enzymes that relates specific
                  sequence-structure features to specific chemical capabilities.
                </li>
                <li>
                  <MemberSymbol type="smart" className={f('md-small')} />
                  <strong>SMART</strong> (a Simple Modular Architecture Research
                  Tool) allows the identification and annotation of genetically
                  mobile domains and the analysis of domain architectures. SMART
                  is based at at EMBL, Heidelberg, Germany.
                </li>
                <li>
                  <MemberSymbol type="ssf" className={f('md-small')} />
                  <strong>SUPERFAMILY</strong> is a library of profile hidden
                  Markov models that represent all proteins of known structure.
                  The library is based on the SCOP classification of proteins:
                  each model corresponds to a SCOP domain and aims to represent
                  the entire SCOP superfamily that the domain belongs to.
                  SUPERFAMILY is based at the University of Bristol, UK.
                </li>
                <li>
                  <MemberSymbol type="tigrfams" className={f('md-small')} />
                  <strong>TIGRFAMs</strong> is a collection of protein families,
                  featuring curated multiple sequence alignments, hidden Markov
                  models (HMMs) and annotation, which provides a tool for
                  identifying functionally related proteins based on sequence
                  homology. TIGRFAMs is based at the J. Craig Venter Institute,
                  Rockville, MD, US.
                </li>
              </ul>
            </section>
          </div>
        </div>

        <div className={f('row')}>
          <div className={f('columns')}>
            <h4>How to cite </h4>

            <div className={f('row')}>
              <div className={f('columns', 'large-6', 'margin-bottom-large')}>
                <div className={f('cite-box')}>
                  <span
                    className={f('cite-icon', 'icon', 'icon-conceptual')}
                    data-icon="l"
                  />
                  <span className={f('cite-title')}>
                    <h5>INTERPRO</h5>
                  </span>
                  <span className={f('cite-text')}>
                    To cite InterPro, please refer to the following publication:
                    <br />
                    <i>
                      Robert D. Finn, Teresa K. Attwood, Patricia C. Babbitt,
                      Alex Bateman, Peer Bork, Alan J. Bridge, Hsin-Yu Chang,
                      Zsuzsanna Dosztányi, Sara El-Gebali, Matthew Fraser,
                      Julian Gough, David Haft, Gemma L. Holliday, Hongzhan
                      Huang, Xiaosong Huang, Ivica Letunic, Rodrigo Lopez,
                      Shennan Lu, Aron Marchler-Bauer, Huaiyu Mi, Jaina Mistry,
                      Darren A. Natale, Marco Necci, Gift Nuka, Christine A.
                      Orengo, Youngmi Park, Sebastien Pesseat, Damiano Piovesan,
                      Simon C. Potter, Neil D. Rawlings, Nicole Redaschi, Lorna
                      Richardson, Catherine Rivoire, Amaia Sangrador-Vegas,
                      Christian Sigrist, Ian Sillitoe, Ben Smithers, Silvano
                      Squizzato, Granger Sutton, Narmada Thanki, Paul D Thomas,
                      Silvio C. E. Tosatto, Cathy H. Wu, Ioannis Xenarios,
                      Lai-Su Yeh, Siew-Yit Young and Alex L. Mitchell{' '}
                    </i>(2017).{' '}
                    <strong>
                      InterPro in 2017 — beyond protein family and domain
                      annotations
                    </strong>. Nucleic Acids Research, Jan 2017; doi:
                    10.1093/nar/gkw1107
                  </span>
                </div>
              </div>

              <div className={f('columns', 'large-6', 'margin-bottom-large')}>
                <div className={f('cite-box')}>
                  <span
                    className={f('cite-icon', 'icon', 'icon-conceptual')}
                    data-icon="l"
                  />
                  <span className={f('cite-title')}>
                    <h5>INTERPROSCAN</h5>
                  </span>
                  <span className={f('cite-text')}>
                    To cite InterProScan, please refer to:<br />
                    <i>
                      Philip Jones, David Binns, Hsin-Yu Chang, Matthew Fraser,
                      Weizhong Li, Craig McAnulla, Hamish McWilliam, John
                      Maslen, Alex Mitchell, Gift Nuka, Sebastien Pesseat,
                      Antony F. Quinn, Amaia Sangrador-Vegas, Maxim
                      Scheremetjew, Siew-Yit Yong, Rodrigo Lopez, and Sarah
                      Hunter{' '}
                    </i>(2014).{' '}
                    <strong>
                      InterProScan 5: genome-scale protein function
                      classification
                    </strong>. Bioinformatics, Jan 2014;
                    doi:10.1093/bioinformatics/btu031
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={f('row')}>
          <div className={f('columns', 'large-12')}>
            <h4>Funding</h4>
            <p>
              InterPro is supported by EMBL, with additional funding gratefully
              received from the Biotechnology and Biological Sciences Research
              Council (BBSRC grants BB/L024136/1 and BB/N00521X/1) and the
              Wellcome Trust (grant 108433/Z/15/Z).
            </p>
            <DiskUsage />
            <DeveloperInfo />
          </div>
        </div>
      </div>
    );
  }
}
