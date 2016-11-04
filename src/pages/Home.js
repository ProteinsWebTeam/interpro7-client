/* @flow */
import React from 'react';
import {foundationPartial} from 'styles/foundation';
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';
import SearchByText from 'components/SearchByText';
import Description from 'components/Description';
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);


const Home = () => (
  <main>
    <div className={f('row')}>
      <div className={f('columns', 'large-12')}>

        <div className={'fig-container'} data-tooltip title="This is what InterPro does" >

          {// <div  className={'fig-proteins'}></div><div  className={'fig-sqcbig'}></div>
          }

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120" >
            <line x1="20" y1="0" x2="20" y2="130" strokeWidth="3" stroke="#cacaca"/>
            <line x1="50" y1="0" x2="50" y2="130" strokeWidth="3" stroke="#cacaca"/>
            <line x1="80" y1="0" x2="80" y2="130" strokeWidth="3" stroke="#cacaca"/>
            <line x1="110" y1="0" x2="110" y2="130" strokeWidth="3" stroke="#cacaca"/>
            <line x1="140" y1="0" x2="140" y2="130" strokeWidth="3" stroke="#cacaca"/>

            <line strokeLinecap="round" x1="20" y1="-100" x2="20" y2="200" stroke="#abd6ba" strokeWidth="16"/>
            <line strokeLinecap="round" x1="50" y1="-100" x2="50" y2="200" stroke="#2d7d95" strokeWidth="16"/>
            <line strokeLinecap="round" x1="80" y1="90" x2="80" y2="200" stroke="#2d7d95" strokeWidth="16"/>
            <line strokeLinecap="round" x1="80" y1="-100" x2="80" y2="44" stroke="#abd6ba" strokeWidth="16"/>
            <line strokeLinecap="round" x1="110" y1="-100" x2="110" y2="200" stroke="#2d7d95" strokeWidth="16"/>
            <line strokeLinecap="round" x1="140" y1="-100" x2="140" y2="60" stroke="#abd6ba" strokeWidth="16"/>
          </svg>

        </div>

        <h3>Classification of protein families</h3>

        <Description title={['']}
          textBlocks={['InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. We combine protein signatures from a number of member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean urna orci, porta sit amet luctus non, efficitur eu tortor. Sed faucibus justo lectus, a condimentum tellus posuere dictum. Donec leo odio, luctus a dictum vitae, elementum in dui. ']}
        />

        <SearchByText />

      </div>
    </div>


    {// Browse entry & entry list
    }
    <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>

      <div className={f('columns', 'browse-by')}>

        <div className={f('callout')} data-equalizer-watch>

              <ul className={f('tabs')} data-tabs id="example-tabs">
                <li className={f('tabs-title', 'is-active')} ><a href="#panel1">by member database</a></li>
                <li className={f('tabs-title')}><a href="#panel2" >by entry type</a></li>
                <li className={f('tabs-title')}><a href="#panel3">by species</a></li>
                <li className={f('tabs-title')}><a href="#panel4">by GO terms</a></li>
              </ul>

          <div className={f('tabs', 'tabs-content')} data-tabs-content="example-tabs">

            <div className={f('tabs-panel', 'is-active', 'md-list')} id="panel1">
              <div className={f('row')}>

                {// Database CATH
                }
                  <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                    <a href="entry/gene3d" className={f('md-cg')}>

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className={f('svg-mask')}>
                        <defs>
                          <clipPath id="cut-off-center">
                            <rect x="33%" y="33%" width="70" height="70"/>
                          </clipPath>
                        </defs>
                      </svg>

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-cath-gene3d">
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                      </svg>
                    
                      <h6 data-tooltip title="CATH-Gene3D database describes protein families and domain architectures in complete genomes. Protein families are formed using a Markov clustering algorithm, followed by multi-linkage clustering according to sequence identity. Mapping of predicted structure and sequence domains is undertaken using hidden Markov models libraries representing CATH and Pfam domains. CATH-Gene3D is based at University College, London, UK.">CATH-GENE3D
                      </h6><p><small>3.5.0</small><br/><span >11273 entries</span></p>

                    </a>
                  </div>

                {// Database CDD
                }
                  <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                    <a href="entry/cdd" className={f('md-cd')}>

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-cdd">
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                      </svg>

                      <h6 data-tooltip title="CDD is a protein annotation resource that consists of a collection of annotated multiple sequence alignment models for ancient domains and full-length proteins. These are available as position-specific score matrices (PSSMs) for fast identification of conserved domains in protein sequences via RPS-BLAST. CDD content includes NCBI-curated domain models, which use 3D-structure information to explicitly define domain boundaries and provide insights into sequence/structure/function relationships, as well as domain models imported from a number of external source databases."> CDD
                      </h6><p ><small>3.14</small><br/><span>2626 entries</span></p>

                    </a>
                  </div>

                {// Database HAMAP
                }
                  <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                    <a href="entry/hamap" className={f('md-ha')}>

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-hamap">
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                      </svg>

                      <h6 data-tooltip title="HAMAP stands for High-quality Automated and Manual Annotation of Proteins. HAMAP profiles are manually created by expert curators. They identify proteins that are part of well-conserved proteins families or subfamilies. HAMAP is based at the SIB Swiss Institute of Bioinformatics, Geneva, Switzerland.">HAMAP
                      </h6><p ><small>201605.11</small><br/><span>2087 entries</span></p></a>
                  </div>

                {// Database PANTHER
                }
                  <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                    <a href="entry/panther" className={f('md-pa')}>

                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-panther">
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                        <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                      </svg>

                      <h6 data-tooltip title="PANTHER is a large collection of protein families that have been subdivided into functionally related subfamilies, using human expertise. These subfamilies model the divergence of specific functions within protein families, allowing more accurate association with function, as well as inference of amino acids important for functional specificity. Hidden Markov models (HMMs) are built for each family and subfamily for classifying additional protein sequences. PANTHER is based at at University of Southern California, CA, US.">PANTHER
                      </h6><p><small>10.0</small><br/><span>95118 entries</span></p>
                    </a>
                  </div>

              </div>
              {// Row2
              }
              <div className={f('row')}>

                {// Database PFAM
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                  <a href="entry/pfam" className={f('md-pf')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-pfam">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="Pfam is a large collection of multiple sequence alignments and hidden Markov models covering many common protein domains. Pfam is based at EMBL-EBI, Hinxton, UK.">PFAM
                    </h6><p><small>30.0</small><br/><span >16306 entries</span></p></a>
                </div>

                {// Database PIRSF
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="entry/pirsf" className={f('md-pi')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-pirsf">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="PIRSF protein classification system is a network with multiple levels of sequence diversity from superfamilies to subfamilies that reflects the evolutionary relationship of full-length proteins and domains. PIRSF is based at the Protein Information Resource, Georgetown University Medical Centre, Washington DC, US.">PIRSF
                    </h6><p><small>3.01</small><br/><span>3285 entries</span></p></a>
                </div>

                {// Database PRINTS
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="entry/prints" className={f('md-pri')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-prints">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="PRINTS is a compendium of protein fingerprints. A fingerprint is a group of conserved motifs used to characterise a protein family or domain. PRINTS is based at the University of Manchester, UK.">PRINTS
                    </h6><p><small>42.0</small><br/><span>2106 entries</span></p></a>
                </div>

                {// Database PRODOM
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                  <a href="entry/prodom" className={f('md-pro')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-prodom">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="ProDom protein domain database consists of an automatic compilation of homologous domains. Current versions of ProDom are built using a novel procedure based on recursive PSI-BLAST searches. ProDom is based at PRABI Villeurbanne, France.">PRODOM
                    </h6><p><small>2006.1</small><br/><span>1894 entries</span></p>
                  </a>
                </div>

              </div>
              {// Row2
              }
              <div className={f('row')}>

                {// Database PROSITE profile
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                  <a href="entry/profile" className={f('md-prpro')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-prosite-profile">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="PROSITE is a database of protein families and domains. It consists of biologically significant sites, patterns and profiles that help to reliably identify to which known protein family a new sequence belongs. PROSITE is base at the Swiss Institute of Bioinformatics (SIB), Geneva, Switzerland."> PROSITE profiles
                    </h6><p><small>20.119</small><br/><span>1136 entries</span></p></a>
                </div>

                {// Database PROSITE patterns
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="entry/prosite" className={f('md-prpat')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-prosite-patterns">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="PROSITE is a database of protein families and domains. It consists of biologically significant sites, patterns and profiles that help to reliably identify to which known protein family a new sequence belongs. PROSITE is base at the Swiss Institute of Bioinformatics (SIB), Geneva, Switzerland."> PROSITE patterns
                    </h6><p><small>20.119</small><br/><span>1309 entries</span></p></a>
                </div>

                {// Database SFLD
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="entry/sfld" className={f('md-sf')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-dfld">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="SFLD (Structure-Function Linkage Database) is a hierarchical classification of enzymes that relates specific sequence-structure features to specific chemical capabilities."> SFLD
                    </h6><p><small>1</small><br/><span>480 entries</span></p></a>
                </div>

                {// Database SMART
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                  <a href="entry/smart" className={f('md-sm')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" id="md-smart">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="SMART (a Simple Modular Architecture Research Tool) allows the identification and annotation of genetically mobile domains and the analysis of domain architectures. SMART is based at at EMBL, Heidelberg, Germany."> SMART
                    </h6><p><small>7.1</small><br/><span>1312 entries</span></p>
                  </a>
                </div>

              </div>
              {// Row3
              }
              <div className={f('row')}>

                {// Database SUPERFAMILIES
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>
                  <a href="entry/ssf" className={f('md-su')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="SUPERFAMILY is a library of profile hidden Markov models that represent all proteins of known structure. The library is based on the SCOP classification of proteins: each model corresponds to a SCOP domain and aims to represent the entire SCOP superfamily that the domain belongs to. SUPERFAMILY is based at the University of Bristol, UK."> SUPERFAMILY
                    </h6><p><small>1.75</small><br/><span>2019 entries</span></p></a>
                </div>

                {// Database TIGRFAMS
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="entry/tigrfams" className={f('md-ti')}>

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" >
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>
                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-color')} clipPath="url(#cut-off-center)">D</text>
                    </svg>

                    <h6 data-tooltip title="TIGRFAMs is a collection of protein families, featuring curated multiple sequence alignments, hidden Markov models (HMMs) and annotation, which provides a tool for identifying functionally related proteins based on sequence homology. TIGRFAMs is based at the J. Craig Venter Institute, Rockville, MD, US."> TIGRFAMS
                    </h6><p><small>15.0</small><br/><span>4408 entries</span></p></a>
                </div>

                {// Database new member
                }
                <div className={f('columns', 'medium-3', 'large-3', 'text-center')}>

                  <a href="contact/" >

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" >
                      <defs>
                        <clipPath id="cut-off-center">
                          <rect x="33%" y="33%" width="70" height="70"/>
                        </clipPath>
                      </defs>

                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" className={f('md-server')}>D</text>

                      <text x="50%" y="50%" textAnchor="middle" dx="-0.01em" dy="0.4em" fill="#222" style={{fontFamily: 'Montserrat, arial, serif',fontSize: 120, fontWeight: 700}}>?</text>
                    </svg>

                    <h6 data-tooltip title="Want to become a partner?"> New partner?
                    </h6><p><span>click to join us</span></p></a>
                </div>


              </div>

              <a href="/entry" className={f('button')}>View all entries</a>

            </div>
            {// panel2 - temp display block
            }
            <div className={f('tabs-panel', 'entrytype-panel')} id="panel2" >
               <div className={f('row')}>

                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className={f('svg-mask')} >
                    <defs>
                      <clipPath id="cut-off-bottom">
                        <polygon points="0,68 68,0 68,68" />
                      </clipPath>
                    </defs>
                  </svg>

                  <a href="#" data-tooltip title="This icon represent a domain type of InterPro entry">
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-domain" >
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#36a30f" style={{fill: ('#50bb30')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#36a30f')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>D</text>
                    </svg>
                    </div>

                  <h5>Domain <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="Domains are distinct functional, structural or sequence units that may exist in a variety of biological contexts. A match to an InterPro entry of this type indicates the presence of a domain." /></h5><p>8439 entries<br/></p> </a>
                </div>

                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>
                  <a href="#" data-tooltip title="This icon represent a Family type of InterPro entry">
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-family" >
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#d41813" style={{fill: ('#f54528')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#d41813')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>F</text>
                    </svg>
                    </div>

                  <h5> Family <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="A protein family is a group of proteins that share a common evolutionary origin reflected by their related functions, similarities in sequence, or similar primary, secondary or tertiary structure. A match to an InterPro entry of this type indicates membership of a protein family." /> </h5><p>19788 entries<br/></p> </a>
                </div>

                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>
                  <a href="#" data-tooltip title="This icon represent a site type of InterPro entry" >
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-site" >
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#a83cc9" style={{fill: ('#c646ec')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#a83cc9')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>S</text>
                    </svg>
                  </div>

                  <h5>Sites <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="A short sequence that contains one or more conserved residues. The type of sites covered by InterPro are active sites, binding sites, post-translational modification sites and conserved sites" /></h5><p>755 entries<br/></p>
                  </a>
                </div>

              </div>
               <div className={f('row')}>
                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>

                  <a href="#" data-tooltip title="This icon represent a repeat type of InterPro entry" >
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-repeat" >
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#ff8511" style={{fill: ('#ffa249')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#ff8511')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>R</text>
                    </svg>
                    </div>

                  <h5>Repeat <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="It identifies a short sequence that is typically repeated within a protein." /></h5><p>755 entries<br/></p>
                  </a>
                </div>

                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>
                  <a href="#" data-tooltip title="This icon represent a Clan type of InterPro entry" >
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-clan" >
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#1f64b3" style={{fill: ('#1e77dc')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#1f64b3')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>C</text>
                    </svg>
                  </div>

                  <h5>Clans <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="Clans are a collection of families" /></h5><p>18 entries<br/></p></a>
                </div>

                <div className={f('columns', 'medium-4', 'large-4', 'text-center')}>
                  <a href="#" data-tooltip title="This icon represent an unintegrated type of InterPro entry">
                    <div className={f('svg-container')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" id="type-unintegrated">
                      <rect x="12" y="12" width="60" height="60" style={{fill: ('black'), opacity: 0.15}} />
                      <rect x="4" y="4" width="60" height="60" strokeWidth="8" stroke="#737373" style={{fill: ('#8c8c8c')}} />
                      <polygon points="0,68 68,0 68,68" style={{fill: ('#737373')}} />
                      <text x="50%" y="50%" textAnchor="middle" dx="-2px" dy="20px" style={{fill: ('white'), fontSize: 60, fontWeight: 700, fontFamily: 'Montserrat, arial, serif'}}>?</text>
                    </svg>
                    </div>

                  <h5>Unintegrated <span className={f('small', 'icon', 'icon-generic')} data-icon="i" data-tooltip title="Signatures that doesn't belong to any type are what we call unintegrated" /></h5><p>16852 signatures<br/></p>
                  </a>
                </div>
              </div>

              <a href="/entry" className={f('button')}>View all entries</a>

            </div>
            {// panel3
            }
            <div className={f('tabs-panel')} id="panel3">
              test panel3
            </div>
            {// panel4
            }
            <div className={f('tabs-panel')} id="panel4">
              test panel3
            </div>
          </div>


        </div>
        </div>

      <div className={f('columns', 'entry-list')}>
        {// Browse by latest entries or most popular
        }
        <div className={f('callout')} data-equalizer-watch>

          <ul className={f('tabs')} data-tabs id="anotherexample-tabs">
            <li className={f('tabs-title', 'is-active')} ><a href="#panel01">Latest entries</a></li>
            <li className={f('tabs-title')}><a href="#panel02" >Featured</a></li>
            <li className={f('tabs-title')}><a href="#panel03">Most popular</a></li>
          </ul>

          <div className={f('tabs', 'tabs-content')} data-tabs-content="anotherexample-tabs">

            <div className={f('tabs-panel', 'is-active', 'entrylatest-panel')} id="panel01">
              <div className={f('row')}>

                <h5> <small>Total : 29415 entries</small></h5>
                <div className={f('list-vertical-scrol')}>
                  <ul>

                    <a href="/entry/interpro/IPR033983">
                      <li className={f('list-item')} data-tooltip  title="Domain entry">

                      <div className={f('svg-container')}  >
                        <svg viewBox="0 0 72 72" className={f('icon-list')}>
                          <use href="#type-domain"/>
                        </svg>
                      </div>
                       <div className={f('list-body')}>
                         <div className={f('list-title')}> Thiazole synthase ThiG <span>(IPR033983)</span> - <i>8192 proteins matched</i><br/></div>
                         <div className={f('list-more')}>
                           <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                           <use href="#md-pfam"/>
                           </svg>
                           <small>Pfam: <a href="/interpro/pfam/PF05690" className={f('list-sign')}> PF05690</a> (1 contributing signature)</small></div>
                       </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR033985">
                      <li className={f('list-item')} data-tooltip  title="Domain entry">
                        <div className={f('svg-container')}  >
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-domain"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}> SusD-like, N-terminal <span>(IPR033985)</span> - <i>22916 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                              <use href="#md-pfam"/>
                            </svg>
                            <small>Pfam: <a href="/interpro/entry/pfam/PF14322" className={f('list-sign')}> PF14322</a> (1 contributing signature)</small></div>
                        </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR033986">
                      <li className={f('list-item')} data-tooltip  title="Site entry">
                        <div className={f('svg-container')}  >
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-site"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}>Clusterin, conserved site <span>(IPR033986)</span> - <i>145 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                              <use href="#md-prosite-patterns"/>
                            </svg>
                            <small>PROSITE patterns: <a href="/interpro/entry/prosite/PS00492" className={f('list-sign')}>PS00492</a>, <a href="/interpro/entry/prosite/PS00493" className={f('list-sign')}>PS00493</a> (2 contributing signatures)</small> </div>
                        </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR033987">
                    <li className={f('list-item')} data-tooltip  title="Domain entry" >

                      <div className={f('svg-container')}  >
                        <svg viewBox="0 0 72 72" className={f('icon-list')}>
                          <use href="#type-domain"/>
                        </svg>
                      </div>
                      <div className={f('list-body')}>
                        <div className={f('list-title')}>Aggrecan/versican, C-type lectin-like domain  <span>(IPR033987)</span> - <i>249 proteins matched</i><br/></div>
                        <div className={f('list-more')}>
                          <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                            <use href="#md-cdd"/>
                          </svg>
                          <small>CDD: <a href="/interpro/entry/cdd/cd03588" className={f('list-sign')}>cd03588</a> (1 contributing signature)</small></div>

                      </div>

                    </li>
                  </a>

                    <a href="/entry/interpro/IPR033988">
                      <li className={f('list-item')} data-tooltip  title="Domain entry">
                        <div className={f('svg-container')}  >
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-domain"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}>CEL-1-like C-type lectin-like domain   <span>(IPR033988)</span> - <i>75 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                              <use href="#md-cdd"/>
                            </svg>
                            <small>CDD: <a href="/interpro/entry/cdd/cd03589" className={f('list-sign')}>cd03589 </a> (1 contributing signature)</small></div>
                        </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR033989">
                      <li className={f('list-item')} data-tooltip  title="Domain entry">
                        <div className={f('svg-container')}>
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-domain"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}>CD209-like, C-type lectin-like domain <span>(IPR033989)</span> - <i>1586 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                            <use href="#md-cdd"/>
                            </svg>
                            <small>CDD: <a href="/interpro/entry/cdd/cd03590" className={f('list-sign')}>cd03590 </a> (1 contributing signature)</small></div>
                        </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR034004">
                      <li className={f('list-item')} data-tooltip  title="Domain entry">
                        <div className={f('svg-container')}  >
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-domain"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}>Pol I subunit A12, C-terminal zinc ribbon <span>(IPR034004)</span> - <i>977 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                              <use href="#md-cdd"/>
                            </svg>
                            <small>CDD: <a href="/interpro/entry/cdd/cd10507 " className={f('list-sign')}>cd10507</a> (1 contributing signature)</small></div>
                        </div>
                      </li>
                    </a>

                    <a href="/entry/interpro/IPR034005">
                      <li className={f('list-item')} data-tooltip  title="Family entry">
                        <div className={f('svg-container')}  >
                          <svg viewBox="0 0 72 72" className={f('icon-list')}>
                            <use href="#type-family"/>
                          </svg>
                        </div>
                        <div className={f('list-body')}>
                          <div className={f('list-title')}>Peptidyl-dipeptidase DCP <span>(IPR034005)</span> - <i>8245 proteins matched</i><br/></div>
                          <div className={f('list-more')}>
                            <svg viewBox="0 0 72 72" className={f('icon-sign')}>
                              <use href="#md-cdd"/>
                            </svg>
                            <small>CDD: <a href="/interpro/entry/cdd/cd06456" className={f('list-sign')}>cd06456</a> (1 contributing signature)</small></div>
                        </div>
                      </li>
                    </a>

                  </ul>

                </div>{// end list-vertical-scrol
              }
           <a href="/entry" className={f('button')}>View all entries</a>
         </div>
              {// end row
              }
       </div>
            {// end panel01
            }


            <div className={f('tabs-panel', 'entry-feat')} id="panel02">
              <div className={f('row')}>
                test 02
              </div>
             </div>
            {// end panel02
            }

          </div> {// end anotherexample-tabs
        }


        </div>{// end callout
      }
      </div>{// end entry-list
    }

    </div> {// end Browse entry & entry list
  }
  </main>
);

export default Home;
