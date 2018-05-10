import React, { PureComponent, Fragment } from 'react';
import T from 'prop-types';

// Components
import Tooltip from 'components/SimpleCommonComponents/Tooltip';

import loadable from 'higherOrder/loadable';

import Link from 'components/generic/Link';
import Tabs from 'components/Tabs';
import Description from 'components/Description';
import LazyImage from 'components/LazyImage';

// Functions
import { schedule } from 'timing-functions/src';

// Animation
import 'gsap/TweenMax';
// import Timeline from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import { Expo } from 'gsap/EasePack';

import {
  schemaProcessDataInterpro,
  schemaProcessDataForDB,
} from 'schema_org/processors';

// Style
import { foundationPartial } from 'styles/foundation';
// CSS
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import style from '../style.css';

import local from './style.css';

// Images
import ipscanLogo from 'images/logo_interproscan_ext.png';
import idaLogo from 'images/logo_ida_100.png';

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

const description = `
InterPro provides functional analysis of proteins by classifying them into
families and predicting domains and important sites. We combine protein
signatures from a number of member databases into a single searchable
resource, capitalising on their individual strengths to produce a powerful
integrated database and diagnostic tool. To classify proteins in this way,
InterPro uses predictive models, known as signatures, provided by several
different databases (referred to as member databases) that make up the
InterPro consortium.`.trim();

class Home extends PureComponent {
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
    return (
      <Fragment>
        <div className={f('row')}>
          <div className={f('columns', 'large-12')}>
            <SchemaOrgData
              data={{ location: window.location, description }}
              processData={schemaProcessDataInterpro}
            />
            {databases && (
              <SchemaOrgData
                data={{
                  name: 'InterPro',
                  location: window.location,
                  version: databases && databases.interpro.version,
                  releaseDate: databases && databases.interpro.releaseDate,
                }}
                processData={schemaProcessDataForDB}
              />
            )}
            <div className={f('container-intro')}>
              <div className={f('fig-container')}>
                <Tooltip title="Domain analysis and prediction on multiple protein sequences">
                  <InterProGraphicAnim />
                </Tooltip>
              </div>
              <h3>Classification of protein families</h3>
              <Description textBlocks={[description]} />
            </div>
          </div>
        </div>
        <div className={f('row')}>
          <div className={f('columns', 'large-12', 'margin-bottom-xlarge')}>
            <Tabs>
              <div title="Search by sequence">
                <IPScanSearch />
              </div>
              <div title="Search by text">
                <SearchByText />
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
          <div className={f('columns', 'browse-by')}>
            <div className={f('callout-box')}>
              <Tabs>
                <div title="Member Database">
                  <ByMemberDatabase />
                </div>
                <div title="Entry type">
                  <ByEntryType />
                </div>
                <div title="Species">
                  <BySpecies />
                </div>
              </Tabs>
            </div>
          </div>

          <div className={f('columns', 'stat-by')}>
            {
              // Browse by latest entries or most popular
            }
            <div className={f('callout-box')}>
              <Tabs>
                <div title="Latest entries">
                  <ByLatestEntries />
                </div>
                <div title="Featured">
                  <div className={f('row')}>
                    <div className={f('columns')}>
                      Featured: Under development
                    </div>
                  </div>
                </div>
                <div title="Most Popular">
                  <div className={f('row')}>
                    <div className={f('columns')}>
                      Most Popular: Under Development
                    </div>
                  </div>
                </div>
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
        <BlogEntries />
        <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>
          <div className={f('columns', 'publication-list')}>
            <div className={f('callout')}>
              <h5>Publications</h5>
              <Link href="http://nar.oxfordjournals.org/content/43/D1/D213">
                <div className={f('media-object')}>
                  <div className={f('media-object-section')}>
                    <span
                      className={f('icon', 'icon-conceptual')}
                      data-icon="l"
                    >
                      &nbsp;
                    </span>
                  </div>
                  <div className={f('media-object-section')}>
                    <p>
                      The InterPro protein families database: the classification
                      resource after 15 years <br />
                      <i>Nucleic Acids Research</i>, 2015.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="http://database.oxfordjournals.org/content/2016/baw027.full">
                <div className={f('media-object')}>
                  <div className={f('media-object-section')}>
                    <span
                      className={f('icon', 'icon-conceptual')}
                      data-icon="l"
                    >
                      &nbsp;
                    </span>
                  </div>
                  <div className={f('media-object-section')}>
                    <p>
                      GO annotation in InterPro: why stability does not indicate
                      accuracy in a sea of changing annotation.<br />
                      <i>Database</i>, 2016.
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="http://bioinformatics.oxfordjournals.org/content/30/9/1236">
                <div className={f('media-object')}>
                  <div className={f('media-object-section')}>
                    <span
                      className={f('icon', 'icon-conceptual')}
                      data-icon="l"
                    >
                      &nbsp;
                    </span>
                  </div>
                  <div className={f('media-object-section')}>
                    <p>
                      InterProScan 5: genome-scale protein function
                      classification.
                      <br />
                      <i>Bioinformatics</i>, 2014.
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                to={{
                  description: { other: ['about'] },
                  hash: 'publications',
                }}
                className={f('button')}
              >
                View all publications
              </Link>
            </div>
            {
              // end callout
            }
          </div>
          {
            // end columns publication list
          }

          <div className={f('columns', 'tools-list')}>
            {
              // Tools
            }
            <div className={f('callout')}>
              <h5>Tools</h5>

              <div className={f('row')}>
                <div className={f('columns', 'medium-6')}>
                  <h5>IDA</h5>
                  <LazyImage
                    alt="IDA logo"
                    src={idaLogo}
                    className={local['ida-logo']}
                  />
                  <p>
                    The InterPro Domain Architecture (IDA) tool allows you to
                    search the InterPro database with a particular set of
                    domains, and returns all of the domain architectures and
                    associated proteins that match the query.{' '}
                    <Link
                      to={{
                        description: { other: ['about'] },
                        hash: 'tools-ida',
                      }}
                      className={f('readmore')}
                    >
                      Read more
                    </Link>
                  </p>
                </div>
                <div className={f('columns', 'medium-6')}>
                  <h5>InterProScan</h5>
                  <LazyImage
                    alt="InterProScan logo"
                    src={ipscanLogo}
                    className={local['ipscan-logo']}
                  />
                  <p>
                    InterProScan is a sequence analysis application (nucleotide
                    and protein sequences) that combines different protein
                    signature recognition methods into one resource.{' '}
                    <Link
                      to={{
                        description: { other: ['about'] },
                        hash: 'tools-interproscan',
                      }}
                      className={f('readmore')}
                    >
                      Read more
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Twitter />
      </Fragment>
    );
  }
}

export default loadData(getUrlForMeta)(Home);
