import React from 'react';

// Components
import AsyncComponent, {
  createAsyncComponent,
} from 'utilityComponents/AsyncComponent';
import Link from 'components/generic/Link';
import Tabs from 'components/Tabs';
import Description from 'components/Description';

// Functions
import { schedule } from 'timing-functions/src';

// Style
import { foundationPartial } from 'styles/foundation';
// CSS
import ipro from 'styles/interpro-new.css';
import ebiGlobalStyles from 'ebi-framework/css/ebi-global.scss';
import fonts from 'EBI-Icon-fonts/fonts.css';
import theme from 'styles/theme-interpro.css';
import style from './style.css';

// Images
import iscanLogo from 'images/logo_interproscan_ext.png';
import idaLogo from 'images/logo_ida_100.png';

// Bind css with style object
const f = foundationPartial(ebiGlobalStyles, fonts, ipro, theme, style);

// Generate async components
// Search box
const SearchByText = createAsyncComponent(() =>
  import(/* webpackChunkName: "search-by-text" */ 'components/SearchByText'),
);
const IPScanSearch = createAsyncComponent(() =>
  import(/* webpackChunkName: "ipscan-search" */ 'components/IPScanSearch'),
);
const IPScanStatus = createAsyncComponent(() =>
  import(/* webpackChunkName: "ipscan-status" */ 'components/IPScanStatus'),
);
// Browse by X box
const ByMemberDatabase = createAsyncComponent(() =>
  import(/* webpackChunkName: "by-member-database" */ 'components/home/ByMemberDatabase'),
);
const ByEntryType = createAsyncComponent(() =>
  import(/* webpackChunkName: "by-entry-type" */ 'components/home/ByEntryType'),
);
const BySpecies = createAsyncComponent(() =>
  import(/* webpackChunkName: "by-species" */ 'components/home/BySpecies'),
);
const ByLatestEntries = createAsyncComponent(() =>
  import(/* webpackChunkName: "by-latest-entries" */ 'components/home/ByLatestEntries'),
);
const ByGOTerms = createAsyncComponent(() =>
  import(/* webpackChunkName: "by-go-terms" */ 'components/home/ByGOTerms'),
);

const MaskSvgIcons = () =>
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
  </svg>;

const Home = () =>
  <div>
    <div className={f('row')}>
      <div className={f('columns', 'large-12')}>
        <div
          className={f('fig-container', 'fig-proteins')}
          data-tooltip
          title="This is what InterPro does"
        />

        <h3>Classification of protein families</h3>

        <Description
          title=""
          extraTextForButton="about InterPro"
          heightToHide={106}
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
              <IPScanStatus refreshRate={120000} />
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
              <img src={idaLogo} style={{ marginLeft: 40, marginBottom: 10 }} />
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
              <img src={iscanLogo} style={{ marginBottom: 2 }} />
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
    <AsyncComponent
      getComponent={async () => {
        // eslint-disable-next-line no-magic-numbers
        await schedule(10000); // Schedule asap, but do it anyway after 10s
        return import(/* webpackChunkName: "twitter" */ 'components/Twitter');
      }}
    />
  </div>;

export default Home;
