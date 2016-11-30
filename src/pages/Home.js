// @flow
import React, {PropTypes as T} from 'react';
import {foundationPartial} from 'styles/foundation';
import SearchByText from 'components/SearchByText';
import IPScanSearch from 'components/IPScanSearch';
import Description from 'components/Description';
import {InterproSymbol} from 'components/Title';
import MemberSymbol from 'components/Entry/MemberSymbol';
import {Link} from 'react-router/es';
import {memberDB, entryType, latests, speciesFeat, GoList} from 'staticData/home';
import Tabs from 'components/Tabs';
import Twit from 'components/Twitter';

import iscanLogo from 'images/logo_interproscan_ext.png';
import idaLogo from 'images/logo_ida_100.png';

import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'styles/ebi-global.css';
import fonts from 'styles/ebi/fonts.css';
import theme from 'styles/theme-interpro.css';

const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme);

const MaskSvgIcons = () => (
<svg xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 200 200"
  style={{
    position: 'fixed',
    width: 0,
    height: 0,
    top: -1800,
    left: -1800,
  /* to hide SVG on the page as display:none is not working*/
  }}
>
  <defs>
    <clipPath id="cut-off-center" >
      <rect x="33%" y="33%" width="70" height="70"/>
    </clipPath>

    <clipPath id="cut-off-bottom" >
      <polygon points="0,68 68,0 68,68" />
    </clipPath>
  </defs>
</svg>
);

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
  // this should change depending on entry type
  <li className={f('list-item')}
    data-tooltip
    title="Domain entry"
  >

      <div className={f('svg-container')} >
        <InterproSymbol type={entry.type} className={f('icon-list')} />
      </div>

      <div className={f('list-body')}>
       <Link to={`/entry/interpro/${entry.accession}`}>
      <div className={f('list-title')}>
        {entry.name}
        <span>({entry.accession})</span> -
        <i>{entry.counter} proteins matched</i>
        <br/>
      </div>
      </Link>

      {
        entry.contributing.map((c, j) => (
          <div className={f('list-more')} key={j}>
            <MemberSymbol type={c.source_database} className={f('md-small')} />
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

        <Description
          title=""
          extraTextForButton="about InterPro"
          heightToHide={100}
          textBlocks={[
            `InterPro provides functional analysis of proteins by classifying them into
             families and predicting domains and important sites. We combine protein
             signatures from a number of member databases into a single searchable
             resource, capitalising on their individual strengths to produce a powerful
             integrated database and diagnostic tool. To classify proteins in this way,
             InterPro uses predictive models, known as signatures, provided by several
             different databases (referred to as member databases) that make up the
             InterPro consortium.`,
          ]}
        />


        <fieldset className={f('fieldset')}>
          <legend>Search InterPro</legend>
          <Tabs>
            <div title="by text">
              <SearchByText />
            </div>
            <div title="by sequence">
              <IPScanSearch />
            </div>
          </Tabs>
        </fieldset>


      </div>
    </div>


    {// Browse entry & entry list
    }
    <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>

      <div className={f('columns', 'browse-by')}>

        <div className={f('callout')} data-equalizer-watch>

          <MaskSvgIcons />

          <Tabs>
            <div title="by member database" className={f('md-list')}>
              <div className={f('row')}>
                {
                  memberDB.map((e, i) => (
                    <div
                      className={f('columns', 'medium-3', 'large-3', 'text-center')}
                      key={i}
                    >
                      <Link to={e.to}>
                        <MemberSymbol type={e.type}/>
                        <h6
                          data-tooltip
                          title={e.title}
                        >
                          {e.name}
                        </h6>
                        <p>
                          <small>{e.version}</small><br/>
                          <span >{e.counter} {e.type === 'new' ? '' : 'entries'}</span>
                        </p>

                      </Link>
                    </div>
                  ))
                }
              </div>

              <Link to="/entry" className={f('button')}>View all entries</Link>
            </div>

            {// panel2 - by entry type
            }
            <div title="by entry type" className={f('entry-type')}>
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
                           &nbsp;<span
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
            {// panel 3 - by species
            }
            <div title="by species" className={f('species-list')}>
              <div className={f('row')}>
                {
                  speciesFeat.map((e, i) => (
                    <div
                      className={f('columns', 'medium-3', 'large-3', 'text-center')}
                      key={i}
                    >
                      <a href="#" data-tooltip title={e.description}>
                        <span
                          style={{color: e.color}}
                          className={f('small', 'icon', 'icon-species')}
                          data-icon={e.icon} data-tooltip
                        />
                        <h6>
                          {e.title}
                        </h6>
                        <p>{e.counterD} entries <br/>
                          <small>({e.counterS} proteins)</small>
                        </p>
                      </a>
                    </div>
                  ))
                }

              </div>
            </div>
            {// panel4- By Go terms
            }
            <div title="by GO terms" className={f('go-list')}>
                <div className={f('row')}>
                  {
                    GoList.map((e, i) => (
                      <div
                        className={f('columns', 'medium-3', 'large-3', 'text-center')}
                        key={i}
                      >
                        <a href="#" data-tooltip title={e.description}>
                          <span
                            style={{color: e.color}}
                            className={f('small', 'bullet-icon')}
                            data-tooltip title={e.category}
                          >&bull;</span>
                          <h6>
                            {e.title}&nbsp;
                            <span
                              className={f('small', 'icon', 'icon-generic')}
                              data-icon="i" data-tooltip
                              title={e.description}
                            />
                          </h6>
                          <p>
                            {e.counterD} entries <br/>
                            <small>({e.counterS} proteins)</small>
                          </p>
                        </a>
                      </div>
                    ))
                  }

                </div>

              <Link to="/browse/Goterms" className={f('button')}>View all Go terms</Link>

            </div>
          </Tabs>


        </div>
        </div>

      <div className={f('columns', 'entry-list')}>
        {// Browse by latest entries or most popular
        }
        <div className={f('callout')} data-equalizer-watch>

          <Tabs>

            <div title="Latest entries" className={f('entry-list')}>
              <div className={f('row')}>
                <div className={f('columns')}>

                  <h5><small> Total : 29415 entries</small></h5>
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
              <div className={f('columns')}>Featured: Under development</div>
            </div>
           </div>
          {// end panel02
          }
          <div title="Most Popular">
            <div className={f('row')}>
              <div className={f('columns')}>Most Popular: Under Development</div>
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
    <div className={f('expanded', 'row')}>

      <div className={f('columns')}>
        <div className={'jumbo-news'} >
          <div className={'jumbo-news-container'} >
          <h3 className={f('icon', 'icon-socialmedia', 'icon-s2')} data-icon="T" />
{
// <a href="#">InterPro 60.0 now available with a new member db: MobiDB Lite, residue
// annotation and covers 79.8% of UniProtKB. See http://www.ebi.ac.uk/interpro/</a>
// <h5><a href=""> Tweets by ‎‏@InterProDB</a></h5>
// would be nice to extract just the text from twitter widget as we do for EMG
}
          <Twit />

          </div>
        </div>{// end jumbo-news
      }

      </div>{// end columns
    }

      </div>{// end row
    }
  </main>


);

export default Home;
