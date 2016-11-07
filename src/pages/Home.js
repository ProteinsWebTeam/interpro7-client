// @flow
import React, {PropTypes as T} from 'react';
import {foundationPartial} from 'styles/foundation';
import SearchByText from 'components/SearchByText';
import Description from 'components/Description';
import {InterproSymbol} from 'components/Title';
import MemberSymbol from 'components/Entry/MemberSymbol';
import {Link} from 'react-router/es';
import {memberDB, entryType, latests} from 'staticData/home';
import Tabs from 'components/Tabs';

import iscanLogo from 'images/logo_interproscan_ext.png';
import idaLogo from 'images/logo_ida_100.png';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);


const InterproGraphic = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 120" >
    <line x1="20" y1="0" x2="20" y2="130" strokeWidth="3" stroke="#cacaca"/>
    <line x1="50" y1="0" x2="50" y2="130" strokeWidth="3" stroke="#cacaca"/>
    <line x1="80" y1="0" x2="80" y2="130" strokeWidth="3" stroke="#cacaca"/>
    <line x1="110" y1="0" x2="110" y2="130" strokeWidth="3" stroke="#cacaca"/>
    <line x1="140" y1="0" x2="140" y2="130" strokeWidth="3" stroke="#cacaca"/>

    <line
      x1="20" y1="-100" x2="20" y2="200"
      strokeLinecap="round" stroke="#abd6ba" strokeWidth="16"
    />
    <line
      x1="50" y1="-100" x2="50" y2="200"
      strokeLinecap="round" stroke="#2d7d95" strokeWidth="16"
    />
    <line
      x1="80" y1="90" x2="80" y2="200"
      strokeLinecap="round" stroke="#2d7d95" strokeWidth="16"
    />
    <line
      x1="80" y1="-100" x2="80" y2="44"
      strokeLinecap="round" stroke="#abd6ba" strokeWidth="16"
    />
    <line
      x1="110" y1="-100" x2="110" y2="200"
      strokeLinecap="round" stroke="#2d7d95" strokeWidth="16"
    />
    <line
      x1="140" y1="-100" x2="140" y2="60"
      strokeLinecap="round" stroke="#abd6ba" strokeWidth="16"
    />
  </svg>
);

const LatestEntry = ({entry}) => (
  <li
    data-tooltip
    title="Domain entry"
  >
    <Link to={`/entry/interpro/${entry.accession}`}>
      <div className={f('svg-container')} >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"
          className={f('icon-list')}
        >
          <use href={`#type-${entry.type}`}/>
        </svg>
      </div>
      <div className={f('list-title')}>
        {entry.name}
        <span>({entry.accession})</span> -
        <i>{entry.counter} proteins matched</i>
        <br/>
      </div>
    </Link>
    <div className={f('list-body')}>
      {
        entry.contributing.map((c, j) => (
          <div className={f('list-more')} key={j}>
            <svg xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 72 72" className={f('md-small')}
            >
              <use href={`#md-${c.source_database.toUpperCase()}`} />
            </svg>
            <small>
              {c.source_database}:
              <Link
                to={`/entry/interpro/${c.source_database}/${c.accession}`}
                className={f('list-sign')}
              > {c.accession} </Link>
              ({entry.contributing.length} contributing signature)
            </small>
          </div>
        ))
      }
    </div>
  </li>
);
LatestEntry.propTypes = {
  entry: T.shape({
    accession: T.string,
    type: T.string,
    name: T.string,
    counter: T.number,
    contributing: T.array,
  }),
};

const Home = () => (
  <main>
    <div className={f('row')}>
      <div className={f('columns', 'large-12')}>

        <div className={'fig-container'} data-tooltip title="This is what InterPro does" >

          <InterproGraphic />

        </div>

        <h3>Classification of protein families</h3>

        <Description title=""
          textBlocks={[
            `InterPro provides functional analysis of proteins by classifying them into
             families and predicting domains and important sites. We combine protein
             signatures from a number of member databases into a single searchable
             resource, capitalising on their individual strengths to produce a powerful
             integrated database and diagnostic tool.`,
          ]}
        />

        <SearchByText />

      </div>
    </div>


    {// Browse entry & entry list
    }
    <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>

      <div className={f('columns', 'browse-by')}>

        <div className={f('callout')} data-equalizer-watch>

          <Tabs>
            <div title="by member database">
              <div className={f('row')}>
                {
                  memberDB.map((e, i) => (
                    <div
                      className={f('columns', 'medium-3', 'large-3', 'text-center')}
                      key={i}
                    >
                      <Link to={e.to} className={e.className}>
                        <MemberSymbol type={e.type}/>
                        <h6
                          data-tooltip
                          title={e.title}
                        >
                          {e.name}
                        </h6>
                        <p>
                          <small>{e.version}</small><br/>
                          <span >{e.counter} entries</span>
                        </p>

                      </Link>
                    </div>
                  ))
                }
              </div>

              <Link to="/entry" className={f('button')}>View all entries</Link>
            </div>

            {// panel2 - temp display block
            }
            <div title="by entry type">
               <div className={f('row')}>
                 {
                   entryType.map((e, i) => (
                     <div
                       className={f('columns', 'medium-4', 'large-4', 'text-center')}
                       key={i}
                     >
                       <a href="#" data-tooltip title={e.title}>
                         <div className={f('svg-container')}>
                           <InterproSymbol type={e.type}/>
                         </div>

                         <h5>
                           {e.type}
                           <span
                             className={f('small', 'icon', 'icon-generic')}
                             data-icon="i" data-tooltip
                             title={e.description}
                           />
                         </h5>
                         <p>{e.counter} entries<br/></p> </a>
                     </div>
                   ))
                 }
              </div>

              <a href="/entry" className={f('button')}>View all entries</a>

            </div>
            {// panel3
            }
            <div title="by species">
              test panel3
            </div>
            {// panel4
            }
            <div title="by GO terms">
              test panel4
            </div>
          </Tabs>


        </div>
        </div>

      <div className={f('columns', 'entry-list')}>
        {// Browse by latest entries or most popular
        }
        <div className={f('callout')} data-equalizer-watch>

          <Tabs>

            <div title="Latest entries">
              <div className={f('row', 'entrylatest-panel')}>
                <div className={f('columns')}>

                  <h5> <small>Total : 29415 entries</small></h5>
                  <div className={f('list-vertical-scrol')}>
                    <ul>
                      {
                        latests.map((e, i) => (
                          <LatestEntry entry={e} key={i} />
                        ))
                      }
                    </ul>
                  </div>
                  {// end list-vertical-scrol
                  }
                  <Link to="/entry" className={f('button')}>View all entries</Link>
                </div>
              </div>
              {// end row
              }
          </div>
          {// end panel01
          }
          <div title="Featured">
            <div className={f('row')}>
              Featured: Under Development
            </div>
           </div>
          {// end panel02
          }
          <div title="Most Popular">
            <div className={f('row')}>
              Most Popular: Under Development
            </div>
          </div>

        </Tabs>
        {// end anotherexample-tabs
        }


        </div>{// end callout
      }
      </div>{// end entry-list
    }

    </div> {// end Browse entry & entry list
  }

    <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')} data-equalizer>

    <div className={f('columns', 'publication-list')}>
      {// Tools & paper
      }
      <div className={f('callout')} data-equalizer-watch>


          <h5>Publications </h5>
          <a href="http://nar.oxfordjournals.org/content/43/D1/D213">
            <div className={f('media-object')}>
              <div className={f('media-object-section')}>
                <span className={f('icon', 'icon-conceptual')} data-icon="l">&nbsp;</span>
              </div>
             <div className={f('media-object-section')}>
                <p>
                  The InterPro protein families database: the classification resource
                  after 15 years <br/><i>Nucleic Acids Research</i>, 2015.
                </p>
              </div>
            </div>
          </a>

          <a href="http://database.oxfordjournals.org/content/2016/baw027.full">
            <div className={f('media-object')}>
              <div className={f('media-object-section')}>
                <span className={f('icon', 'icon-conceptual')} data-icon="l">&nbsp;</span>
              </div>
              <div className={f('media-object-section')}>
                <p>
                  GO annotation in InterPro: why stability does not indicate accuracy in a
                  sea of changing annotation. <br/><i>Database</i>, 2016.
                </p>
              </div>
            </div>
          </a>

          <a href="http://bioinformatics.oxfordjournals.org/content/30/9/1236">
            <div className={f('media-object')}>
              <div className={f('media-object-section')}>
                <span className={f('icon', 'icon-conceptual')} data-icon="l">&nbsp;</span>
               </div>
             <div className={f('media-object-section')}>
                <p>
                  InterProScan 5: genome-scale protein function classification.<br/>
                  <i>Bioinformatics</i>, 2014.
                </p>
              </div>
            </div>
          </a>

        <a href="/about/publications" className={f('button')}>View all publications</a>

        </div>{// end callout
      }

      </div>{// end columns publication list
    }


      <div className={f('columns', 'tools-list')}>
        {// Tools
        }
        <div className={f('callout')} data-equalizer-watch>


          <h5>Tools </h5>

          <div className={f('row')}>

            <div className={f('columns', 'medium-6', 'medium-push-6')}>

                  <h5>IDA</h5>
              <img src={idaLogo} style={{marginLeft: 40, marginBottom: 10}}/>
                  <p>
                    The InterPro Domain Architecture (IDA) tool allows you to search the
                    InterPro database with a particular set of domains, and returns all
                    of the domain architectures and associated proteins that match the
                    query.
                    <Link href="about/tools#ida" className={f('readmore')}
                      target="_blank"
                    >
                      Read more
                    </Link>
                  </p>

            </div>
            {// medium-6
            }

            <div className={f('columns', 'medium-6', 'medium-push-6')}>
            <h5>InterProScan</h5>
{// <img src="http://www.ebi.ac.uk/interpro/resources/images/logo_interproscan_214.png" />
}
              <img src={iscanLogo} style={{marginBottom: 2}}/>
            <p>
               InterProScan is a sequence analysis application (nucleotide and protein
              sequences) that combines different protein signature recognition methods
              into one resource.
              <Link
                href="about/tools#interproscan" className={f('readmore')} target="_blank"
              > Read more</Link>
            </p>
            </div>
            {// medium-6
          }

          </div>


          {// <a href="/about/tools" className={f('button')}>View all tools</a>
          }

        </div>{// end callout
      }

      </div>{// end columns publication list
    }


    </div>{// end row
  }

  </main>
);

export default Home;
