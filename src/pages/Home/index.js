import React, { PureComponent } from 'react';
import T from 'prop-types';

import loadable from 'higherOrder/loadable';
import ErrorBoundary from 'wrappers/ErrorBoundary';

import Link from 'components/generic/Link';
import Tabs from 'components/Tabs';
import Description from 'components/Description';

// Functions
import { schedule } from 'timing-functions/src';

// Animation
import { TweenLite, Expo } from 'gsap/all';

import {
  schemaProcessDataInterpro,
  schemaProcessDataForDB,
} from 'schema_org/processors';

// Style
import { foundationPartial } from 'styles/foundation';
// CSS
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.css';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import style from '../style.css';

import loadData from 'higherOrder/loadData';
import { getUrlForMeta } from 'higherOrder/loadData/defaults';

// Bind css with style object
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, style);

const MAX_DELAY_FOR_TWITTER = 10000;

const SchemaOrgData = loadable({
  loader: () => import(/* webpackChunkName: "schemaOrg" */ 'schema_org'),
  loading: () => null,
});

// Generate async components
// Search box
const SearchByText = loadable({
  loader: () =>
    import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
});
const IPScanSearch = loadable({
  loader: () =>
    import(/* webpackChunkName: "ipscan-search", webpackPreload: true */ 'components/IPScan/Search'),
});
// Browse by X box
const ByMemberDatabase = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-member-database", webpackPreload: true */ 'components/home/ByMemberDatabase'),
});
const ByEntryType = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-entry-type" */ 'components/home/ByEntryType'),
});
const BySpecies = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-species" */ 'components/home/BySpecies'),
});
const ByLatestEntries = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-latest-entries", webpackPreload: true */ 'components/home/ByLatestEntries'),
});
const BlogEntries = loadable({
  loader: () =>
    import(/* webpackChunkName: "blog-entries", webpackPreload: true */ 'components/home/BlogEntries'),
});

const Twitter = loadable({
  async loader() {
    await schedule(MAX_DELAY_FOR_TWITTER);
    return import(/* webpackChunkName: "twitter" */ 'components/Twitter');
  },
});

class InterProGraphicAnim extends PureComponent {
  // componentDidMount() {
  //   this._tl = new Timeline();
  //   this._tl.add('start');
  //   this._tl.staggerTo(
  //     `.${f('blob')}.${f('line-up')}`,
  //     1.5,
  //     {
  //       y: 160,
  //       ease: Expo.easeOut,
  //     },
  //     0.1,
  //     'start',
  //   );
  //   this._tl.staggerTo(
  //     `.${f('blob')}.${f('line-down')}`,
  //     1.5,
  //     {
  //       y: -160,
  //       ease: Expo.easeOut,
  //     },
  //     0.05,
  //     'start',
  //   );
  //   this._tl.pause();
  // }

  _handleMouseOver = () => {
    // this._tl.play();
    TweenLite.to('.blob:not(.high-blob)', 1, {
      opacity: 0.2,
    });
    TweenLite.to('.blob.line-up', 2, {
      y: 160,
      ease: Expo.easeOut,
    });
    TweenLite.to('.blob.line-down', 2, {
      y: -160,
      ease: Expo.easeOut,
    });
    TweenLite.to('.high-blob', 1, { opacity: 1, ease: Expo.easeOut });
  };

  _handleMouseOut = () => {
    // this._tl.reverse();
    TweenLite.to('.blob', 2, { y: 0, opacity: 1, ease: Expo.easeOut });
  };

  render() {
    return (
      <svg
        viewBox="38 4 150 120"
        width="100%"
        className={f('container-anim')}
        onMouseOver={this._handleMouseOver}
        onFocus={this._handleMouseOver}
        onMouseOut={this._handleMouseOut}
        onBlur={this._handleMouseOut}
      >
        <g transform="rotate(45, 100, 100)">
          <g>
            <line
              x1="20"
              y1="-200"
              x2="20"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              className={f('line')}
            />
            <line
              x1="20"
              y1="72"
              x2="20"
              y2="200"
              strokeLinecap="round"
              stroke="#147eaf"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="20"
              y1="-70"
              x2="20"
              y2="-200"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-up', 'high-blob')}
            />
          </g>
          <g>
            <line
              x1="50"
              y1="-200"
              x2="50"
              y2="200"
              strokeWidth="24"
              stroke="#cacaca"
              className={f('line')}
            />
            <line
              x1="50"
              y1="260"
              x2="50"
              y2="300"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className={f('blob', 'line-down')}
            />
            <line
              x1="50"
              y1="224"
              x2="50"
              y2="240"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-down', 'high-blob')}
            />
            <line
              x1="50"
              y1="-120"
              x2="50"
              y2="200"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className={f('blob', 'line-down')}
            />
          </g>
          <g>
            <line
              x1="80"
              y1="-200"
              x2="80"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              className={f('line')}
            />
            <line
              x1="80"
              y1="100"
              x2="80"
              y2="200"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="80"
              y1="66"
              x2="80"
              y2="80"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="80"
              y1="-50"
              x2="80"
              y2="44"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="80"
              y1="-80"
              x2="80"
              y2="-120"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-up', 'high-blob')}
            />
            <line
              x1="80"
              y1="-140"
              x2="80"
              y2="-140"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="80"
              y1="-160"
              x2="80"
              y2="-160"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="80"
              y1="-180"
              x2="80"
              y2="-200"
              strokeLinecap="round"
              stroke="grey"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
          </g>
          <g>
            <line
              x1="110"
              y1="-200"
              x2="110"
              y2="200"
              strokeWidth="24"
              stroke="#cacaca"
              className={f('line')}
            />
            <line
              x1="110"
              y1="270"
              x2="110"
              y2="270"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className={f('blob', 'line-down')}
            />
            <line
              x1="110"
              y1="220"
              x2="110"
              y2="230"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-down', 'high-blob')}
            />
            <line
              x1="110"
              y1="-100"
              x2="110"
              y2="200"
              strokeLinecap="round"
              stroke="#2d7d95"
              strokeWidth="16"
              className={f('blob', 'line-down')}
            />
            <line
              x1="110"
              y1="-120"
              x2="110"
              y2="-180"
              strokeLinecap="round"
              stroke="#2592c5"
              strokeWidth="16"
              className={f('blob', 'line-down')}
            />
          </g>
          <g>
            <line
              x1="140"
              y1="-200"
              x2="140"
              y2="200"
              strokeWidth="24"
              stroke="#dedede"
              id="line-l05"
              className={f('line')}
            />
            <line
              x1="140"
              y1="-60"
              x2="140"
              y2="60"
              strokeLinecap="round"
              stroke="#abd6ba"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
            <line
              x1="140"
              y1="-86"
              x2="140"
              y2="-110"
              strokeLinecap="round"
              stroke="#3daec0"
              strokeWidth="16"
              className={f('blob', 'line-up', 'high-blob')}
            />
            <line
              x1="140"
              y1="-130"
              x2="140"
              y2="-200"
              strokeLinecap="round"
              stroke="#147eaf"
              strokeWidth="16"
              className={f('blob', 'line-up')}
            />
          </g>
        </g>
      </svg>
    );
  }
}

const SchemaOrgDataWithData = loadData(getUrlForMeta)(
  class SchemaOrgDataWithData extends PureComponent {
    static propTypes = {
      data: T.shape({
        payload: T.shape({
          databases: T.object,
        }),
      }).isRequired,
    };

    render() {
      const databases =
        this.props.data &&
        this.props.data.payload &&
        this.props.data.payload.databases;
      if (!databases) return null;
      return (
        <SchemaOrgData
          data={{
            name: 'InterPro',
            location: window.location,
            version: databases && databases.interpro.version,
            releaseDate: databases && databases.interpro.releaseDate,
          }}
          processData={schemaProcessDataForDB}
        />
      );
    }
  },
);

const description = `
InterPro provides functional analysis of proteins by classifying them into families and predicting domains and important sites. To classify proteins in this way, InterPro uses predictive models, known as signatures, provided by several different databases (referred to as member databases) that make up the InterPro consortium. We combine protein signatures from these member databases into a single searchable resource, capitalising on their individual strengths to produce a powerful integrated database and diagnostic tool.
`.trim();

class Home extends PureComponent {
  render() {
    return (
      <>
        <div className={f('row')}>
          <div className={f('columns', 'large-12')}>
            <SchemaOrgData
              data={{ location: window.location, description }}
              processData={schemaProcessDataInterpro}
            />
            <SchemaOrgDataWithData />
            <div className={f('intro-wrapper')}>
              <div className={f('intro-fig')} data-testid="intro-fig">
                <InterProGraphicAnim />
              </div>
              <div className={f('intro-content')} data-testid="intro-content">
                <h3>Classification of protein families</h3>
                <Description textBlocks={[description]} />
              </div>
            </div>
          </div>
        </div>
        <div className={f('row')}>
          <div className={f('columns', 'large-12', 'margin-bottom-xlarge')}>
            <Tabs>
              <div title="Search by sequence">
                <ErrorBoundary>
                  <IPScanSearch />
                </ErrorBoundary>
              </div>
              <div title="Search by text">
                <ErrorBoundary>
                  <SearchByText />
                </ErrorBoundary>
              </div>
            </Tabs>
          </div>
        </div>
        {
          // Browse entry & entry list
        }
        <div
          className={f(
            'row',
            'small-up-1',
            'medium-up-1',
            'large-up-2',
            'margin-bottom-large',
          )}
        >
          <div className={f('columns')}>
            <div className={f('callout-box', 'pp-browse-by')}>
              <Tabs>
                <div
                  title="Member Database"
                  data-testid="home-member-database-button"
                >
                  <ByMemberDatabase />
                </div>
                <div title="Entry type" data-testid="home-entry-type-button">
                  <ByEntryType />
                </div>
                <div title="Species" data-testid="home-species-button">
                  <BySpecies />
                </div>
              </Tabs>
            </div>
          </div>

          <div className={f('columns')}>
            {
              // Browse by latest entries or most popular
            }
            <div className={f('callout-box')}>
              <Tabs>
                <div title="Latest entries">
                  <ByLatestEntries />
                </div>
                {
                  // <div title="Featured">
                  //  <div className={f('row')}>
                  //   <div className={f('columns')}>
                  //    <ByEntriesFeatured />
                  //  </div>
                  // </div>
                  // </div>
                }
                {
                  // <div title="My entries">
                  //   <div className={f('row')}>
                  //     <div className={f('columns')}>
                  //       <p>
                  //         You didn&#39;t &quot;save&quot; any entry yet. Please
                  //         use the{' '}
                  //         <Link
                  //           to={{ description: { other: ['settings'] } }}
                  //           className={f('icon', 'icon-common')}
                  //           data-icon="&#xf067;"
                  //           aria-label="add to your favorite"
                  //         />{' '}
                  //         icon next to an entry to add this entry to your
                  //         &quot;favorites&quot;. It should then appear on this
                  //         dedicated dashboard and in your settings.
                  //       </p>
                  //     </div>
                  //   </div>
                  // </div>
                }
              </Tabs>
            </div>
            {
              // end callout
            }
          </div>
          {
            // end entry-list
          }
        </div>
        {
          // end Browse entry & entry list
        }

        {
          // begin blog & protein focus
        }
        <div className={f('row', 'columns')}>
          <h3 className={f('light')}>In the spotlight</h3>
          <BlogEntries />
        </div>
        {
          // end blog & protein focus
        }

        {
          // begin tools
        }
        <div className={f('row', 'columns')}>
          <h3 className={f('light')}>Tools &amp; libraries</h3>
        </div>

        <section>
          <div className={f('row', 'columns', 'margin-bottom-large')}>
            <div className={f('flex-column')}>
              {
                // LiteMol
              }
              <div className={f('flex-card')}>
                <div className={f('card-image', 'image-tool-litemol')}>
                  <div className={f('card-tag', 'tag-tool')}>Library</div>
                </div>

                <div className={f('card-content')}>
                  <div className={f('card-title')}>
                    <h4>
                      <Link
                        href="//webchemdev.ncbr.muni.cz/Litemol/"
                        target="_blank"
                      >
                        LiteMol structure viewer
                      </Link>
                    </h4>
                  </div>
                  <div className={f('card-description')}>
                    Visualise protein structures using LiteMol, a powerful and
                    blazing-fast tool for handling 3D macromolecular data in the
                    browser.
                  </div>
                </div>

                <div className={f('card-more')}>
                  <Link href="//github.com/dsehnal/litemol" target="_blank">
                    <div
                      className={f(
                        'icon',
                        'icon-common',
                        'icon-right',
                        'button-nu',
                      )}
                    >
                      <em
                        className={f('icon', 'icon-common')}
                        data-icon="&#xf09b;"
                      />
                    </div>
                  </Link>

                  <Link
                    href="//webchemdev.ncbr.muni.cz/Litemol/"
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

              {
                // ProtVista
              }
              <div className={f('flex-card')}>
                <div className={f('card-image', 'image-tool-protvista')}>
                  <div className={f('card-tag', 'tag-tool')}>Library</div>
                </div>

                <div className={f('card-content')}>
                  <div className={f('card-title')}>
                    <h4>
                      <Link
                        href="//ebi-uniprot.github.io/ProtVista/developerGuide.html"
                        target="_blank"
                      >
                        Nigthtingale
                      </Link>
                    </h4>
                  </div>
                  <div className={f('card-description')}>
                    Nigthtingale is a monorepo containing visualisation web
                    components, including the formerly known Protvista, a
                    powerful and blazing-fast tool for handling protein sequence
                    visualisation in the browser. ProtVista has been developed
                    by UniProt.
                  </div>
                </div>

                <div className={f('card-more')}>
                  <Link
                    href="//github.com/ebi-webcomponents/nightingale"
                    target="_blank"
                  >
                    <div
                      className={f(
                        'icon',
                        'icon-common',
                        'icon-right',
                        'button-nu',
                      )}
                    >
                      <em
                        className={f('icon', 'icon-common')}
                        data-icon="&#xf09b;"
                      />
                    </div>
                  </Link>
                  <Link
                    href="//ebi-webcomponents.github.io/nightingale"
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

              {
                // InterProScan
              }
              <div className={f('flex-card')}>
                <div className={f('card-image', 'image-tool-ipscan')}>
                  <div className={f('card-tag', 'tag-tool')}>Tool</div>
                </div>

                <div className={f('card-content')}>
                  <div className={f('card-title')}>
                    <h4>
                      <Link
                        href="//github.com/ebi-pf-team/interproscan/wiki"
                        target="_blank"
                      >
                        InterProScan
                      </Link>
                    </h4>
                  </div>
                  <div className={f('card-description')}>
                    InterProScan is the software package that allows sequences
                    (protein and nucleic) to be scanned against InterPro&apos;s
                    signatures. Signatures are predictive models, provided by
                    several different databases, that make up the InterPro
                    consortium. InterProScan only runs on Linux machine.
                  </div>
                </div>

                <div className={f('card-more')}>
                  <Link
                    href="//github.com/ebi-pf-team/interproscan"
                    target="_blank"
                  >
                    <div
                      className={f(
                        'icon',
                        'icon-common',
                        'icon-right',
                        'button-nu',
                      )}
                    >
                      <em
                        className={f('icon', 'icon-common')}
                        data-icon="&#xf09b;"
                      />
                    </div>
                  </Link>

                  <Link
                    href="//github.com/ebi-pf-team/interproscan/wiki"
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

              {
                // new API
              }
              <div className={f('flex-card')}>
                <div className={f('card-image', 'image-tool-api')}>
                  <div className={f('card-tag', 'tag-tool')}>Tool</div>
                </div>

                <div className={f('card-content')}>
                  <div className={f('card-title')}>
                    <h4>
                      <Link href="//www.ebi.ac.uk/interpro/beta/api/static_files/swagger/">
                        A new API for InterPro
                      </Link>
                    </h4>
                  </div>
                  <div className={f('card-description')}>
                    You can now skip URL and use this JSON interface to work
                    with your data directly. Currently there are 6 main
                    endpoints: entry, protein, structure, taxonomy, proteome and
                    set.
                  </div>
                </div>

                <div className={f('card-more')}>
                  <Link href="//www.ebi.ac.uk/interpro/beta/api/static_files/swagger/">
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
          </div>
        </section>

        {
          // Begin Publications and tools
        }
        {
          // <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>
          //     <div className={f('columns', 'publication-list')}>
          //       <div className={f('callout')}>
          //         <h5>Publications</h5>
          //         <Link href="http://nar.oxfordjournals.org/content/43/D1/D213">
          //           <div className={f('media-object')}>
          //             <div className={f('media-object-section')}>
          //               <span
          //                 className={f('icon', 'icon-conceptual')}
          //                 data-icon="l"
          //               >
          //                 &nbsp;
          //               </span>
          //             </div>
          //             <div className={f('media-object-section')}>
          //               <p>
          //                 The InterPro protein families database: the classification
          //                 resource after 15 years <br />
          //                 <i>Nucleic Acids Research</i>, 2015.
          //               </p>
          //             </div>
          //           </div>
          //         </Link>
          //         <Link href="http://database.oxfordjournals.org/content/2016/baw027.full">
          //           <div className={f('media-object')}>
          //             <div className={f('media-object-section')}>
          //               <span
          //                 className={f('icon', 'icon-conceptual')}
          //                 data-icon="l"
          //               >
          //                 &nbsp;
          //               </span>
          //             </div>
          //             <div className={f('media-object-section')}>
          //               <p>
          //                 GO annotation in InterPro: why stability does not indicate
          //                 accuracy in a sea of changing annotation.
          //                 <br />
          //                 <i>Database</i>, 2016.
          //               </p>
          //             </div>
          //           </div>
          //         </Link>
          //
          //         <Link href="http://bioinformatics.oxfordjournals.org/content/30/9/1236">
          //           <div className={f('media-object')}>
          //             <div className={f('media-object-section')}>
          //               <span
          //                 className={f('icon', 'icon-conceptual')}
          //                 data-icon="l"
          //               >
          //                 &nbsp;
          //               </span>
          //             </div>
          //             <div className={f('media-object-section')}>
          //               <p>
          //                 InterProScan 5: genome-scale protein function
          //                 classification.
          //                 <br />
          //                 <i>Bioinformatics</i>, 2014.
          //               </p>
          //             </div>
          //           </div>
          //         </Link>
          //         <Link
          //           to={{
          //             description: {
          //               other: ['help', 'documentation', 'publication'],
          //             },
          //           }}
          //           className={f('button')}
          //         >
          //           View all publications
          //         </Link>
          //       </div>
          // </div>
          //   <div className={f('columns', 'tools-list')}>
          //
          //     <div className={f('callout')}>
          //       <h5>Tools</h5>
          //
          //       <div className={f('row')}>
          //         <div className={f('columns', 'medium-6')}>
          //           <h5>IDA</h5>
          //           <LazyImage
          //             alt="IDA logo"
          //             src={idaLogo}
          //             className={local['ida-logo']}
          //           />
          //           <p>
          //             The InterPro Domain Architecture (IDA) tool allows you to
          //             search the InterPro database with a particular set of
          //             domains, and returns all of the domain architectures and
          //             associated proteins that match the query.{' '}
          //             <Link
          //               to={{
          //                   description: { other: ['about'] },
          //                   hash: 'tools-ida',
          //                 }}
          //               className={f('readmore')}
          //             >
          //               Read more
          //             </Link>
          //           </p>
          //         </div>
          //         <div className={f('columns', 'medium-6')}>
          //           <h5>InterProScan</h5>
          //           <LazyImage
          //             alt="InterProScan logo"
          //             src={ipscanLogo}
          //             className={local['ipscan-logo']}
          //           />
          //           <p>
          //             InterProScan is a sequence analysis application (nucleotide
          //             and protein sequences) that combines different protein
          //             signature recognition methods into one resource.{' '}
          //             <Link
          //               to={{
          //                   description: { other: ['about'] },
          //                   hash: 'tools-interproscan',
          //                 }}
          //               className={f('readmore')}
          //             >
          //               Read more
          //             </Link>
          //           </p>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>
        }

        <ErrorBoundary>
          <Twitter />
        </ErrorBoundary>
      </>
    );
  }
}

export default Home;
