import React, { PureComponent } from 'react';

// Components
import loadable from 'higherOrder/loadable';
import Link from 'components/generic/Link';
import Tabs from 'components/Tabs';
import Description from 'components/Description';

// Functions
import { schedule } from 'timing-functions/src';

// Animation
import 'gsap/TweenMax';
// import Timeline from 'gsap/TimelineLite';
import TweenLite from 'gsap/TweenLite';
import { Expo } from 'gsap/EasePack';

// Style
import { foundationPartial } from 'styles/foundation';
// CSS
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import style from '../style.css';

// Images
import iscanLogo from 'images/logo_interproscan_ext.png';
import idaLogo from 'images/logo_ida_100.png';

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
    import(/* webpackChunkName: "ipscan-search" */ 'components/IPScan/Search'),
});
// Browse by X box
const ByMemberDatabase = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-member-database" */ 'components/home/ByMemberDatabase'),
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
    import(/* webpackChunkName: "by-latest-entries" */ 'components/home/ByLatestEntries'),
});
const ByGOTerms = loadable({
  loader: () =>
    import(/* webpackChunkName: "by-go-terms" */ 'components/home/ByGOTerms'),
});

const Twitter = loadable({
  loader: () =>
    schedule(MAX_DELAY_FOR_TWITTER).then(() =>
      import(/* webpackChunkName: "twitter" */ 'components/Twitter'),
    ),
});

const MaskSvgIcons = () => (
  <svg
    viewBox="0 0 200 200"
    style={{
      position: 'fixed',
      width: 0,
      height: 0,
      top: -1800,
      left: -1800,
      /* to hide SVG on the page as display:none is not working */
    }}
  >
    <defs>
      <clipPath id="cut-off-center">
        <rect x="33%" y="38%" width="68" height="68" />
      </clipPath>
      <clipPath id="cut-off-bottom">
        <polygon points="0,68 68,0 68,68" />
      </clipPath>
    </defs>
  </svg>
);

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
        <g transform="rotate(45)" transform-origin="100 100">
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

const InterproGraphicStatic = () => (
  <svg viewBox="10 30 130 110" className={f('svg-anim')}>
    <g>
      <g>
        <line
          x1="20"
          y1="0"
          x2="20"
          y2="200"
          strokeWidth="3"
          stroke="#cacaca"
          id="line-l01"
          className={f('line')}
        />
        <line
          x1="20"
          y1="-100"
          x2="20"
          y2="200"
          strokeLinecap="round"
          stroke="#147eaf"
          strokeWidth="16"
          id="blob-l01"
          className={f('test-up')}
        />
      </g>
      <g>
        <line
          x1="50"
          y1="0"
          x2="50"
          y2="200"
          strokeWidth="24"
          stroke="#cacaca"
          id="line-l02"
          className={f('line')}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="200"
          strokeLinecap="round"
          stroke="#2592c5"
          strokeWidth="16"
          id="blob-l02"
          className={f('test-down')}
        />
      </g>
      <g>
        <line
          x1="80"
          y1="0"
          x2="80"
          y2="200"
          strokeWidth="24"
          stroke="#cacaca"
          id="line-l03"
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
          id="blob-l03-1"
          className={f('test-up')}
        />
        <line
          x1="80"
          y1="66"
          x2="80"
          y2="80"
          strokeLinecap="round"
          stroke="#3daec0"
          strokeWidth="16"
          id="blob-l03-2"
          className={f('test-up')}
        />
        <line
          x1="80"
          y1="-100"
          x2="80"
          y2="44"
          strokeLinecap="round"
          stroke="#2d7d95"
          strokeWidth="16"
          id="blob-l03-3"
          className={f('test-up')}
        />
      </g>
      <g>
        <line
          x1="110"
          y1="0"
          x2="110"
          y2="200"
          strokeWidth="24"
          stroke="#cacaca"
          id="line-l04"
          className={f('line')}
        />
        <line
          x1="110"
          y1="-100"
          x2="110"
          y2="200"
          strokeLinecap="round"
          stroke="#2d7d95"
          strokeWidth="16"
          id="blob-l04"
          className={f('test-down')}
        />
      </g>
      <g>
        <line
          x1="140"
          y1="0"
          x2="140"
          y2="200"
          strokeWidth="24"
          stroke="#cacaca"
          id="line-l05"
          className={f('line')}
        />
        <line
          x1="140"
          y1="-100"
          x2="140"
          y2="60"
          strokeLinecap="round"
          stroke="#3daec0"
          strokeWidth="16"
          id="blob-l05"
          className={f('test-up')}
        />
      </g>
    </g>
  </svg>
);

const description = `
InterPro provides functional analysis of proteins by classifying them into
families and predicting domains and important sites. We combine protein
signatures from a number of member databases into a single searchable
resource, capitalising on their individual strengths to produce a powerful
integrated database and diagnostic tool. To classify proteins in this way,
InterPro uses predictive models, known as signatures, provided by several
different databases (referred to as member databases) that make up the
InterPro consortium.`.trim();

const schemaProcessData = () => ({
  '@type': 'DataCatalog',
  '@id': '@mainEntityOfPage',
  name: 'InterPro',
  description,
  url: window.location.href,
  keywords: ['InterPro', 'Domain', 'Family', 'Annotation', 'Protein'],
  provider: {
    '@type': 'Organization',
    name: 'European Bioinformatics Institute',
    url: 'https://www.ebi.ac.uk/',
  },
  dataset: '@dataset',
});

const schemaProcessDataForDB = name => ({
  '@type': 'Dataset',
  '@id': '@dataset',
  name,
  identifier: name,
  version: 64,
  url: `${window.location.href}/entry/${name}`,
});

const Home = () => (
  <div>
    <div className={f('row')}>
      <div className={f('columns', 'large-12')}>
        <SchemaOrgData processData={schemaProcessData} />
        <SchemaOrgData data="InterPro" processData={schemaProcessDataForDB} />
        <div className={f('container-intro')}>
          <div
            className={f('fig-container')}
            data-tooltip
            title="Domain analysis and prediction on multiple protein sequences"
          >
            <InterProGraphicAnim />
          </div>

          <h3>Classification of protein families</h3>

          <Description
            extraTextForButton="about InterPro"
            heightToHide={106}
            textBlocks={[description]}
          />
        </div>
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
    {
      // Browse entry & entry list
    }
    <div className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}>
      <div className={f('columns', 'browse-by')}>
        <div className={f('callout')} data-equalizer-watch>
          <MaskSvgIcons />

          <Tabs>
            <div title="by member database">
              <ByMemberDatabase />
            </div>
            <div title="by entry type">
              <ByEntryType />
            </div>
            <div title="by species">
              <BySpecies />
            </div>
            <div title="by GO terms" className={f('go-list')}>
              <ByGOTerms />
            </div>
          </Tabs>
        </div>
      </div>

      <div className={f('columns', 'stat-by')}>
        {
          // Browse by latest entries or most popular
        }
        <div className={f('callout')} data-equalizer-watch>
          <Tabs>
            <div title="Latest entries">
              <ByLatestEntries />
            </div>
            <div title="Featured">
              <div className={f('row')}>
                <div className={f('columns')}>Featured: Under development</div>
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
    </div>{' '}
    {
      // end Browse entry & entry list
    }
    <div
      className={f('row', 'small-up-1', 'medium-up-1', 'large-up-2')}
      data-equalizer
    >
      <div className={f('columns', 'publication-list')}>
        <div className={f('callout')} data-equalizer-watch>
          <h5>Publications </h5>
          <Link href="http://nar.oxfordjournals.org/content/43/D1/D213">
            <div className={f('media-object')}>
              <div className={f('media-object-section')}>
                <span className={f('icon', 'icon-conceptual')} data-icon="l">
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
                <span className={f('icon', 'icon-conceptual')} data-icon="l">
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
                <span className={f('icon', 'icon-conceptual')} data-icon="l">
                  &nbsp;
                </span>
              </div>
              <div className={f('media-object-section')}>
                <p>
                  InterProScan 5: genome-scale protein function classification.
                  <br />
                  <i>Bioinformatics</i>, 2014.
                </p>
              </div>
            </div>
          </Link>

          <Link
            newTo={{
              description: { other: 'about' },
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
        <div className={f('callout')} data-equalizer-watch>
          <h5>Tools </h5>

          <div className={f('row')}>
            <div className={f('columns', 'medium-6')}>
              <h5>IDA</h5>
              <img
                alt="IDA logo"
                src={idaLogo}
                style={{ marginLeft: 40, marginBottom: 10 }}
              />
              <p>
                The InterPro Domain Architecture (IDA) tool allows you to search
                the InterPro database with a particular set of domains, and
                returns all of the domain architectures and associated proteins
                that match the query.
                <Link
                  newTo={{
                    description: { other: 'about' },
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
              <img
                alt="InterProScan logo"
                src={iscanLogo}
                style={{ marginBottom: 2 }}
              />
              <p>
                InterProScan is a sequence analysis application (nucleotide and
                protein sequences) that combines different protein signature
                recognition methods into one resource.
                <Link
                  newTo={{
                    description: { other: 'about' },
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
  </div>
);

export default Home;
